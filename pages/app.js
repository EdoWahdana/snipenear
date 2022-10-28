import React, { useContext, useEffect, useState } from "react";
import Header from "components/Documentation/Header";
import IndexNavbar from "pagesComponents/IndexNavbar";
import IndexFooter from "pagesComponents/IndexFooter";
import Button from "components/Button/Button";
import UserContext from "../config/context";
import { parseImgUrl } from "../utils/common";

const App = () => {
  const { walletConnection, contract, near } = useContext(UserContext);

  return (
    <>
      <Header title="SnipeNear | App" />
      <section
        className="header relative items-center flex bg-fill"
        style={{
          backgroundImage: `url('./landing-page.png')`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container max-w-7xl mx-auto">
          <div className="w-full px-8 md:px-4 text-center">
            <div className="flex flex-col md:flex-row relative mt-32">
              <div className="md:w-6/12 mr-auto mt-10">
                <div className="w-[90%]">
                  <p
                    className="tracking-wide text-white text-lg font-bold text-left md:text-5xl font-poppins"
                    style={{ lineHeight: 1.3 }}
                  >
                    The most reliable tool to snipe your favorite NFT &
                    Collection
                  </p>
                </div>
                <br />
                <div className="w-5/6">
                  <p
                    className=" text-white text-md text-left md:text-xl"
                    style={{
                      lineHeight: 1.3,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Have you ever missed getting your most wanted NFT? Worry no
                    more, SnipeNear will notify every update on an NFT or a
                    Collection in every marketplace using our blazingly fast and
                    most reliable indexer.
                  </p>
                </div>
                <br />
                <div className="flex flex-row justify-start gap-x-4">
                  <button className="bg-snipenear hover:bg-snipenear-hover transition-colors duration-100 py-4 px-10 text-snipenear-dark font-extrabold text-2xl rounded-lg">
                    Launch App
                  </button>
                  <button className="bg-transparent hover:bg-snipenear-dark-hover transition-colors duration-100 border-2 border-snipenear py-4 px-10 text-snipenear font-bold text-2xl rounded-lg">
                    Learn More
                  </button>
                </div>
              </div>
              <div>
                <img
                  src="nfts.png"
                  alt="Material Tailwind Logo"
                  className="w-64 md:w-[450px] mx-auto md:my-10"
                />
              </div>
            </div>

            {walletConnection.getAccountId() && (
              <div className="mt-12 flex flex-col justify-center gap-4 mb-36 md:flex-row">
                <>
                  {/* <a onClick={() => _mintOne()}>
                    <Button
                      color="green"
                      size="lg"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                      }}
                      className="bg-opacity-100"
                    >
                      Mint One
                    </Button>
                  </a> */}

                  <a onClick={() => _signOut()}>
                    <Button
                      color="green"
                      size="lg"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                      }}
                      className="bg-opacity-100"
                    >
                      Logout
                    </Button>
                  </a>
                </>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default App;
