"""
FastAPI application for Document Intelligence Service
"""

import logging
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from uuid import UUID
import uvicorn

from .service import DocumentIntelligenceService
from .models import (
    ProcessDocumentRequest,
    ProcessDocumentResponse,
    SearchRequest,
    SearchResponse
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Document Intelligence Service",
    description="Unified service for document conversion, chunking, embedding, and RAG operations",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize service
intelligence_service = DocumentIntelligenceService()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Document Intelligence Service",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        health_status = await intelligence_service.health_check()
        return health_status
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Service unhealthy")

@app.post("/documents/process", response_model=ProcessDocumentResponse)
async def process_document(
    request: ProcessDocumentRequest,
    background_tasks: BackgroundTasks
):
    """
    Process a document through the complete intelligence pipeline
    
    This endpoint:
    1. Converts the document (PDF) to Markdown
    2. Chunks the content for optimal retrieval
    3. Generates embeddings for each chunk
    4. Stores chunks with embeddings in vector database
    """
    try:
        logger.info(f"Received document processing request for {request.metadata.document_id}")
        
        # Process document
        result = await intelligence_service.process_document(request)
        
        return result
        
    except Exception as e:
        logger.error(f"Document processing failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.post("/documents/search", response_model=SearchResponse)
async def search_documents(request: SearchRequest):
    """
    Search for similar content across documents using vector similarity
    
    This endpoint:
    1. Generates embedding for the search query
    2. Performs vector similarity search
    3. Returns ranked results with similarity scores
    """
    try:
        logger.info(f"Received search request: '{request.query}' for workspace {request.workspace_id}")
        
        # Perform search
        result = await intelligence_service.search_documents(request)
        
        return result
        
    except Exception as e:
        logger.error(f"Search failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@app.get("/documents/{document_id}/chunks")
async def get_document_chunks(document_id: UUID):
    """Get all chunks for a specific document"""
    try:
        chunks = await intelligence_service.get_document_chunks(document_id)
        return {
            "document_id": document_id,
            "chunks": chunks,
            "total_chunks": len(chunks)
        }
        
    except Exception as e:
        logger.error(f"Failed to get chunks for document {document_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get chunks: {str(e)}")

@app.get("/test/convert")
async def test_conversion():
    """Test endpoint for document conversion"""
    try:
        # This is a test endpoint - you can modify the path
        test_file = "E:\\dev\\veriet-f\\Amplified_Intelligence_IP_Pty_Ltd_-_Balance_Sheet_vF.pdf"
        
        markdown_content = await intelligence_service.document_converter.convert_document(test_file)
        
        return {
            "status": "success",
            "content_length": len(markdown_content),
            "preview": markdown_content[:500] + "..." if len(markdown_content) > 500 else markdown_content
        }
        
    except Exception as e:
        logger.error(f"Test conversion failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Test conversion failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
