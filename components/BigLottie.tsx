import * as React from "react";
import { Box, Typography } from "@mui/material";
import type { LottiePlayer } from "lottie-web";

function assertIsNode(e: EventTarget | null): asserts e is Node {
  if (!e || !("nodeType" in e)) {
    throw new Error(`Node expected`);
  }
}

type AppProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const BigLottie = ({ open, setOpen }: AppProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = React.useState<LottiePlayer | null>(null);

  /**
   * Hook that alerts clicks outside of the passed ref
   */
  function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>) {
    React.useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: Event) {
        assertIsNode(event.target);
        if (
          ref.current &&
          event.target &&
          !ref.current.contains(event.target)
        ) {
          setOpen(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useOutsideAlerter(ref);

  // load lottie library asynchronously
  React.useEffect(() => {
    import("lottie-web").then((Lottie) => {
      setLottie(Lottie.default);
    });
  }, []);

  // when the lottie library has finished loading, load the animation json asynchronously (patch to the div ref)
  React.useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/big-lottie.json",
      });
      // clear side effect on unmount
      return () => animation.destroy();
    }
  }, [lottie]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: open ? "flex" : "none",
        flexDirection: "column",
        p: 5,
        background: "rgba(0, 0, 0, 0.5)",
        gap: 3,
        minHeight: 300,
        minWidth: 300,
        visibility: open ? "visible" : "hidden",
        zIndex: 100,
        position: "absolute",
      }}
    >
      <Typography variant="h5" sx={{ color: "#4E4E4E" }}>
        Big Lottie File {open ? "Open" : "Close"}
      </Typography>
      <div ref={ref}></div>
    </Box>
  );
};

export default BigLottie;
