import React from "react";

const IconChecked = ({ size, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width={size} height={size} fill="#5C4A50" />
    <path
      d="M8.79995 15.9L4.59995 11.7L3.19995 13.1L8.79995 18.7L20.8 6.70005L19.4 5.30005L8.79995 15.9Z"
      fill="#CCA8B4"
    />
  </svg>
);

export default IconChecked;
