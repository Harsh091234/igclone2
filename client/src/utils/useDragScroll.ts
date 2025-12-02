import { useRef } from "react";

export default function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  const onMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    startX = e.pageX - (ref.current?.offsetLeft || 0);
    scrollLeft = ref.current?.scrollLeft || 0;
  };

  const onMouseLeave = () => (isDown = false);
  const onMouseUp = () => (isDown = false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX) * 1; // scroll speed
    ref.current.scrollLeft = scrollLeft - walk;
  };

  return { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove };
}
