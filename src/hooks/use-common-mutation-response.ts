import { useRouter } from "@/i18n/routing";
import { useToast } from "./use-toast";

export const useCommonMutationResponse = (
  backUrl?: string,
  invalidate?: () => void,
  customTitles?: { success: string; error: string },
) => {
  const { toast } = useToast();
  const router = useRouter();

  return {
    onSuccess: ({ message }: { message: string }) => {
      toast({
        title: customTitles?.success ?? "Success",
        description: message,
      });

      if (invalidate) {
        invalidate();
      }

      if (backUrl) {
        router.push(backUrl);
      }
    },
    onError: ({ message }: { message: string }) => {
      toast({
        title: customTitles?.error ?? "Error",
        description: message,
        variant: "destructive",
      });
    },
  };
};
