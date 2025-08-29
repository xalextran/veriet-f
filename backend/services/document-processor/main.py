# Document Processing Service
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import asyncio
import httpx
from mineru import MinerU  # Your MinerU integration
from gemini import GeminiClient  # Your Gemini integration

app = FastAPI(title="Document Processing Service")

class ProcessDocumentRequest(BaseModel):
    document_id: str
    file_path: str
    workspace_id: str

class DocumentProcessor:
    def __init__(self):
        self.mineru = MinerU()
        self.gemini = GeminiClient()
    
    async def process_document(self, request: ProcessDocumentRequest):
        try:
            # 1. Update status to processing
            await self.update_document_status(request.document_id, "processing")
            
            # 2. MinerU: Extract structure and content
            mineru_result = await self.mineru.process_file(request.file_path)
            
            # 3. Gemini: Classify and enhance
            classification = await self.gemini.classify_document(
                content=mineru_result.content,
                structure=mineru_result.structure
            )
            
            # 4. Update database with results
            await self.save_processing_results(
                document_id=request.document_id,
                mineru_result=mineru_result,
                classification=classification
            )
            
            # 5. Update status to processed
            await self.update_document_status(request.document_id, "processed")
            
        except Exception as e:
            await self.update_document_status(request.document_id, "failed")
            raise

processor = DocumentProcessor()

@app.post("/process")
async def process_document(
    request: ProcessDocumentRequest,
    background_tasks: BackgroundTasks
):
    background_tasks.add_task(processor.process_document, request)
    return {"message": "Processing started", "document_id": request.document_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
