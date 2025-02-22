import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const LoadingDialog = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Dialog open={isLoading}>
      <DialogContent className="flex flex-col items-center justify-center p-10">
        <DialogTitle className="sr-only">ページ遷移中</DialogTitle>
        <Loader2 className="w-12 h-12 animate-spin text-gray-800" />
        <p className="mt-4 text-lg font-semibold text-gray-700">読み込み中</p>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingDialog;
