import { useRef } from "react";
import Draggable from "react-draggable";

interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
}

interface Props {
  layer: TextLayer;
  activeTextId: string | null;
  setActiveTextId: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
}

export default function DraggableText({
  layer,
  activeTextId,
  setActiveTextId,
  updatePosition,
}: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: layer.x, y: layer.y }}
      bounds="parent"
      onStop={(e, data) => {
        updatePosition(layer.id, data.x, data.y);
      }}
    >
      <div
        ref={nodeRef}
        onClick={() => setActiveTextId(layer.id)}
        className={`absolute cursor-move px-3 py-1 text-2xl font-bold
          ${activeTextId === layer.id ? "border border-white" : ""}
        `}
      >
        {layer.text}
      </div>
    </Draggable>
  );
}
