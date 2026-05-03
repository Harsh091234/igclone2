import React, { useRef, useState } from "react";
import { ArrowLeft, ImagePlus } from "lucide-react";
import Cropper, { type Area } from "react-easy-crop";
import toast from "react-hot-toast";
import { useCreatePostMutation } from "../../services/postApi";
import getCroppedImg from "../../utils/getCroppedItems";
import { getVideoFrame } from "../../utils/getVideoFrame";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

type Step = "SELECT" | "CROP" | "PREVIEW" | "CAPTION";

type MediaType = "image" | "video";

interface SelectedMedia {
  file: File;
  previewUrl: string;
  type: MediaType;
   width?: number;   // ✅ add this
  height?: number;  // ✅ add this

  crop?: { x: number; y: number };
  zoom?: number;
  croppedAreaPixels?: Area | null;
  croppedPreview?: string | null;
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
  return "1/1";
};

const getAspectLabel = (aspect: number) => {
  if (aspect === 1) return "1/1";
  if (aspect === 4 / 5) return "4/5";
  if (aspect === 16 / 9) return "16/9";
  if (aspect === 9 / 16) return "9/16";
  return "1/1";
};


type AspectBtnProps = {
  label: string;
  value: number;
  activeAspect: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

const AspectBtn = ({
  label,
  value,
  activeAspect,
  onChange,
  disabled,
}: AspectBtnProps) => {
  const isActive = activeAspect === value;

  return (
    <button
      onClick={() => onChange(value)}
      disabled={disabled}
     className={`w-13 h-13 border text-sm rounded-lg transition
    ${
      isActive
        ? "bg-primary border-primary text-primary-foreground"
        : "bg-background border-border"
    }
    ${
      disabled
        ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground border-muted"
        : "hover:bg-primary/5"
    }
  `}
    >
      {label}
    </button>
  );
};


export default function CreatePostModal({
  isOpen,
  onClose,
}: Props) {
  const [step, setStep] =
    useState<Step>("SELECT");
  // const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [contentType, setContentType] =
    useState<"post" | "reel" | null>(
      null
    );
    const [lockedAspect, setLockedAspect] = useState<number | null>(null);
    const [carousalApi, setCarousalApi] = useState<any>(null);
  const [videoMeta, setVideoMeta] = useState<{
  width: number;
  height: number;
} | null>(null);

  const [media, setMedia] =
    useState<SelectedMedia[]>(
      []
    );
    const [currentIndex, setCurrentIndex] = useState(0);
    console.log("current media:", media)
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
  // const [crop, setCrop] = useState({
  //   x: 0,
  //   y: 0,
  // });

  // const [zoom, setZoom] =
  //   useState(1);

  // const [
  //   croppedAreaPixels,
  //   setCroppedAreaPixels,
  // ] = useState<Area | null>(null);
    const currentMedia = media[currentIndex];
  const fileRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [
    createPost,
    { isLoading },
  ] = useCreatePostMutation();
const effectiveAspect = lockedAspect ?? aspect;
  if (!isOpen) return null;


  const previewMaxWidth =
  aspect === 9 / 16
    ? 270
    :420
const isLocked = media.length > 1 && lockedAspect !== null;


  const resetAll = () => {
    setStep("SELECT");
    setContentType(null);
    setMedia([]);
    setCaption("");
    setFeedRatio("4/5");
    setAspect(1);
    // setCrop({ x: 0, y: 0 });
    // setZoom(1);
    // setCroppedAreaPixels(null);
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
    const files = Array.from
      (e.target.files || [] );
 const processed: SelectedMedia[] = [];
if (!files.length) return;
  if (contentType === "reel" && files.length > 1) {
    toast.error("Reels support only one video");
    return;
  }
    if (contentType === "post" && files.length > 5) {
    toast.error("You can upload maximum 5 items");
    return;
  }
  for (const file of files) {
    if (file.type.startsWith("video")) {
      const { frame, width, height } = await getVideoFrame(
        URL.createObjectURL(file)
      );

      processed.push({
        file,
        previewUrl: frame,
        type: "video",
      });

      setVideoMeta({ width, height }); // ⚠️ only stores last one (we’ll fix later if needed)
    } else {
      processed.push({
        file,
        previewUrl: URL.createObjectURL(file),
        type: "image",
      });
    }
  }

     setMedia(processed);
  setCurrentIndex(0);
  setStep("CROP");
  };

  const handleUpload =
    async () => {
      if (!media) return;

      try {
        const formData =
          new FormData();

    media.forEach((item, index) => {
  formData.append("media", item.file);

 formData.append(
  "cropData",
  JSON.stringify({
    index,
    crop: item.croppedAreaPixels,
          originalWidth: item.width,
      originalHeight: item.height,
  })
);
});

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
      formData.append("aspect", getAspectLabel(aspect));

        formData.append(
          "feedRatio",
           aspect === 9 / 16 ? "4/5" : getFeedRatioFromAspect(aspect)
        );

       
    
formData.append("mediaWidth", String(mediaSize?.width || 0));
formData.append("mediaHeight", String(mediaSize?.height || 0));

console.log("current form data:", formData)
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
  const current = media[currentIndex];

  if (!current.croppedAreaPixels) return;

  const cropped = await getCroppedImg(
    current.previewUrl,
    current.croppedAreaPixels
  );

  setMedia((prev) => {
    const copy = [...prev];
    copy[currentIndex].croppedPreview = cropped;
    return copy;
  });
   if (media.length > 1 && lockedAspect === null) {
  setLockedAspect(aspect);
}
  // Move to next image OR preview step
  if (currentIndex < media.length - 1) {
    setCurrentIndex((prev) => prev + 1);
  } else {
    setStep("PREVIEW");
  }
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
         {step === "SELECT" && (
  <div className="h-[500px] flex flex-col items-center justify-center gap-6">
    
    <div className="text-center space-y-2">
      <ImagePlus size={48} className="mx-auto text-muted-foreground" />
      <h2 className="text-lg font-semibold">Create new</h2>
      <p className="text-sm text-gray-500">
        Choose what you want to upload
      </p>
    </div>

    <div className="w-full space-y-3">
      
      {/* POST CARD */}
      <button
        onClick={() => {
          setContentType("post");
          setAspect(1);
          fileRef.current?.click();
        }}
        className="w-full flex items-center gap-4 p-4 rounded-xl border hover:bg-primary/5  transition group"
      >
        <div className="w-12 h-12 flex items-center justify-center rounded-lg border bg-muted">
          📸
        </div>

        <div className="text-left">
          <p className="font-medium">Create Post</p>
          <p className="text-sm text-gray-500">
            Upload photos or videos
          </p>
        </div>
      </button>

      {/* REEL CARD */}
      <button
        onClick={() => {
          setContentType("reel");
          setAspect(9 / 16);
          fileRef.current?.click();
        }}
        className="w-full flex items-center gap-4 p-4 rounded-xl border  hover:bg-primary/5 transition group"
      >
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-muted">
          🎬
        </div>

        <div className="text-left">
          <p className="font-medium">Create Reel</p>
          <p className="text-sm text-gray-500">
            Upload vertical videos
          </p>
        </div>
      </button>

    </div>
  </div>
)}
          {/* CROP */}
          {step === "CROP" &&
            media && (
              <>
               <div className="flex gap-2 mb-3">
  {contentType === "post" ? (
    <>
      <AspectBtn
        label="1:1"
        value={1}
        activeAspect={aspect}
        onChange={setAspect}
          disabled={isLocked && lockedAspect !== 1}
      />
      <AspectBtn
        label="4:5"
        value={4 / 5}
        activeAspect={aspect}
        onChange={setAspect}

  disabled={isLocked && lockedAspect !== 4 / 5}
      />
      <AspectBtn
        label="16:9"
        value={16 / 9}
        activeAspect={aspect}
        onChange={setAspect}
          disabled={isLocked && lockedAspect !== 16 / 9}
      />
    </>
  ) : (
    <>
      <AspectBtn
        label="9:16"
        value={9 / 16}
        activeAspect={aspect}
        onChange={setAspect}
      />
      <AspectBtn
        label="4:5"
        value={4 / 5}
        activeAspect={aspect}
        onChange={setAspect}
      />
      <AspectBtn
        label="16:9"
        value={16 / 9}
        activeAspect={aspect}
        onChange={setAspect}
      />
    </>
  )}
</div>

                <div className="relative h-[460px] w-full bg-black rounded-xl overflow-hidden">
                      
                    <div className="relative w-full h-full">
<Cropper
  image={currentMedia.previewUrl}
  crop={currentMedia.crop || { x: 0, y: 0 }}
  zoom={currentMedia.zoom || 1}
  aspect={aspect}
  objectFit="contain"

  onCropChange={(newCrop) => {
    setMedia((prev) => {
      const copy = [...prev];
      copy[currentIndex].crop = newCrop;
      return copy;
    });
  }}

  onZoomChange={(newZoom) => {
    setMedia((prev) => {
      const copy = [...prev];
      copy[currentIndex].zoom = newZoom;
      return copy;
    });
  }}

  onCropComplete={(_, pixels) => {
    setMedia((prev) => {
      const copy = [...prev];
      copy[currentIndex].croppedAreaPixels = pixels;
      return copy;
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
      className="w-full bg-black rounded-xl overflow-hidden"
      style={{
        aspectRatio: getFeedRatioFromAspect(aspect),
        maxWidth: previewMaxWidth,
      }}
    >
      {media.length === 1 ? (
        // ✅ SINGLE
        <img
          src={media[0].croppedPreview || media[0].previewUrl}
          className="w-full h-full object-cover"
        />
      ) : (
        // ✅ MULTIPLE → SHADCN CAROUSEL
       <Carousel
  setApi={(api) => {
    if (!api) return;

    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }}
  opts={{ align: "start" }}
  className="w-full h-full relative"
>
          <CarouselContent>
            {media.map((item, index) => (
              <CarouselItem key={index}>
                <div className="w-full h-full">
                  <img
                    src={item.croppedPreview || item.previewUrl}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />

    {/* dots */}
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
      {media.map((_, i) => (
        <button
          key={i}
          onClick={() => carousalApi?.scrollTo(i)}
          className={`w-2 h-2 rounded-full ${
            i === currentIndex ? "bg-white" : "bg-white/40"
          }`}
        />
      ))}
    </div>



        </Carousel>
        
      )}
    </div>
  </div>
)}

          {/* CAPTION */}
          {step ===
            "CAPTION" &&
            media && (
              <div className="space-y-4">
               <div
  className="relative mx-auto overflow-hidden rounded-xl"
  style={{
    aspectRatio: getFeedRatioFromAspect(aspect),
    maxWidth: previewMaxWidth,
  }}
>
  {media.length === 1 ? (
    // ✅ SINGLE
    <img
      src={media[0].croppedPreview || media[0].previewUrl}
      className="w-full h-full object-cover"
    />
  ) : (
    // ✅ MULTIPLE → CAROUSEL
    <Carousel
      setApi={(api) => {
        if (!api) return;

        setCarousalApi(api);

        api.on("select", () => {
          setCurrentIndex(api.selectedScrollSnap());
        });
      }}
      opts={{ align: "start" }}
      className="w-full h-full relative"
    >
      <CarouselContent>
        {media.map((item, index) => (
          <CarouselItem key={index}>
            <img
              src={item.croppedPreview || item.previewUrl}
              className="w-full h-full object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* ✅ Arrows */}
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 " />
      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />

      {/* ✅ Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
        {media.map((_, i) => (
          <button
            key={i}
            onClick={() => carousalApi?.scrollTo(i)}
            className={`w-2 h-2 rounded-full ${
              i === currentIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </Carousel>
  )}

  {/* ✅ Optional overlay for videos only */}
  {media[currentIndex].type === "video" && (
    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
  )}
</div>

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
          multiple={contentType !== "reel"}
          hidden
           accept={contentType === "reel" ? "video/*" : "image/*,video/*"}
          onChange={
            handleFileSelect
          }
        />
      </div>
    </div>
  );
}