interface ExploreItemProps {
  item: any;
  onClick: () => void;
}

function ExploreItem({ item, onClick }: ExploreItemProps) {
  // console.log("ello from explore items", item);
  return (
    <div
      style={{ aspectRatio: item.aspectRatio || "1 / 1" }}
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
