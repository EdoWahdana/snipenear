import React, { Fragment, useContext, useEffect, useState } from "react";
import Header from "components/Documentation/Header";
import AppNavbar from "pagesComponents/AppNavbar";
import UserContext from "../config/context";
import { parseImgUrl } from "../utils/common";

const MySnipe = () => {
  const { account } = useContext(UserContext);
  const [isValid, setIsValid] = useState(false);
  const [contractId, setContractId] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [contractResult, setContractResult] = useState({});
  const [isImageLoading, setIsImageLoading] = useState(false);

  const snipe = async () => {
    if (!isValid) {
      return null;
    }

    console.log(contractId, tokenId);
  };

  return (
    <>
      <Header title="SnipeNear | App" />
      <AppNavbar />

      <section
        className="header relative items-start flex bg-fill h-[721px]"
        style={{
          backgroundImage: `url('./landing-page.png')`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
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
            <div className="mr-2">
              <p className="text-xl text-white text-center font-semibold mb-2">
                Contract Snipe
              </p>
              <div className="flex flex-row h-20 justify-between items-center text-white bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4">
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
              {/* Loop contract snipe */}
            </div>

            {/* Token Snipe */}
            <div className="pl-2">
              <p className="text-xl text-white text-center font-semibold mb-2">
                Token Snipe
              </p>
              <div className="flex flex-row h-20 justify-between items-center text-white bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4">
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

              {/* Loop token snipe */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MySnipe;
