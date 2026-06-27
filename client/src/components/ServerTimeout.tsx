import { RefreshCw, ServerCrash } from "lucide-react";

interface ServerTimeoutProps {
  onRetry: () => void;
}

const ServerTimeout = ({ onRetry }: ServerTimeoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-destructive/10">
            <ServerCrash className="size-12 text-destructive" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground">
          Unable to Reach the Server
        </h1>

        {/* Description */}
        <p className="mt-4 leading-7 text-muted-foreground">
          The server didn't respond within the expected time. It may still be
          starting or temporarily unavailable.
        </p>

        {/* Retry Button */}
        <button
          onClick={onRetry}
          className="mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RefreshCw className="size-4" />
          Try Again
        </button>

        {/* Footer */}
        <p className="mt-6 text-sm text-muted-foreground">
          If the problem continues, please try again in a few minutes.
        </p>
      </div>
    </div>
  );
};

export default ServerTimeout;
