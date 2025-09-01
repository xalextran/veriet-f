"""
Storage service for Supabase operations
"""

import os
from typing import List, Optional
from uuid import UUID
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

from .models import DocumentChunk, SearchResult

load_dotenv()

logger = logging.getLogger(__name__)

class StorageService:
    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Missing Supabase configuration in environment variables")
        
        self.client: Client = create_client(self.supabase_url, self.supabase_key)
    
    async def store_chunks(self, chunks: List[DocumentChunk]) -> bool:
        """Store document chunks in the database"""
        try:
            # Convert chunks to dict format for Supabase
            chunk_data = []
            for chunk in chunks:
                data = {
                    "document_id": str(chunk.document_id),
                    "workspace_id": chunk.workspace_id,
                    "user_id": chunk.user_id,
                    "chunk_text": chunk.chunk_text,
                    "chunk_index": chunk.chunk_index,
                    "chunk_type": chunk.chunk_type.value,
                    "token_count": chunk.token_count,
                    "character_count": chunk.character_count,
                    "embedding": chunk.embedding,
                    "embedding_model": chunk.embedding_model,
                    "chunking_strategy": chunk.chunking_strategy
                }
                chunk_data.append(data)
            
            # Insert chunks in batch
            result = self.client.table("document_chunks").insert(chunk_data).execute()
            
            if result.data:
                logger.info(f"Successfully stored {len(chunk_data)} chunks")
                return True
            else:
                logger.error("Failed to store chunks - no data returned")
                return False
                
        except Exception as e:
            logger.error(f"Error storing chunks: {str(e)}")
            return False
    
    async def update_document_status(self, document_id: UUID, status: str) -> bool:
        """Update document processing status"""
        try:
            result = self.client.table("documents").update({
                "processing_status": status,
                "processed_at": "now()" if status == "processed" else None
            }).eq("document_id", str(document_id)).execute()
            
            return len(result.data) > 0
            
        except Exception as e:
            logger.error(f"Error updating document status: {str(e)}")
            return False
    
    async def search_similar_chunks(
        self, 
        query_embedding: List[float], 
        workspace_id: str,
        similarity_threshold: float = 0.7,
        max_results: int = 10
    ) -> List[SearchResult]:
        """Search for similar chunks using vector similarity"""
        try:
            # Use the stored function for similarity search
            result = self.client.rpc("search_similar_chunks", {
                "query_embedding": query_embedding,
                "workspace_filter": workspace_id,
                "similarity_threshold": similarity_threshold,
                "match_count": max_results
            }).execute()
            
            if result.data:
                search_results = []
                for row in result.data:
                    search_result = SearchResult(
                        id=row["id"],
                        document_id=row["document_id"],
                        chunk_text=row["chunk_text"],
                        chunk_type=row["chunk_type"],
                        similarity=row["similarity"]
                    )
                    search_results.append(search_result)
                
                return search_results
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error searching similar chunks: {str(e)}")
            return []
    
    async def get_document_chunks(self, document_id: UUID) -> List[DocumentChunk]:
        """Get all chunks for a specific document"""
        try:
            result = self.client.table("document_chunks").select("*").eq(
                "document_id", str(document_id)
            ).order("chunk_index").execute()
            
            if result.data:
                chunks = []
                for row in result.data:
                    chunk = DocumentChunk(
                        id=row["id"],
                        document_id=row["document_id"],
                        workspace_id=row["workspace_id"],
                        user_id=row["user_id"],
                        chunk_text=row["chunk_text"],
                        chunk_index=row["chunk_index"],
                        chunk_type=row["chunk_type"],
                        token_count=row["token_count"],
                        character_count=row["character_count"],
                        embedding=row["embedding"],
                        embedding_model=row["embedding_model"],
                        chunking_strategy=row["chunking_strategy"],
                        created_at=row["created_at"],
                        updated_at=row["updated_at"]
                    )
                    chunks.append(chunk)
                
                return chunks
            else:
                return []
                
        except Exception as e:
            logger.error(f"Error getting document chunks: {str(e)}")
            return []
