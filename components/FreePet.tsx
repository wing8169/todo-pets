import * as React from "react";
import { Box, Typography } from "@mui/material";
import type { AnimationItem, LottiePlayer } from "lottie-web";
import bg from "../public/bg.png";
import { useAppDispatch } from "../redux/hooks";
import PetCard from "./PetCard";
import pokemons from "../public/pokemons.json";
import { snackbarMessage } from "../redux/snackbarSlice";
import chest from "../public/big-lottie_minify.json";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { loading } from "../redux/loadingSlice";

type AppProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const FreePet = ({ open, setOpen }: AppProps) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [lottie, setLottie] = React.useState<LottiePlayer | null>(null);
  const [animation, setAnimation] = React.useState<AnimationItem | null>(null);
  const [pet, setPet] = React.useState("");
  const dispatch = useAppDispatch();
  const { id } = useSelector((state: RootState) => state.auth);

  // useOutsideAlerter is a hook that will trigger the block if users click outside the chest
  function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>) {
    // assertIsNode validates the data type for event target
    function assertIsNode(e: EventTarget | null): asserts e is Node {
      if (!e || !("nodeType" in e)) {
        throw new Error(`Node expected`);
      }
    }

    React.useEffect(() => {
      // on cursor click, check if the cursor is outside the ref (the target div)
      function handleClickOutside(event: Event) {
        assertIsNode(event.target);
        if (
          ref.current &&
          event.target &&
          !ref.current.contains(event.target)
        ) {
          // if outside, close the chest, reset the chest speed and end the story
          setPet("");
          setOpen(false);
          setAnimation((prev) => {
            if (!!prev) prev.setSpeed(1);
            return prev;
          });
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

  // initialize the outside alerter hook
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
      console.log("start loading animation");
      lottie.setQuality("low");
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: false,
        autoplay: false,
        animationData: chest,
        initialSegment: [30, 91],
        rendererSettings: {
          // progressiveLoad: true,
        },
      });
      animation.addEventListener("DOMLoaded", () => {
        console.log("DOM has been loaded!");
        console.log("Number of DOMs: " + document.querySelectorAll("g").length);
      });
      setAnimation(animation);
      console.log("finished loading animation");
      // clear side effect on unmount
      return () => animation.destroy();
    }
  }, [lottie]);

  // when the animation and ID are both loaded, add the event listener to fetch a new pet
  React.useEffect(() => {
    if (!!animation && !!id) {
      // on animation complete, draw a pokemon card for the user
      animation.addEventListener("complete", () => {
        fetch(`/api/user/${id}/freepet`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((resp) => {
            resp.json().then((data) => {
              setPet(data.name);
            });
          })
          .catch((err) => {
            console.log(err);
            dispatch(
              snackbarMessage({
                message: err.toString(),
                severity: "error",
              })
            );
          });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation, id]);

  React.useEffect(() => {
    if (!animation || !animation.isLoaded) return;
    // when the modal is opened, play the animation
    if (open) {
      console.log("start playing animation");
      animation.play();
    } else {
      // else, stop the animation and reset the chest back to the closed state
      console.log("stop playing animation");
      animation.stop();
      animation.setSegment(30, 91);
    }
  }, [animation, open]);

  return (
    <Box
      sx={{
        display: open ? "flex" : "none",
        flexDirection: "column",
        p: 5,
        backgroundImage: `url(${bg.src})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        gap: 3,
        minHeight: 300,
        minWidth: 300,
        visibility: open ? "visible" : "hidden",
        zIndex: 100,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "30px",
        boxShadow: "10px 10px 89px -39px rgba(0,0,0,0.75)",
      }}
    >
      <div
        ref={ref}
        style={{
          cursor: "pointer",
          display: !pet ? "block" : "none",
        }}
        onClick={() => {
          // on chest click, set the speed to 4x faster to fast track the animation
          if (!!animation) {
            animation.setSpeed(4);
          }
        }}
      ></div>
      {!!pet && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PetCard src={pokemons[pet as keyof typeof pokemons]} title={pet} />
          <Typography
            variant="h6"
            sx={{
              color: "#4E4E4E",
            }}
          >
            <b>{pet}</b> has joined your family!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FreePet;
