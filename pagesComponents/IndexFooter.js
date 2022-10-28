import React from "react";
import Link from "next/link";

export default function IndexFooter() {
  return (
    <>
      <footer className="relative bg-snipenear-bg pt-8 pb-6">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap text-center lg:text-left pt-2 md:pt-6">
            <div className="w-full px-4">
              <img
                src="snipenear-logo-title.png"
                alt="Material Tailwind Logo"
                className="w-32 mr-auto md:w-72 md:mx-auto cursor-pointer"
              />
              <div className="w-full inline-flex gap-x-4 justify-center items-center mt-6">
                <a
                  href="twitter.com"
                  className="text-white text-md font-bold underline"
                >
                  Twitter
                </a>
                <a
                  href="twitter.com"
                  className="text-white text-md font-bold underline"
                >
                  Discord
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
