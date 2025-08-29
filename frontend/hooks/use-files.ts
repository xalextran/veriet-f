import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface FileData {
  id: string;
  document_id: string;
  name: string;
  type: string;
  fileFormat: string;
  size: string;
  folder: string;
  uploadDate: string;
  publicUrl: string;
  processingStatus: string;
  confidenceScore?: number;
}

interface FilesResponse {
  success: boolean;
  data: FileData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseFilesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const QUERY_KEYS = {
  files: (params: UseFilesParams) => ["files", params],
  allFiles: () => ["files"],
} as const;

async function fetchFiles(params: UseFilesParams): Promise<FilesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const response = await fetch(`/api/files?${searchParams.toString()}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch files");
  }
  
  return response.json();
}

export function useFiles(params: UseFilesParams = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.files(params),
    queryFn: () => fetchFiles(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for deleting files (for future use)
export function useDeleteFile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete file");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all files queries to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allFiles() });
    },
  });
}

// Hook to invalidate files cache after upload
export function useInvalidateFiles() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.allFiles() });
  };
}
