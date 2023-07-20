import { useEffect, useState } from "react";

function PlayerPiece({ state, pending }) {
  const [animation, setAnimation] = useState("");
  const [shouldPulse, setShouldPulse] = useState(false);

  // Track when 'pending' changes from true to false
  useEffect(() => {
    if (!pending) {
      setShouldPulse(true);
    }
  }, [pending]);

  // Handle the spinning animation when pending and the pulse animation when not pending
  useEffect(() => {
    if (pending) {
      setAnimation("opacity-50");
    } else if (shouldPulse) {
      setAnimation("opacity-100 animate-pulse");
      const timeoutId = setTimeout(() => {
        setAnimation("opacity-100");
        setShouldPulse(false); // Reset shouldPulse after the pulse animation completes
      }, 3000);
      return () => clearTimeout(timeoutId);
    } else {
      setAnimation("opacity-100");
    }
  }, [pending, shouldPulse]);

  return (
    <div className="relative">
      {state === "goku" && (
        <img
          src="/goku.svg"
          alt="Goku"
          className={`h-16 w-16 mx-auto my-4 ${animation}`}
        />
      )}
      {state === "frieza" && (
        <img
          src="/frieza.svg"
          alt="Frieza"
          className={`h-16 w-16 mx-auto my-4 ${animation}`}
        />
      )}
      {pending && (
        <img
          src="/hourglass.svg"
          alt="Hourglass"
          className="absolute left-[21px] top-[10px] h-12 w-12 animate-spin"
        />
      )}
    </div>
  );
}

export default PlayerPiece;
