import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

import { Sheet, SheetContent } from "../ui/sheet";
import { useEffect } from "react";

// import Draggable from "react-draggable";
import DraggableText from "../DraggableText";
import CustomButton from "../CustomButton";
import { useCreateStoryMutation } from "../../services/storyApi";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  setAnimateRing: (value: boolean) => void;
}

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

const predefinedColors = [
  "#ffffff",
  "#000000",
  "#ff3b30",
  "#34c759",
  "#007aff",
  "#ffcc00",
  "#af52de",
];

export default function AddStoryPanel({
  open,
  onOpenChange,
  setAnimateRing,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [createStory, { isLoading: isCreating }] = useCreateStoryMutation();
  const [media, setMedia] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  
  
  
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if(selectedFile.size > 5 * 1024 * 1024){
      toast.error("Max file size is 5MB");
  return;
    }
    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setMedia(url);
if (selectedFile.type.startsWith("image")) {
    setMediaType("image");

    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
    img.src = url;
  } else if (selectedFile.type.startsWith("video")) {
    setMediaType("video");

    const video = document.createElement("video");
    video.onloadedmetadata = () => {
      setAspectRatio(video.videoWidth / video.videoHeight);
    };
    video.src = url;
  }
  };

  // const handleAddText = () => {
  //   const newText: TextLayer = {
  //     id: crypto.randomUUID(),
  //     text: "New Text",
  //     x: 100,
  //     y: 100,
  //     color: "#ffffff", // 👈 default color
  //   };

  //   setTextLayers((prev) => [...prev, newText]);
  //   setActiveTextId(newText.id);
  // };
  const handleTextChange = (value: string) => {
    setTextLayers((prev) =>
      prev.map((layer) =>
        layer.id === activeTextId ? { ...layer, text: value } : layer,
      ),
    );
  };

  const handleDeleteText = () => {
    setTextLayers((prev) => prev.filter((layer) => layer.id !== activeTextId));
    setActiveTextId(null);
  };

  const handleSubmit = async () => {
    try {
      // TODO → send to backend
      console.log({
        media,
        mediaType,
        textLayers,
      });
       if (!file) {
      console.log("No file selected");
      return;
    }
      const formdata = new FormData();
   
      formdata.append("media", file);
      formdata.append("textLayers", JSON.stringify(textLayers));
      
      const story = await createStory(formdata).unwrap();
      

      setAnimateRing(true);
      setTimeout(() => {
        setAnimateRing(false); // reset after animation finishes
      }, 800); // same duration as animation
    } catch (error: any) {
      const message: string =
        (error?.data?.message as string) ||
        (error?.error as string) ||
        "Something went wrong";

      console.log("error in handleSubmit: addstorypanel =>", message);
    }

    onOpenChange(false);
  };

  const handleColorChange = (color: string) => {
    setTextLayers((prev) =>
      prev.map((layer) =>
        layer.id === activeTextId ? { ...layer, color } : layer,
      ),
    );
  };

  useEffect(() => {
    if (!open) {
      // Reset everything when panel closes
      setMedia(null);
      setMediaType(null);
      setTextLayers([]);
      setActiveTextId(null);
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[70vh] p-0 bg-primary-foreground"
      >
        <div className="flex flex-col  h-full text-primary">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-b-border border-white/10">
            <div className="flex gap-3">
              {/* <button onClick={handleAddText}>
                <Type className="hover:text-primary/60" />
              </button> */}

              {activeTextId && (
                <button onClick={handleDeleteText}>
                  <Trash2 className="hover:text-primary/60" />
                </button>
              )}
            </div>

            <CustomButton
              loading={isCreating}
              onClick={handleSubmit}
              loaderClasses={"w-5 h-5"}
              text={"Share"}
              className="w-20 mr-8 font-semibold rounded-md text-sm py-1"
            />
          </div>

          <div className="relative  flex-1 flex items-center justify-center p-2">
            <div className="relative   w-full max-w-2xl h-110  overflow-hidden   flex items-center justify-center">
              {media ? (
                <div 
                  className="relative flex items-center justify-center"
  style={{
    width: "100%",
    maxWidth: aspectRatio && aspectRatio > 1 ? "100%" : "400px",
  }}
                >
                  {/* MEDIA */}
                <div className=" overflow-hidden">
  {mediaType === "image" ? (
    <img
      src={media}
      className="object-contain max-h-[60vh] w-full"
    />
  ) : (
    <video
      src={media}
      className="object-contain max-h-[60vh] w-full"
      controls
    />
  )}
</div>
                  {/* TEXT LAYERS */}
                  {textLayers.map((layer) => (
                    <DraggableText
                      key={layer.id}
                      layer={layer}
                      activeTextId={activeTextId}
                      setActiveTextId={setActiveTextId}
                      updatePosition={(id, x, y) => {
                        setTextLayers((prev) =>
                          prev.map((l) => (l.id === id ? { ...l, x, y } : l)),
                        );
                      }}
                    />
                  ))}
                </div>
              ) : (
             <div
  onClick={() => fileRef.current?.click()}
  className="group flex flex-col items-center justify-center gap-3
             w-full h-44 rounded-xl
             border border-dashed border-border
             bg-muted/30
             cursor-pointer
             transition-all duration-200
             hover:bg-muted/50 hover:border-primary hover:shadow-sm"
>
  <ImagePlus className="w-7 h-7 text-muted-foreground group-hover:text-primary transition" />
  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition">
    Upload Image or Video
  </span>
</div>
              )}
            </div>
          </div>

          {/* Edit Active Text */}
          {activeTextId && (
            <div className="p-4 border-t border-white/10">
              <input
                value={
                  textLayers.find((l) => l.id === activeTextId)?.text || ""
                }
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Edit text..."
                className="w-full  border-2 border-primary/20 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-3 mt-3 flex-wrap justify-center  ">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      textLayers.find((l) => l.id === activeTextId)?.color ===
                      color
                        ? "border-primary scale-110"
                        : "border-white/30"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={handleFileChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
