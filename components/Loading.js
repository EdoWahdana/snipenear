import React from "react";
import Lottie from "react-lottie";
import * as animationData from "../public/abstract.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const Loading = () => {
  return (
    <div
      class="loading fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-0 flex flex-col items-center justify-center"
    >
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
      <Lottie options={defaultOptions} height={500} width={500} />
      <p class="w-1/3 text-center text-white">
        This may take a few seconds.
      </p>
    </div>
  );
};

export default Loading;
