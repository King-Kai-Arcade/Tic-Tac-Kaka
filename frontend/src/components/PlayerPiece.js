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
      }, 5000);
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
          className="absolute left-[32px] top-[23px] h-6 w-6 animate-spin"
        />
      )}
    </div>
  );
}

export default PlayerPiece;
