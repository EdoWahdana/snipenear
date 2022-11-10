import React from "react";

const IconWarning = ({ size, color, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.9875 0.5C6.0875 0.5 0.5 6.1 0.5 13C0.5 19.9 6.0875 25.5 12.9875 25.5C19.9 25.5 25.5 19.9 25.5 13C25.5 6.1 19.9 0.5 12.9875 0.5ZM14.25 14.25V6.75H11.75V14.25H14.25ZM14.25 19.25V16.75H11.75V19.25H14.25ZM3 13C3 18.525 7.475 23 13 23C18.525 23 23 18.525 23 13C23 7.475 18.525 3 13 3C7.475 3 3 7.475 3 13Z"
      fill={color}
    />
  </svg>
);

export default IconWarning;
