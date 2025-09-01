"""
Document Converter using Docling for PDF to Markdown conversion
"""

import os
import logging
from typing import Optional
from docling.document_converter import DocumentConverter as DoclingConverter, PdfFormatOption
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions, TableFormerMode

logger = logging.getLogger(__name__)

class DocumentConverter:
    def __init__(self):
        """Initialize the document converter with optimized settings"""
        # Configure for better table processing
        self.pipeline_options = PdfPipelineOptions(do_table_structure=True)
        self.pipeline_options.table_structure_options.mode = TableFormerMode.ACCURATE
        self.pipeline_options.table_structure_options.do_cell_matching = False
        
        # Initialize the Docling converter
        self.converter = DoclingConverter(
            format_options={
                InputFormat.PDF: PdfFormatOption(pipeline_options=self.pipeline_options)
            }
        )
    
    async def convert_document(self, file_path: str) -> str:
        """
        Convert a document (PDF) to Markdown format
        
        Args:
            file_path: Path to the input document
            
        Returns:
            Markdown content as string
            
        Raises:
            Exception: If conversion fails
        """
        try:
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"File not found: {file_path}")
            
            logger.info(f"Converting document: {file_path}")
            
            # Convert the document
            result = self.converter.convert(file_path)
            
            # Extract markdown content
            markdown_content = result.document.export_to_markdown()
            
            logger.info(f"Successfully converted document to markdown ({len(markdown_content)} characters)")
            return markdown_content
            
        except Exception as e:
            logger.error(f"Error converting document {file_path}: {str(e)}")
            raise
    
    async def convert_and_save(self, file_path: str, output_path: str) -> str:
        """
        Convert document and save to file
        
        Args:
            file_path: Path to input document
            output_path: Path to save markdown output
            
        Returns:
            Markdown content as string
        """
        try:
            # Convert document
            markdown_content = await self.convert_document(file_path)
            
            # Save to file
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(markdown_content)
            
            logger.info(f"Saved markdown to: {output_path}")
            return markdown_content
            
        except Exception as e:
            logger.error(f"Error converting and saving document: {str(e)}")
            raise


# Legacy support - keep this for backward compatibility
if __name__ == "__main__":
    import asyncio
    
    async def main():
        source = "E:\\dev\\veriet-f\\Amplified_Intelligence_IP_Pty_Ltd_-_Balance_Sheet_vF.pdf"
        output_filename = "output_document.md"
        
        converter = DocumentConverter()
        try:
            await converter.convert_and_save(source, output_filename)
            print("Conversion complete.")
        except Exception as e:
            print(f"Error: {e}")
    
    asyncio.run(main())