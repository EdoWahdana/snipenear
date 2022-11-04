import React, { Fragment, useContext, useEffect, useState } from "react";
import Header from "components/Documentation/Header";
import AppNavbar from "pagesComponents/AppNavbar";
import UserContext from "../config/context";
import { parseImgUrl } from "../utils/common";
import { useRouter } from "next/router";

const MySnipe = () => {
  const router = useRouter();
  const { walletConnection, account, authToken } = useContext(UserContext);
  console.log(authToken);

  const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const [isToken, setIsToken] = useState(false);

  useEffect(() => {
    if (!walletConnection.isSignedIn()) {
      router.replace("/");
    }
  }, [walletConnection]);

  return (
    <>
      <Header title="SnipeNear | App" />
      <AppNavbar />

      {/* Mobile Section */}
      <section
        className="grid md:hidden header relative items-start bg-fill min-h-screen overflow-y-auto"
        style={{
          backgroundImage: `url('./landing-page-bg.png')`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container w-full mx-auto">
          <div className="mt-24 mb-2">
            <p className="text-3xl text-white font-poppins font-bold text-center">
              MY SNIPE
            </p>
          </div>
          <div className="w-full mx-auto text-center mb-10">
            <button
              className="bg-snipenear hover:bg-snipenear-hover border-2 border-snipenear-text rounded-lg text-snipenear-text p-2"
              onClick={() => setIsToken(!isToken)}
            >
              {isToken ? "See Contract Snipe" : "See Token Snipe"}
            </button>
          </div>

          <div className="grid grid-cols-1 w-full divide-x-2 divide-snipenear divide-solid px-2 md:px-10">
            {/* Contract snipe */}
            {!isToken && (
              <Fragment>
                <div className="">
                  <p className="text-xl text-white text-center font-semibold mb-2">
                    Contract Snipe
                  </p>
                  {list.map(() => (
                    <div className="bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4 mx-2 my-4">
                      <p className="text-white text-md text-center pt-2">
                        emailedowahdana@gmail.com.asldkfjasldkj
                      </p>
                      <div className="flex flex-row h-20 justify-between items-center text-white">
                        <div className="inline-flex items-center gap-x-4">
                          <img
                            src={parseImgUrl(
                              "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                            )}
                            className="w-16 h-16 rounded-full border-4 border-snipenear-dark"
                          />
                          <div className="flex flex-col justify-between items-start gap-y-2">
                            <div>
                              <p className="text-white font-bold text-md">
                                Anti Social Ape Club
                              </p>
                              <p className="text-white text-xs">asac.near</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-end">
                          <p className="text-snipenear-dark text-xs">
                            Total Snipe : 100
                          </p>
                          <button className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50">
                            Unsnipe
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Loop contract snipe */}
                </div>
              </Fragment>
            )}

            {/* Token Snipe */}
            {isToken && (
              <div className="">
                <p className="text-xl text-white text-center font-semibold mb-2">
                  Token Snipe
                </p>
                {list.map(() => (
                  <div className="bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4 mx-2 my-4">
                    <p className="text-white text-md text-center pt-2">
                      emailedowahdana@gmail.com.asldkfjasldkj
                    </p>
                    <div className="flex flex-row h-24 justify-between items-center text-white">
                      <div className="inline-flex items-center gap-x-4">
                        <img
                          src={parseImgUrl(
                            "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                          )}
                          className="w-16 h-16 rounded-full border-4 border-snipenear-dark"
                        />
                        <div className="flex flex-col justify-between items-start gap-y-2">
                          <div>
                            <p className="text-white font-bold text-md">
                              ASAC #1
                            </p>
                            <p className="text-white text-xs">asac.near</p>
                            <p className="text-white text-xs">1:1</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-end">
                        <p className="text-snipenear-dark text-xs">
                          Total Snipe : 100
                        </p>
                        <button className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50">
                          Unsnipe
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Loop token snipe */}
          </div>
        </div>
      </section>

      {/* Desktop Section */}
      <section
        className="hidden md:flex header relative items-start bg-fill min-h-screen"
        style={{
          backgroundImage: `url('./landing-page.png')`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container w-full mx-auto">
          <div className="mt-32 mb-10">
            <p className="text-3xl text-white font-poppins font-bold text-center">
              MY SNIPE
            </p>
          </div>

          <div className="grid grid-cols-2 w-full divide-x-2 divide-snipenear divide-solid px-2 md:px-10">
            {/* Contract snipe */}
            <div className="mr-2 pl-0 lg:pl-10">
              <p className="text-xl text-white text-center font-semibold mb-2">
                Contract Snipe
              </p>
              {list.map(() => (
                <div className="hidden md:flex flex-row h-20 justify-between items-center text-white bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4 my-4">
                  <div className="inline-flex items-center gap-x-4">
                    <img
                      src={parseImgUrl(
                        "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                      )}
                      className="w-16 h-16 rounded-full border-4 border-snipenear-dark"
                    />
                    <div className="flex flex-col justify-between items-start gap-y-2">
                      <div>
                        <p className="text-white font-bold text-md">
                          Anti Social Ape Club
                        </p>
                        <p className="text-white text-xs">
                          Contract Id : asac.near
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <p className="text-snipenear-dark text-xs">
                      Total Snipe : 100
                    </p>
                    <button className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50">
                      Unsnipe
                    </button>
                  </div>
                </div>
              ))}
              {/* Loop contract snipe */}
            </div>

            {/* Token Snipe */}
            <div className="pl-2 pr-0 lg:pr-10">
              <p className="text-xl text-white text-center font-semibold mb-2">
                Token Snipe
              </p>
              {list.map(() => (
                <div className="hidden md:flex flex-row h-20 justify-between items-center text-white bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4 my-4">
                  <div className="inline-flex items-center gap-x-4">
                    <img
                      src={parseImgUrl(
                        "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                      )}
                      className="w-16 h-16 rounded-full border-4 border-snipenear-dark"
                    />
                    <div className="flex flex-col justify-between items-start gap-y-2">
                      <div>
                        <p className="text-white font-bold text-md">ASAC #1</p>
                        <div className="flex flex-col">
                          <p className="text-white text-xs">
                            Contract Id : asac.near
                          </p>
                          <p className="text-white text-xs">Token Id : 1:1</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <p className="text-snipenear-dark text-xs">
                      Total Snipe : 100
                    </p>
                    <button className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50">
                      Unsnipe
                    </button>
                  </div>
                </div>
              ))}
              {/* Loop token snipe */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MySnipe;
