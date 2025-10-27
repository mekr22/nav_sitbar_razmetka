import { type FC } from "react";

import { Button } from "@/components/ui/button";

export interface FormActionsProps {
  onSaveDraft?: () => void;
  onPreview?: () => void;
  onPublish?: () => void;
  disabled?: boolean;
  savingDraft?: boolean;
  publishing?: boolean;
  previewing?: boolean;
}

const FormActions: FC<FormActionsProps> = ({
  onSaveDraft,
  onPreview,
  onPublish,
  disabled,
  savingDraft,
  previewing,
  publishing,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 rounded-b-3xl border border-[#181B22] bg-[#0C101480] px-6 pb-6 pt-6 backdrop-blur-[50px]">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          type="button"
          variant="ghost"
          disabled={disabled || savingDraft}
          onClick={onSaveDraft}
          className="h-[46px] w-[180px] rounded-full border border-[#181B22] bg-transparent text-[15px] font-bold text-white hover:border-[#1F2230] hover:bg-transparent"
        >
          {savingDraft ? "Saving..." : "Save Draft"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          disabled={disabled || previewing}
          onClick={onPreview}
          className="h-[46px] w-[180px] rounded-full border border-[#181B22] bg-transparent text-[15px] font-bold text-white hover:border-[#1F2230] hover:bg-transparent"
        >
          {previewing ? "Preparing..." : "Preview"}
        </Button>
        <Button
          type="button"
          disabled={disabled || publishing}
          onClick={onPublish}
          className="h-[46px] w-[180px] rounded-full bg-gradient-to-r from-[#A06AFF] to-[#482090] px-4 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
        >
          {publishing ? "Publishing..." : "Publish"}
        </Button>
      </div>
      <p className="text-xs font-bold text-[#B0B0B0]">
        All changes are saved automatically once published.
      </p>
    </div>
  );
};

export default FormActions;
