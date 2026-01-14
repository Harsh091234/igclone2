import React, { useRef, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { useGetAuthUserQuery } from "../../services/userApi";
import UserAvatar from "../UserAvatar";
import { ImagePlus } from "lucide-react";
import { useCreatePostMutation } from "../../services/postApi";
import toast from "react-hot-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

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

const CreatePostModal  = ({
  isOpen,
  onClose,
}: CreatePostModalProps) => {
  const [step, setStep] = useState<CreatePostStep>("SELECT");
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [caption, setCaption] = useState<string>("");
    const {data} = useGetAuthUserQuery();
    const authUser = data?.user;
  const fileRef = useRef<HTMLInputElement | null>(null);
    const [createPost, {isLoading}] = useCreatePostMutation();
  if (!isOpen) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files) return;

    const selected = files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith("image")? "image" : "video" as "image" | "video"
    }))

   setMedia(selected)

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
        formData.append("media", item.file)
    })
    formData.append("caption", caption)

    const res = await createPost(formData).unwrap();
    console.log("post:", res.post);
    toast.success("Post created successfully");
    setMedia([]);
    setStep("SELECT");
    onClose();
  }

  if(!authUser) return
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white dark:bg-background rounded-xl overflow-hidden
          w-full max-w-[420px] sm:max-w-[680px] 
          mx-2 sm:mx-0 transition-all
        "
      >
        {/* HEADER */}
        <header
          className="
          grid grid-cols-3 items-center border-b px-3 py-2
          sticky top-0 bg-white dark:bg-background z-10
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
        <div className="p-4">
          {/* SELECT */}
          {step === "SELECT" && (
            <div
              className="
              min-h-[200px] sm:min-h-[330px]
              flex flex-col gap-7 justify-center items-center
            "
            >
              <div className="p-7 rounded-full bg-muted">
                <ImagePlus className="w-12 h-12 text-muted-foreground" />
              </div>

              <button
                onClick={() => fileRef.current?.click()}
                className="
                  px-5 py-2 rounded-lg bg-blue-500 text-white text-sm
                  hover:bg-blue-600 active:scale-95 transition
                "
              >
                Select from computer
              </button>
            </div>
          )}

          {/* PREVIEW */}
          {step === "PREVIEW" && media.length > 0 && (
            <div className="relative w-full max-w-md mx-auto">
              {" "}
              {/* center & limit width */}
              <Carousel className="w-full">
                <CarouselContent>
                  {media.map((item, index) => (
                    <CarouselItem key={index}>
                      <div className="flex justify-center items-center p-1">
                        {item.type === "image" ? (
                          <img
                            src={item.previewUrl}
                            alt={`preview-${index}`}
                            className="w-full h-[300px] sm:h-[350px] rounded-lg object-cover"
                          />
                        ) : (
                          <video
                            src={item.previewUrl}
                            controls
                            className="w-full h-[300px] sm:h-[350px] rounded-lg object-cover"
                          />
                        )}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Buttons */}
                <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-10">
                  &#10094;
                </CarouselPrevious>
                <CarouselNext className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-10">
                  &#10095;
                </CarouselNext>
              </Carousel>
            </div>
          )}

          {/* CAPTION */}
          {step === "CAPTION" && media.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-[60%] max-w-md mx-auto rounded-lg overflow-hidden">
                <Carousel className="w-full">
                  <CarouselContent>
                    {media.map((item, index) => (
                      <CarouselItem key={index}>
                        <div className="flex justify-center items-center w-full h-[350px] sm:h-[400px]">
                          {item.type === "image" ? (
                            <img
                              src={item.previewUrl}
                              alt={`preview-${index}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={item.previewUrl}
                              controls
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Navigation Buttons */}
                  <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-10">
                    &#10094;
                  </CarouselPrevious>
                  <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-10">
                    &#10095;
                  </CarouselNext>
                </Carousel>
              </div>

              <div className="flex sm:mt-5 flex-col gap-4 w-full sm:w-[40%]">
                <div className="flex items-center gap-3">
                  <UserAvatar classes="h-10 w-10" user={authUser} />
                  <p className="text-sm font-medium truncate">
                    {authUser.userName}
                  </p>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full resize-none border rounded-lg p-2 text-sm min-h-[120px]"
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