import React from "react";

const IconCheck = ({ size, color, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect
      x="1.57143"
      y="1.57143"
      width="28.8571"
      height="28.8571"
      stroke={color}
      strokeWidth="3.14286"
    />
  </svg>
);

export default IconCheck;
