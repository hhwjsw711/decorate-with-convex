import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useApiErrorHandler } from "../common/error";
import { routes } from "../routes";
import { useState } from "react";
import { Button } from "../common/Button";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { RegenerateModal } from "./RegenerateModal";
import { isMobile } from "../common/utils";

interface PromptPanelProps {
  image: Doc<"images">;
}

const defaultPrompt = "请装饰这张图片，使其看起来像是专业室内设计师设计的";

export function PromptPanel({ image }: PromptPanelProps) {
  const canGenerate =
    !!image &&
    (image.status.kind === "uploaded" || image.status.kind === "generated");

  const currentPrompt =
    image &&
    (image.status.kind === "generating" || image.status.kind === "generated")
      ? image.status.prompt
      : undefined;

  const startGeneration = useMutation(api.images.startGeneration);
  const startRegeneration = useMutation(api.images.startRegeneration);
  const deleteImage = useMutation(api.images.deleteImage);
  const onApiError = useApiErrorHandler();
  const [prompt, setPrompt] = useState(currentPrompt ?? defaultPrompt);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  const handleDelete = async () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    await deleteImage({ imageId: image._id }).catch(onApiError);
    routes.dashboard().push();
  };

  const handleGenerate = () => {
    if (!canGenerate) {
      toast.error("请等待图片上传完成后再进行生成。");
      return;
    }

    // If this is a re-generation (image already has decorated version), show modal
    if (image.status.kind === "generated" && image.status.decoratedImage) {
      setShowRegenerateModal(true);
    } else {
      // First time generation, use startGeneration
      startGeneration({
        imageId: image._id,
        prompt,
      }).catch(onApiError);
    }
  };

  const handleSelectOriginal = () => {
    setShowRegenerateModal(false);
    startRegeneration({
      imageId: image._id,
      prompt,
      baseImage: "original",
    }).catch(onApiError);
  };

  const handleSelectDecorated = () => {
    setShowRegenerateModal(false);
    startRegeneration({
      imageId: image._id,
      prompt,
      baseImage: "decorated",
    }).catch(onApiError);
  };

  return (
    <div className="flex flex-col justify-between w-full md:w-1/2 md:max-w-[500px] max-w-full bg-white r p-8 pb-[100px] md:p-12 overflow-y-auto min-h-[320px] border-r border-[var(--color-border)]">
      <ConfirmDialog
        open={showConfirm}
        title="删除图片"
        message="确定要删除这张图片吗？此操作无法撤销。"
        confirmLabel="删除"
        cancelLabel="取消"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
      <RegenerateModal
        open={showRegenerateModal}
        originalImageUrl={
          image.status.kind === "generated" && image.status.image
            ? image.status.image.url
            : ""
        }
        decoratedImageUrl={
          image.status.kind === "generated" && image.status.decoratedImage
            ? image.status.decoratedImage.url
            : ""
        }
        onSelectOriginal={handleSelectOriginal}
        onSelectDecorated={handleSelectDecorated}
        onCancel={() => setShowRegenerateModal(false)}
      />
      <div>
        <h2 className="text-2xl font-bold mb-4 text-slate-800">图片提示词</h2>
        <p className="text-sm text-gray-500 mb-4">
          输入您希望图片如何被装饰的描述。
        </p>
        <textarea
          id="prompt"
          className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] resize-y text-base mb-4 shadow-sm"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onFocus={(e) => {
            // Select all text on mobile devices when focused
            if (isMobile()) e.target.select();
          }}
          placeholder={defaultPrompt}
          disabled={!canGenerate}
        />
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canGenerate}
          onClick={handleGenerate}
        >
          {currentPrompt ? "重新生成" : "生成"}
        </Button>
        <Button
          variant="danger"
          fullWidth
          onClick={handleDelete}
          aria-label="删除"
        >
          删除图片
        </Button>
      </div>
    </div>
  );
}
