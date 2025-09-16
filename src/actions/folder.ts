import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFolderById } from "@/db/queries/subjects";

export const useDeleteFolderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ folderId }: { folderId: string }) => {
      return await deleteFolderById(folderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
    },
  });
};
