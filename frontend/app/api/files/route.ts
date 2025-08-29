import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = orgId || userId;
    const { searchParams } = new URL(request.url);
    
    // Query parameters for filtering and pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "uploaded_at";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from("documents")
      .select("*", { count: "exact" })
      .eq("workspace_id", workspaceId)
      .range(offset, offset + limit - 1);

    // Add search filter
    if (search) {
      query = query.or(`original_name.ilike.%${search}%,folder_path.ilike.%${search}%`);
    }

    // Add category filter
    if (category) {
      query = query.eq("category", category);
    }

    // Add sorting with proper field mapping
    const sortByField = (() => {
      switch (sortBy) {
        case "uploadDate": return "uploaded_at";
        case "name": return "original_name";
        case "size": return "file_size";
        case "type": return "category";
        case "folder": return "folder_path";
        default: return "uploaded_at";
      }
    })();
    
    query = query.order(sortByField, { ascending: sortOrder === "asc" });

    const { data: documents, error, count } = await query;

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      );
    }

    // Transform data for frontend
    const transformedDocuments = documents?.map(doc => ({
      id: doc.id,
      document_id: doc.document_id,
      name: doc.original_name,
      type: doc.category || "Uncategorized",
      fileFormat: doc.file_extension.toUpperCase(),
      size: formatFileSize(doc.file_size),
      folder: doc.folder_path || "Uncategorized",
      uploadDate: doc.uploaded_at, // Keep the database field name
      publicUrl: doc.public_url,
      processingStatus: doc.processing_status,
      confidenceScore: doc.confidence_score,
    })) || [];

    return NextResponse.json({
      success: true,
      data: transformedDocuments,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    console.error("Files API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
