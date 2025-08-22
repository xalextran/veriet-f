import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@clerk/nextjs/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role for server-side operations
);

export async function POST(request: NextRequest) {
  try {
    // Get user authentication and organization from Clerk
    const { userId, orgId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Use orgId if user is in an organization, otherwise use userId as workspace
    const workspaceId = orgId || userId;

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const documentId = uuidv4();
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const fileName = `${documentId}.${fileExtension}`;

    // Tenant-specific path: bucket/{workspace_id}/{document_uuid}
    const filePath = `${workspaceId}/${fileName}`;
    
    console.log(`Uploading file for workspace: ${workspaceId}, path: ${filePath}`);

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("documents") // bucket name
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: "Upload failed: " + error.message },
        { status: 500 }
      );
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      data: {
        path: data.path,
        publicUrl: urlData.publicUrl,
        originalName: file.name,
        size: file.size,
        type: file.type,
        documentId,
        workspaceId,
        userId, // Include for debugging
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
