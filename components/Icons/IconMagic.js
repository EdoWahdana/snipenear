import React from "react";

const IconMagic = ({ size, color, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.5 1.35C1.97 0.5 3.68 0 5.5 0C11.02 0 15.5 4.48 15.5 10C15.5 15.52 11.02 20 5.5 20C3.68 20 1.97 19.5 0.5 18.65C3.49 16.92 5.5 13.7 5.5 10C5.5 6.3 3.49 3.08 0.5 1.35ZM13.5 10C13.5 5.59 9.91 2 5.5 2C5.16 2 4.82 2.02 4.49 2.07C6.4 4.23 7.5 7.05 7.5 10C7.5 12.95 6.4 15.77 4.49 17.93C4.82 17.98 5.16 18 5.5 18C9.91 18 13.5 14.41 13.5 10Z"
      fill={color}
    />
  </svg>
);

export default IconMagic;
