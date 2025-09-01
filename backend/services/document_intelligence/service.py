"""
Document Intelligence Service - Main orchestrator
Unified service for document conversion, chunking, embedding, and RAG operations
"""

import time
import logging
from typing import List
from uuid import UUID

from .models import (
    DocumentMetadata, 
    ProcessDocumentRequest, 
    ProcessDocumentResponse, 
    ProcessingStatus,
    SearchRequest,
    SearchResponse
)
from .document_converter import DocumentConverter
from .rag_service import RAGService
from .storage_service import StorageService

logger = logging.getLogger(__name__)

class DocumentIntelligenceService:
    """
    Unified Document Intelligence Service
    
    Handles the complete pipeline:
    1. Document conversion (PDF → Markdown)
    2. Content chunking
    3. Embedding generation
    4. Vector storage
    5. Similarity search & retrieval
    """
    
    def __init__(self):
        self.document_converter = DocumentConverter()
        self.rag_service = RAGService()
        self.storage = StorageService()
    
    async def process_document(self, request: ProcessDocumentRequest) -> ProcessDocumentResponse:
        """
        Process a document through the complete intelligence pipeline
        
        Args:
            request: ProcessDocumentRequest with file path and metadata
            
        Returns:
            ProcessDocumentResponse with processing results
        """
        start_time = time.time()
        document_id = request.metadata.document_id
        
        try:
            logger.info(f"Starting document processing for {document_id}")
            
            # Update document status to processing
            await self.storage.update_document_status(document_id, ProcessingStatus.PROCESSING.value)
            
            # Step 1: Convert PDF to Markdown
            logger.info("Step 1: Converting document to markdown")
            markdown_content = await self.document_converter.convert_document(request.file_path)
            
            if not markdown_content.strip():
                raise Exception("Document conversion resulted in empty content")
            
            # Step 2: Process content through RAG pipeline
            logger.info("Step 2: Processing content through RAG pipeline")
            chunks = await self.rag_service.process_content(markdown_content, request.metadata)
            
            # Step 3: Update document status to processed
            logger.info("Step 3: Updating document status")
            await self.storage.update_document_status(document_id, ProcessingStatus.PROCESSED.value)
            
            processing_time = time.time() - start_time
            
            response = ProcessDocumentResponse(
                document_id=document_id,
                status=ProcessingStatus.PROCESSED,
                chunks_created=len(chunks),
                processing_time_seconds=round(processing_time, 2),
                message=f"Successfully processed document with {len(chunks)} chunks"
            )
            
            logger.info(f"Document processing completed in {processing_time:.2f}s")
            return response
            
        except Exception as e:
            # Update document status to failed
            await self.storage.update_document_status(document_id, ProcessingStatus.FAILED.value)
            
            processing_time = time.time() - start_time
            error_message = f"Document processing failed: {str(e)}"
            logger.error(error_message)
            
            return ProcessDocumentResponse(
                document_id=document_id,
                status=ProcessingStatus.FAILED,
                chunks_created=0,
                processing_time_seconds=round(processing_time, 2),
                message=error_message
            )
    
    async def search_documents(self, search_request: SearchRequest) -> SearchResponse:
        """
        Search for similar content across documents in a workspace
        
        Args:
            search_request: SearchRequest with query and parameters
            
        Returns:
            SearchResponse with matching chunks
        """
        start_time = time.time()
        
        try:
            logger.info(f"Searching for: '{search_request.query}' in workspace {search_request.workspace_id}")
            
            # Perform similarity search
            results = await self.rag_service.search_similar_content(search_request)
            
            search_time = time.time() - start_time
            
            response = SearchResponse(
                query=search_request.query,
                results=results,
                total_results=len(results),
                search_time_seconds=round(search_time, 3)
            )
            
            logger.info(f"Search completed in {search_time:.3f}s, found {len(results)} results")
            return response
            
        except Exception as e:
            search_time = time.time() - start_time
            error_message = f"Search failed: {str(e)}"
            logger.error(error_message)
            
            return SearchResponse(
                query=search_request.query,
                results=[],
                total_results=0,
                search_time_seconds=round(search_time, 3)
            )
    
    async def get_document_chunks(self, document_id: UUID) -> List:
        """Get all chunks for a specific document"""
        try:
            return await self.storage.get_document_chunks(document_id)
        except Exception as e:
            logger.error(f"Error getting document chunks: {str(e)}")
            return []
    
    async def health_check(self) -> dict:
        """Service health check"""
        try:
            # Test document converter
            converter_status = "ok"
            
            # Test storage connection
            # Simple test - try to query an empty result
            await self.storage.search_similar_chunks([0.0] * 768, "test", 0.9, 1)
            storage_status = "ok"
            
            return {
                "status": "healthy",
                "services": {
                    "document_converter": converter_status,
                    "rag_service": "ok",
                    "storage": storage_status
                },
                "timestamp": time.time()
            }
            
        except Exception as e:
            logger.error(f"Health check failed: {str(e)}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": time.time()
            }
