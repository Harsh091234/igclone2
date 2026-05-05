interface ExploreItemProps {
  item: any;
  aspect: "1/1" | "4/5" | "16/9"| "9/16";
  onClick: () => void;
}

function ExploreItem({ item, onClick, aspect }: ExploreItemProps) {
 
  return (
    <div
      style={{ aspectRatio: aspect }}
      className="relative w-full overflow-hidden rounded-xl cursor-pointer "
      onClick={onClick}
    >
      {item.type === "image" ? (
        <img
          src={item.url}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <video
          src={item.url}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
      )}
    </div>
  );
}

export default ExploreItem;
