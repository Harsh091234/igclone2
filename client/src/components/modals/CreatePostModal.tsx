import React, { useRef, useState } from "react";
import { ArrowLeft, ImagePlus } from "lucide-react";
import Cropper, { type Area } from "react-easy-crop";
import toast from "react-hot-toast";
import { useCreatePostMutation } from "../../services/postApi";
import getCroppedImg from "../../utils/getCroppedItems";

type Step = "SELECT" | "CROP" | "PREVIEW" | "CAPTION";

type MediaType = "image" | "video";

interface SelectedMedia {
  file: File;
  previewUrl: string;
  type: MediaType;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
}: Props) {
  const [step, setStep] =
    useState<Step>("SELECT");
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [contentType, setContentType] =
    useState<"post" | "reel" | null>(
      null
    );

  const [media, setMedia] =
    useState<SelectedMedia | null>(
      null
    );

  const [caption, setCaption] =
    useState("");

  const [feedRatio, setFeedRatio] =
    useState<"1/1" | "4/5" | "16/9">(
      "4/5"
    );

  const [aspect, setAspect] =
    useState(1);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] =
    useState(1);

  const [
    croppedAreaPixels,
    setCroppedAreaPixels,
  ] = useState<Area | null>(null);

  const fileRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [
    createPost,
    { isLoading },
  ] = useCreatePostMutation();

  if (!isOpen) return null;

  const resetAll = () => {
    setStep("SELECT");
    setContentType(null);
    setMedia(null);
    setCaption("");
    setFeedRatio("4/5");
    setAspect(1);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onClose();
  };

  const handleBack = () => {
    if (step === "CROP")
      setStep("SELECT");
    else if (step === "PREVIEW")
      setStep("CROP");
    else if (step === "CAPTION")
      setStep("PREVIEW");
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setMedia({
      file,
      previewUrl:
        URL.createObjectURL(file),
      type:
        file.type.startsWith(
          "video"
        )
          ? "video"
          : "image",
    });
    setCroppedPreview(null);
    setStep("CROP");
  };

  const handleUpload =
    async () => {
      if (!media) return;

      try {
        const formData =
          new FormData();

        formData.append(
          "media",
          media.file
        );

        formData.append(
          "caption",
          caption
        );

        formData.append(
          "isReel",
          contentType === "reel"
            ? "true"
            : "false"
        );

        formData.append(
          "feedRatio",
          feedRatio
        );

        formData.append(
          "cropData",
          JSON.stringify(
            croppedAreaPixels
          )
        );

        await createPost(
          formData
        ).unwrap();

        toast.success(
          "Uploaded successfully"
        );

        resetAll();
      } catch {
        toast.error(
          "Upload failed"
        );
      }
    };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={resetAll}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="bg-background w-[420px] max-w-full rounded-2xl overflow-hidden border"
      >
        {/* HEADER */}
        <header className="grid grid-cols-3 items-center border-b px-3 py-2">
          <div>
            {step !==
              "SELECT" && (
              <button
                onClick={
                  handleBack
                }
              >
                <ArrowLeft />
              </button>
            )}
          </div>

          <h2 className="text-center font-semibold">
            {step ===
              "SELECT" &&
              "Create"}
            {step ===
              "CROP" &&
              "Crop"}
            {step ===
              "PREVIEW" &&
              "Preview"}
            {step ===
              "CAPTION" &&
              "Caption"}
          </h2>

          <div className="text-right">
            {step ===
              "CROP" && (
              <button
                onClick={async () => {
  if (
    media?.type === "image" &&
    croppedAreaPixels
  ) {
    const cropped = await getCroppedImg(
      media.previewUrl,
      croppedAreaPixels
    );

    setCroppedPreview(cropped);
  }
  
  setStep("PREVIEW");
}}
                className="text-blue-500"
              >
                Next
              </button>
            )}

            {step ===
              "PREVIEW" && (
              <button
                onClick={() =>
                  setStep(
                    "CAPTION"
                  )
                }
                className="text-blue-500"
              >
                Next
              </button>
            )}

            {step ===
              "CAPTION" && (
              <button
                disabled={
                  isLoading
                }
                onClick={
                  handleUpload
                }
                className="text-blue-500"
              >
                {isLoading
                  ? "Sharing..."
                  : "Share"}
              </button>
            )}
          </div>
        </header>

        {/* BODY */}
        <div className="p-4 min-h-[520px]">
          {/* SELECT */}
          {step ===
            "SELECT" && (
            <div className="h-[500px] flex flex-col items-center justify-center gap-4">
              <ImagePlus
                size={50}
              />

              <button
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                onClick={() => {
                  setContentType(
                    "post"
                  );
                  setAspect(
                    1
                  );
                  fileRef.current?.click();
                }}
              >
                Create Post
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                onClick={() => {
                  setContentType(
                    "reel"
                  );
                  setAspect(
                    9 / 16
                  );
                  fileRef.current?.click();
                }}
              >
                Create Reel
              </button>
            </div>
          )}

          {/* CROP */}
          {step === "CROP" &&
            media && (
              <>
                <div className="flex gap-2 mb-3">
                  {contentType ===
                  "post" ? (
                    <>
                      <button
                        onClick={() => {
                          setAspect(
                            1
                          );
                          setFeedRatio(
                            "1/1"
                          );
                        }}
                      >
                        1:1
                      </button>

                      <button
                        onClick={() => {
                          setAspect(
                            4 /
                              5
                          );
                          setFeedRatio(
                            "4/5"
                          );
                        }}
                      >
                        4:5
                      </button>

                      <button
                        onClick={() => {
                          setAspect(
                            16 /
                              9
                          );
                          setFeedRatio(
                            "16/9"
                          );
                        }}
                      >
                        16:9
                      </button>
                    </>
                  ) : (
                    <button>
                      9:16
                    </button>
                  )}
                </div>

                <div className="relative h-[460px] w-full bg-black rounded-xl overflow-hidden">
                  {media.type ===
                  "image" ? (
                    <div className="relative w-full h-full">
                            <Cropper
                      image={
                        media.previewUrl
                      }
                      crop={
                        crop
                      }
                      zoom={
                        zoom
                      }
                      aspect={
                        aspect
                      }
                      onCropChange={
                        setCrop
                      }
                      onZoomChange={
                        setZoom
                      }
                      onCropComplete={(
                        _,
                        pixels
                      ) =>
                        setCroppedAreaPixels(
                          pixels
                        )
                      }
                    />
                    </div>
                
                  ) : (
                    <Cropper
                      video={
                        media.previewUrl
                      }
                      crop={
                        crop
                      }
                      zoom={
                        zoom
                      }
                      aspect={
                        aspect
                      }
                      onCropChange={
                        setCrop
                      }
                      onZoomChange={
                        setZoom
                      }
                      onCropComplete={(
                        _,
                        pixels
                      ) =>
                        setCroppedAreaPixels(
                          pixels
                        )
                      }
                    />
                  )}
                </div>
              </>
            )}

          {/* PREVIEW */}
          {step ===
            "PREVIEW" &&
            media && (
              <div className="h-[500px]  flex items-center justify-center">
                {media.type ===
                "image" ? (
                  <img
                    src={
                     croppedPreview ||
    media.previewUrl
                    }
                    className="max-h-full rounded-xl"
                  />
                ) : (
                 <div className="relative  w-full  bg-black overflow-hidden rounded-xl" style={{aspectRatio: aspect}}>
  <video
    src={media.previewUrl}
    className="w-full h-full object-cover"
    style={{
      transform: `scale(${zoom}) translate(${crop.x}px, ${crop.y}px)`,
      transformOrigin: "center",
    }}
    controls
  />
</div>
                )}
              </div>
            )}

          {/* CAPTION */}
          {step ===
            "CAPTION" &&
            media && (
              <div className="space-y-4">
                {media.type ===
                "image" ? (
                  <img
                   src={croppedPreview || media.previewUrl}
                    className="h-64 mx-auto rounded-xl"
                  />
                ) : (
                <div
  className="h-64 mx-auto overflow-hidden"
  style={{ aspectRatio: aspect }}
>
  <video
    src={media.previewUrl}
    className="w-full h-full object-cover"
    controls
  />
</div>
                )}

                <textarea
                  value={caption}
                  onChange={(
                    e
                  ) =>
                    setCaption(
                      e.target
                        .value
                    )
                  }
                  placeholder="Write a caption..."
                  className="w-full border rounded-xl p-3 min-h-[120px]"
                />
              </div>
            )}
        </div>

        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*,video/*"
          onChange={
            handleFileSelect
          }
        />
      </div>
    </div>
  );
}