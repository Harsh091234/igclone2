import React, { useRef, useState } from "react";
import { ArrowLeft, ImagePlus } from "lucide-react";
import Cropper, { type Area } from "react-easy-crop";
import toast from "react-hot-toast";
import { useCreatePostMutation } from "../../services/postApi";
import getCroppedImg from "../../utils/getCroppedItems";
import { getVideoFrame } from "../../utils/getVideoFrame";

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

const getFeedRatioFromAspect = (aspect: number) => {
  if (aspect === 1) return "1/1";
  if (aspect === 4 / 5) return "4/5";
  if (aspect === 16 / 9) return "16/9";
  if (aspect === 9 / 16) return "9/16";
  return "1/1"; // fallback
};

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
  const [videoMeta, setVideoMeta] = useState<{
  width: number;
  height: number;
} | null>(null);

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
const [processing, setProcessing] = useState(false);

const [mediaSize, setMediaSize] = useState<any>(null);
const videoWidth = mediaSize?.naturalWidth || mediaSize?.width || 0;
const videoHeight = mediaSize?.naturalHeight || mediaSize?.height || 0;
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

  const handleFileSelect = async(
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;
    if (file.type.startsWith("video")) {
  const { frame, width, height } =
    await getVideoFrame(
      URL.createObjectURL(file)
    );

  setMedia({
    file,
    previewUrl: frame,
    type: "video",
  });

  setVideoMeta({ width, height });
} else {
  setMedia({
    file,
    previewUrl: URL.createObjectURL(file),
    type: "image",
  });

  setVideoMeta(null);
}

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
          getFeedRatioFromAspect(aspect)
        );

        formData.append(
          "cropData",
          JSON.stringify(
            croppedAreaPixels
          )
        );
      if (media.type === "video" && videoMeta) {
  formData.append(
    "originalWidth",
    videoMeta.width.toString()
  );

  formData.append(
    "originalHeight",
    videoMeta.height.toString()
  );
};
formData.append("mediaWidth", mediaSize.width.toString());
formData.append("mediaHeight", mediaSize.height.toString());
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

    const containerWidth = 420; // your modal width approx
const containerHeight = 460; // crop area height

const scaleX = containerWidth / (mediaSize?.width || 1);
const scaleY = containerHeight / (mediaSize?.height || 1);

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
if (croppedAreaPixels) {
  if(!media) return;
  if (media.type === "image") {
    const cropped = await getCroppedImg(
      media.previewUrl,
      croppedAreaPixels
    );
    setCroppedPreview(cropped);
  } else {
    // 👉 VIDEO: simulate crop using frame
    const cropped = await getCroppedImg(
      media.previewUrl, // already frame image
      croppedAreaPixels
    );
    setCroppedPreview(cropped);
  }
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
                      
                    <div className="relative w-full h-full">
                            <Cropper
                      image={media.previewUrl}
                      crop={
                        crop
                      }
                      zoom={
                        zoom
                      }
                        objectFit="contain" 
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
                     onMediaLoaded={(mediaSize) => {
  setMediaSize({
    width: mediaSize.naturalWidth || mediaSize.width,
    height: mediaSize.naturalHeight || mediaSize.height,
  });
}}
                    />
                    </div>
                
                  
                </div>
              </>
            )}

          {/* PREVIEW */}
         {step === "PREVIEW" && media && (
  <div className="h-[500px] flex items-center justify-center">
    <div
      className="w-full max-w-[360px] bg-black rounded-xl overflow-hidden"
      style={{ aspectRatio: getFeedRatioFromAspect(aspect) }}
    >
      {media.type === "image" ? (
        <img
          src={croppedPreview || media.previewUrl}
          className="w-full h-full object-cover"
        />
      ) : (
       <img
  src={croppedPreview || media.previewUrl}
  className="w-full h-full object-cover"
/>
      )}
    </div>
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
  className="relative h-64 mx-auto overflow-hidden rounded-xl"
  style={{ aspectRatio: getFeedRatioFromAspect(aspect) }}
>
  <img
    src={croppedPreview || media.previewUrl}
    className="w-full h-full object-cover"
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"  />
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