"""
Document Intelligence Service Package

A unified service for:
- Document conversion (PDF → Markdown)
- Content chunking and embedding
- Vector storage and similarity search
- RAG (Retrieval-Augmented Generation) operations
"""

from .service import DocumentIntelligenceService
from .models import (
    DocumentMetadata,
    DocumentChunk,
    ProcessDocumentRequest,
    ProcessDocumentResponse,
    SearchRequest,
    SearchResponse,
    ChunkType,
    ProcessingStatus
)

__version__ = "1.0.0"
__all__ = [
    "DocumentIntelligenceService",
    "DocumentMetadata",
    "DocumentChunk", 
    "ProcessDocumentRequest",
    "ProcessDocumentResponse",
    "SearchRequest",
    "SearchResponse",
    "ChunkType",
    "ProcessingStatus"
]
