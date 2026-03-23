function ExploreItem({ item }: any) {
  console.log("ello from explore items", item);
  return (
    <div
      style={{ aspectRatio: item.aspectRatio || "1 / 1" }}
      className="relative w-full overflow-hidden rounded-xl bg-green-600"
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
        />
      )}
    </div>
  );
}

export default ExploreItem;
