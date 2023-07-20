import React from "react";

export default function BoardOverlay({ show }) {
  const style = {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Change color and transparency here
    display: show ? "flex" : "none", // Change to flex to center the lock icon
    justifyContent: "center", // Center the lock icon horizontally
    alignItems: "center", // Center the lock icon vertically
    zIndex: 2,
    borderRadius: "inherit",
  };

  const lockIconStyle = {
    width: "50px", // Adjust size as needed
    height: "50px", // Adjust size as needed
  };

  return (
    <div style={style}>
      <svg
        style={lockIconStyle}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    </div>
  );
}
