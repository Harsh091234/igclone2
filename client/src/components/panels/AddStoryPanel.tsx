import { useRef, useState } from "react";
import { Trash2, Type, X } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { useEffect } from "react";

import Draggable from "react-draggable";
import DraggableText from "../DraggableText";
import CustomButton from "../CustomButton";

interface Props {
  open: boolean;
  onOpenChange: (value: boolean) => void;
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

export default function AddStoryPanel({ open, onOpenChange }: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [textLayers, setTextLayers] = useState<TextLayer[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setMedia(url);

    if (file.type.startsWith("image")) setMediaType("image");
    else if (file.type.startsWith("video")) setMediaType("video");
  };

  const handleAddText = () => {
    const newText: TextLayer = {
      id: crypto.randomUUID(),
      text: "New Text",
      x: 100,
      y: 100,
      color: "#ffffff", // 👈 default color
    };

    setTextLayers((prev) => [...prev, newText]);
    setActiveTextId(newText.id);
  };
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

  const handleSubmit = () => {
    // TODO → send to backend
    console.log({
      media,
      mediaType,
      textLayers,
    });

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
        <div className="flex flex-col h-full text-primary">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <button onClick={() => onOpenChange(false)}>
              <X className="hover:text-primary/60" />
            </button>

            <div className="flex gap-3">
              <button onClick={handleAddText}>
                <Type className="hover:text-primary/60" />
              </button>

              {activeTextId && (
                <button onClick={handleDeleteText}>
                  <Trash2 className="hover:text-primary/60" />
                </button>
              )}
            </div>

            <CustomButton
              onClick={handleSubmit}
              text={"Share"}
              className="w-20 font-semibold rounded-md text-sm py-1"
            />
          </div>

          {/* Media Preview */}
          <div className="relative flex-1 overflow-hidden flex items-center justify-center">
            {media ? (
              <>
                {mediaType === "image" ? (
                  <img src={media} className="w-full h-full object-contain" />
                ) : (
                  <video
                    src={media}
                    className="w-full h-full object-contain"
                    controls
                  />
                )}

                {/* MULTIPLE TEXT LAYERS */}
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
              </>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="border border-white/30 px-4 py-2 rounded-md"
              >
                Upload Image / Video
              </button>
            )}
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
