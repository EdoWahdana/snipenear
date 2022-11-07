import React from "react";

const IconDelete = ({ size, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 50 67"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.6667 0H33.3333L37.5 4.16667H50V12.5H0V4.16667H12.5L16.6667 0ZM4.16667 58.3333C4.16667 62.9167 7.91667 66.6667 12.5 66.6667H37.5C42.0833 66.6667 45.8333 62.9167 45.8333 58.3333V16.6667H4.16667V58.3333ZM12.5 25H37.5V58.3333H12.5V25Z"
      fill="white"
    />
  </svg>
);

export default IconDelete;
