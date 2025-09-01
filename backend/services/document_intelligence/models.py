"""
Pydantic models for the Document Intelligence Service
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from enum import Enum

class ChunkType(str, Enum):
    TEXT = "text"
    TABLE = "table"
    HEADING = "heading"
    PARAGRAPH = "paragraph"

class ProcessingStatus(str, Enum):
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    PROCESSED = "processed"
    FAILED = "failed"

class DocumentMetadata(BaseModel):
    document_id: UUID
    workspace_id: str
    user_id: str
    original_name: str
    file_name: str
    file_path: str
    public_url: str
    file_size: int
    file_type: str
    file_extension: str

class DocumentChunk(BaseModel):
    id: Optional[UUID] = None
    document_id: UUID
    workspace_id: str
    user_id: str
    chunk_text: str
    chunk_index: int
    chunk_type: ChunkType = ChunkType.TEXT
    token_count: Optional[int] = None
    character_count: Optional[int] = None
    embedding: Optional[List[float]] = None
    embedding_model: str = "gemini-embedding-001"
    chunking_strategy: str = "token"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class ProcessDocumentRequest(BaseModel):
    file_path: str
    metadata: DocumentMetadata

class ProcessDocumentResponse(BaseModel):
    document_id: UUID
    status: ProcessingStatus
    chunks_created: int
    processing_time_seconds: float
    message: str

class SearchRequest(BaseModel):
    query: str
    workspace_id: str
    similarity_threshold: float = Field(default=0.7, ge=0.0, le=1.0)
    max_results: int = Field(default=10, ge=1, le=100)

class SearchResult(BaseModel):
    id: UUID
    document_id: UUID
    chunk_text: str
    chunk_type: ChunkType
    similarity: float

class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total_results: int
    search_time_seconds: float
