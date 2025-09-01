"""
RAG Service for chunking, embedding, and retrieval operations
"""

import os
import time
from typing import List, Optional
from uuid import UUID
import logging

from chonkie import TokenChunker
from google import genai
from dotenv import load_dotenv

from .models import DocumentChunk, DocumentMetadata, ChunkType, SearchRequest, SearchResult
from .storage_service import StorageService

load_dotenv()

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        # Initialize Google GenAI client
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        if not self.google_api_key:
            raise ValueError("Missing GOOGLE_API_KEY in environment variables")
        
        self.genai_client = genai.Client(api_key=self.google_api_key)
        
        # Initialize chunker with optimal settings for RAG
        self.chunker = TokenChunker(
            chunk_size=512,  # Good balance for context and retrieval
            chunk_overlap=64,  # 12.5% overlap for context continuity
        )
        
        # Initialize storage service
        self.storage = StorageService()
        
        # Embedding model configuration
        self.embedding_model = "gemini-embedding-001" 
        self.embedding_dimension = 3072  # gemini-embedding-001 dimensions
    
    async def process_content(
        self, 
        markdown_content: str, 
        metadata: DocumentMetadata
    ) -> List[DocumentChunk]:
        """
        Process markdown content into chunks with embeddings
        """
        logger.info(f"Processing content for document {metadata.document_id}")
        
        try:
            # 1. Chunk the content
            chunks = self._chunk_content(markdown_content)
            logger.info(f"Created {len(chunks)} chunks")
            
            # 2. Create DocumentChunk objects
            document_chunks = []
            for i, chunk_text in enumerate(chunks):
                # Generate embedding for this chunk
                embedding = await self._generate_embedding(chunk_text)
                
                # Determine chunk type (basic heuristics)
                chunk_type = self._determine_chunk_type(chunk_text)
                
                document_chunk = DocumentChunk(
                    document_id=metadata.document_id,
                    workspace_id=metadata.workspace_id,
                    user_id=metadata.user_id,
                    chunk_text=chunk_text,
                    chunk_index=i,
                    chunk_type=chunk_type,
                    token_count=len(chunk_text.split()),  # Rough token count
                    character_count=len(chunk_text),
                    embedding=embedding,
                    embedding_model=self.embedding_model,
                    chunking_strategy="token"
                )
                document_chunks.append(document_chunk)
            
            # 3. Store chunks in database
            success = await self.storage.store_chunks(document_chunks)
            if not success:
                raise Exception("Failed to store chunks in database")
            
            logger.info(f"Successfully processed and stored {len(document_chunks)} chunks")
            return document_chunks
            
        except Exception as e:
            logger.error(f"Error processing content: {str(e)}")
            raise
    
    def _chunk_content(self, content: str) -> List[str]:
        """Chunk content using TokenChunker"""
        try:
            # Use Chonkie's TokenChunker
            chunks = self.chunker.chunk(content)
            return [chunk.text for chunk in chunks]
        except Exception as e:
            logger.error(f"Error chunking content: {str(e)}")
            # Fallback to simple splitting if chunker fails
            return self._simple_chunk(content)
    
    def _simple_chunk(self, content: str, chunk_size: int = 1000) -> List[str]:
        """Fallback chunking method"""
        words = content.split()
        chunks = []
        current_chunk = []
        current_length = 0
        
        for word in words:
            current_chunk.append(word)
            current_length += len(word) + 1  # +1 for space
            
            if current_length >= chunk_size:
                chunks.append(" ".join(current_chunk))
                current_chunk = []
                current_length = 0
        
        # Add the last chunk if it exists
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        
        return chunks
    
    def _determine_chunk_type(self, chunk_text: str) -> ChunkType:
        """Determine the type of chunk based on content"""
        # Simple heuristics - can be improved with ML models
        text_lower = chunk_text.lower().strip()
        
        # Check for table indicators
        if "|" in chunk_text and "---" in chunk_text:
            return ChunkType.TABLE
        
        # Check for headings (markdown headers)
        if text_lower.startswith("#"):
            return ChunkType.HEADING
        
        # Default to text
        return ChunkType.TEXT
    
    async def _generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using Gemini"""
        try:
            response = self.genai_client.models.embed_content(
                model=self.embedding_model,
                contents=text
            )
            
            if response.embeddings and len(response.embeddings) > 0:
                return response.embeddings[0].values
            else:
                raise Exception("No embedding returned from API")
                
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            # Return zero vector as fallback
            return [0.0] * self.embedding_dimension
    
    async def search_similar_content(
        self, 
        search_request: SearchRequest
    ) -> List[SearchResult]:
        """Search for similar content using vector similarity"""
        try:
            # Generate embedding for the search query
            query_embedding = await self._generate_embedding(search_request.query)
            
            # Search for similar chunks
            results = await self.storage.search_similar_chunks(
                query_embedding=query_embedding,
                workspace_id=search_request.workspace_id,
                similarity_threshold=search_request.similarity_threshold,
                max_results=search_request.max_results
            )
            
            logger.info(f"Found {len(results)} similar chunks for query: {search_request.query[:50]}...")
            return results
            
        except Exception as e:
            logger.error(f"Error searching similar content: {str(e)}")
            return []
