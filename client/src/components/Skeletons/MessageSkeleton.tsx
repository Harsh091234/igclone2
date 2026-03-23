const MessageSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 p-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`
            animate-pulse
            flex flex-col gap-1
            px-3 py-2
            rounded-xl
            max-w-[70%]
            ${
              i % 2 === 0
                ? "bg-muted rounded-bl-none"
                : "bg-primary/30 rounded-br-none"
            }
          `}
          >
            <div className="h-2 w-24 bg-muted-foreground/30 rounded" />
            <div className="h-2 w-16 bg-muted-foreground/30 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;
