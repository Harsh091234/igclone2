import React, { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useGetAuthUserQuery } from "../../services/userApi";
import UserAvatar from "../UserAvatar";
import { ImagePlus } from "lucide-react";
import { useCreatePostMutation } from "../../services/postApi";
import toast from "react-hot-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SelectedMedia {
  file: File;
  previewUrl: string;
  type: "image" | "video";
}
export interface CreatePostPayload {
  images: File[];
  caption: string;
}

export type CreatePostStep = "SELECT" | "PREVIEW" | "CAPTION";

const CreatePostModal = ({ isOpen, onClose }: CreatePostModalProps) => {
  const [step, setStep] = useState<CreatePostStep>("SELECT");
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [caption, setCaption] = useState<string>("");
  const { data } = useGetAuthUserQuery();
  const authUser = data?.user;
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [createPost, { isLoading }] = useCreatePostMutation();
  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files) return;

    const selected = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith("image")
        ? "image"
        : ("video" as "image" | "video"),
    }));

    setMedia(selected);

    setStep("PREVIEW");
  };

  const handleClose = () => {
    setStep("SELECT");
    setMedia([]);
    setCaption("");
    onClose();
  };

  const handleImageShare = async () => {
    const formData = new FormData();
    media.forEach((item) => {
      formData.append("media", item.file);
    });
    formData.append("caption", caption);

    const res = await createPost(formData).unwrap();
    console.log("post:", res.post);
    toast.success("Post created successfully");
    setMedia([]);
    setStep("SELECT");
    onClose();
  };

  if (!authUser) return;
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-primary-foreground  rounded-xl
         
          mx-2 sm:mx-0 transition-all overflow-hidden
        "
      >
        {/* HEADER */}
        <header
          className="
          grid grid-cols-3 items-center border-b px-3 py-2
          sticky top-0 z-10
        "
        >
          {/* LEFT */}
          <div className="flex justify-start">
            {step !== "SELECT" && (
              <button onClick={() => setStep("SELECT")} className="p-2">
                <ArrowLeft size={20} />
              </button>
            )}
          </div>

          {/* CENTER */}
          <h2 className="text-center font-semibold text-sm sm:text-base">
            {step === "SELECT" && "Create new post"}
            {step === "PREVIEW" && "Preview"}
            {step === "CAPTION" && "Create post"}
          </h2>

          {/* RIGHT */}
          <div className="flex justify-end">
            {step === "PREVIEW" && (
              <button
                className="text-blue-500 font-semibold text-sm px-2"
                onClick={() => setStep("CAPTION")}
              >
                Next
              </button>
            )}

            {step === "CAPTION" && (
              <button
                onClick={handleImageShare}
                disabled={isLoading} // disables the button during upload
                className={`
      text-blue-500 font-semibold text-sm px-2
      ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:underline"}
    `}
              >
                {isLoading ? "Sharing..." : "Share"}
              </button>
            )}
          </div>
        </header>

        {/* BODY */}
        <div className="flex  w-full  p-2">
          {/* SELECT */}
          {step === "SELECT" && (
            <div
              className="
               h-[50vh] 
              flex flex-col gap-7 w-full justify-center items-center
            "
            >
              <div className="p-7 rounded-full bg-muted">
                <ImagePlus className="w-12 h-12 text-muted-foreground" />
              </div>

              <button
                onClick={() => fileRef.current?.click()}
                className="
                  px-5 py-1.5  sm:py-2 rounded-lg bg-blue-500 text-white text-xs sm:text-sm
                  hover:bg-blue-600 active:scale-95 transition
                "
              >
                Select from computer
              </button>
            </div>
          )}

          {/* PREVIEW */}
          {step === "PREVIEW" && media.length > 0 && (
            <div className="h-[70vh] mt-1 flex items-center justify-center w-full sm:w-md rounded-lg overflow-hidden">
              <Carousel className="flex h-full">
                <CarouselContent className="h-full">
                  {media.map((item, index) => (
                    <CarouselItem
                      key={index}
                      className=" flex items-center justify-center"
                    >
                      {item.type === "image" ? (
                        <img
                          src={item.previewUrl}
                          alt={`preview-${index}`}
                          className="aspect-square  rounded-md"
                        />
                      ) : (
                        <video
                          src={item.previewUrl}
                          controls
                          className="aspect-video  rounded-md "
                        />
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation */}
                {media.length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full hover:bg-black/60 z-10" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full hover:bg-black/60 z-10" />
                  </>
                )}
              </Carousel>
            </div>
          )}

          {/* CAPTION */}
          {step === "CAPTION" && media.length > 0 && (
            <div className="flex flex-col items-center sm:flex-row w-full sm:w-2xl h-[70vh] sm:h-[60vh] gap-0 sm:gap-4">
              {/* LEFT: MEDIA */}
              <div className="relative w-full flex justify-center h-[60%] sm:h-[90%] min-[350px]:w-xs sm:w-[60%] items-center rounded-lg overflow-hidden">
                <Carousel className="flex h-full w-full">
                  <CarouselContent className="h-full">
                    {media.map((item, index) => (
                      <CarouselItem
                        key={index}
                        className="flex h-full items-center overflow-hidden rounded-md "
                      >
                        {item.type === "image" ? (
                          <img
                            src={item.previewUrl}
                            alt={`preview-${index}`}
                            className="aspect-square h-full w-full rounded-md object-cover"
                          />
                        ) : (
                          <video
                            src={item.previewUrl}
                            controls
                            className="aspect-video rounded-md"
                          />
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {media.length > 1 && (
                    <>
                      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full z-10 hover:bg-black/60" />
                      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full z-10 hover:bg-black/60" />
                    </>
                  )}
                </Carousel>
              </div>

              {/* RIGHT: CAPTION */}
              <div className="flex  flex-col px-2 w-full  sm:w-[40%] h-[40%] sm:h-full pt-5 gap-3 sm:gap-4 overflow-hidden">
                <div className="flex items-center  gap-2">
                  <UserAvatar
                    classes="h-8 w-8 sm:h-10 sm:w-10"
                    user={authUser}
                  />
                  <p className="text-sm font-medium truncate">
                    {authUser.userName}
                  </p>
                </div>

                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full h-[55%] sm:h-[6rem] resize-none border rounded-lg p-2 text-sm overflow-y-auto"
                />
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          hidden
          multiple
          onChange={handleImageSelect}
        />
      </div>
    </div>
  );
};

export default CreatePostModal;
