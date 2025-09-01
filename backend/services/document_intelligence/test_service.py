"""
Test script for Document Intelligence Service
"""

import asyncio
import os
import sys
from uuid import uuid4

# Add the parent directory to the path so we can import our service
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from document_intelligence.service import DocumentIntelligenceService
from document_intelligence.models import DocumentMetadata, ProcessDocumentRequest, SearchRequest

async def test_service():
    """Test the document intelligence service"""
    print("🚀 Testing Document Intelligence Service...")
    
    try:
        # Initialize service
        service = DocumentIntelligenceService()
        print("✅ Service initialized successfully")
        
        # Test health check
        health = await service.health_check()
        print(f"✅ Health check: {health['status']}")
        
        # Test document conversion only (without full processing)
        test_file = "E:\\dev\\veriet-f\\Amplified_Intelligence_IP_Pty_Ltd_-_Balance_Sheet_vF.pdf"
        
        if os.path.exists(test_file):
            print(f"📄 Testing document conversion: {os.path.basename(test_file)}")
            
            # Test just the conversion
            markdown_content = await service.document_converter.convert_document(test_file)
            print(f"✅ Document converted successfully ({len(markdown_content)} characters)")
            print(f"📝 Preview: {markdown_content[:200]}...")
            
            # Optionally test full processing (uncomment to test with real data)
            """
            # Create test metadata
            metadata = DocumentMetadata(
                document_id=uuid4(),
                workspace_id="test-workspace",
                user_id="test-user",
                original_name="test_document.pdf",
                file_name="test_document.pdf",
                file_path=test_file,
                public_url="https://example.com/test_document.pdf",
                file_size=os.path.getsize(test_file),
                file_type="application/pdf",
                file_extension=".pdf"
            )
            
            # Test full processing
            request = ProcessDocumentRequest(file_path=test_file, metadata=metadata)
            result = await service.process_document(request)
            print(f"✅ Document processed: {result.chunks_created} chunks created")
            
            # Test search
            search_request = SearchRequest(
                query="balance sheet",
                workspace_id="test-workspace",
                similarity_threshold=0.3,
                max_results=5
            )
            search_result = await service.search_documents(search_request)
            print(f"✅ Search completed: {search_result.total_results} results found")
            """
            
        else:
            print(f"⚠️  Test file not found: {test_file}")
            print("   Using a dummy test instead...")
            
            # Test just the chunking and embedding with dummy content
            from document_intelligence.models import DocumentMetadata
            
            dummy_content = "This is a test document. It contains multiple sentences. Each sentence provides different information about testing."
            
            metadata = DocumentMetadata(
                document_id=uuid4(),
                workspace_id="test-workspace", 
                user_id="test-user",
                original_name="test_document.txt",
                file_name="test_document.txt",
                file_path="/tmp/test.txt",
                public_url="https://example.com/test.txt",
                file_size=len(dummy_content),
                file_type="text/plain",
                file_extension=".txt"
            )
            
            # Test RAG processing with dummy content
            chunks = await service.rag_service.process_content(dummy_content, metadata)
            print(f"✅ RAG processing test: {len(chunks)} chunks created")
        
        print("🎉 All tests completed successfully!")
        
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_service())
