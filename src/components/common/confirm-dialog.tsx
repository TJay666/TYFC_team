"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: ConfirmDialogProps) {
  return (    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border border-[#e63946]/20 shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-[#1d3557] text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-[#e63946]">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base pt-2 border-t border-gray-100 mt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="border-[#457b9d] text-[#457b9d] hover:bg-[#457b9d]/10 transition-colors">
            取消
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            className="bg-[#e63946] hover:bg-[#e63946]/90 text-white font-medium transition-colors"
          >
            確認刪除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
