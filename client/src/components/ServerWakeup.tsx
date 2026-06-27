import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import logo from "../assets/instagram.png"; // Change the path to your logo

const statusMessages = [
  "Waking up the server",
  "Connecting to the backend",
  "Preparing your shopping experience",
  "Loading products and services",
  "Establishing a secure connection",
  "Almost ready",
];

const helperMessages = [
  "The server goes to sleep after a period of inactivity to conserve resources.",
  "The first request usually takes between 20 and 40 seconds.",
  "Everything is happening automatically. No action is required.",
  "Your session is being prepared.",
  "We'll take you to the application as soon as everything is ready.",
  "Thank you for your patience.",
];

const ServerWakeup = () => {
  const [seconds, setSeconds] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const secondTimer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    const messageTimer = setInterval(() => {
      setIndex((prev) => (prev + 1) % statusMessages.length);
    }, 3500);

    return () => {
      clearInterval(secondTimer);
      clearInterval(messageTimer);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={logo}
            alt="Instagram"
            className="size-24 rounded-2xl object-contain"
          />
        </div>

        {/* Brand */}
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          Instagram
        </h1>

        <p className="mt-2 text-center text-sm text-muted-foreground">
          Preparing everything for you...
        </p>

        {/* Status */}
        <div className="mt-10 flex  gap-2 items-center justify-center text-lg font-medium text-primary">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {statusMessages[index]}
            </motion.span>
          </AnimatePresence>

          <AnimatedDots />
        </div>

        {/* Progress */}
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full w-1/3 rounded-full bg-primary"
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "300%"] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Helper Text */}
        <div className="mt-8 min-h-[70px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-center leading-7 text-muted-foreground"
            >
              {helperMessages[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-10 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <span>{seconds}s elapsed</span>

          <span>•</span>

          <div className="flex items-center gap-2">
            <div className="size-2 animate-pulse rounded-full bg-primary" />
            <span>Waiting for server</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerWakeup;

function AnimatedDots() {
  return (
    <span className="ml-1 inline-flex gap-1">
      {[0, 0.2, 0.4].map((delay, index) => (
        <motion.span
          key={index}
          className="size-1.5 rounded-full bg-primary"
          animate={{
            y: [0, -3, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay,
          }}
        />
      ))}
    </span>
  );
}
