import React, { useContext, useEffect, useState } from "react";
import Header from "components/Documentation/Header";
import IndexNavbar from "pagesComponents/IndexNavbar";
import IndexFooter from "pagesComponents/IndexFooter";
import Button from "components/Button/Button";
import UserContext from "../config/context";
import { parseImgUrl } from "../utils/common";

const Presentation = () => {
  const { walletConnection, contract, near } = useContext(UserContext);
  const [nft, setNft] = useState([]);

  useEffect(() => {
    if (walletConnection.getAccountId()) {
      _tokenListOwner();
    }
  }, [walletConnection.getAccountId()]);

  const _signIn = async () => {
    await walletConnection.requestSignIn(contract, "NEARGotchi");
  };

  const _signOut = async () => {
    await walletConnection.signOut();
    location.reload();
  };

  const _tokenListOwner = async () => {
    const tokens = await contract.nft_tokens_for_owner({
      account_id: await walletConnection.getAccountId(),
    });
    setNft(tokens);
  };

  return (
    <>
      <Header title="SnipeNear" />
      <IndexNavbar />

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

      <section className="overflow-hidden bg-[url('/landing-page-2.png')] bg-no-repeat bg-cover py-10 md:py-20">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-9/12 px-8 md:px-4 ml-auto mr-auto mt-10">
            <div className="w-80 md:w-full mb-10 mx-auto">
              <p className="text-5xl text-white font-poppins font-bold text-center">
                Hot Collections
              </p>
            </div>
            <div className="grid grid-cols-4 gap-6">
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-80 rounded-lg text-center p-4">
                <img
                  src={parseImgUrl(
                    "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                  )}
                  className="w-20 rounded-full border-4 border-snipenear-dark mx-auto mb-2"
                />
                <p>Anti Social Ape Club</p>
                <div className="flex flex-row gap-x-2 justify-between items-center mt-4 border-t-2 border-white border-opacity-40 p-4">
                  <div>
                    <p>Total NFT</p>
                    <p>3000</p>
                  </div>
                  <div>
                    <p>Total Volume</p>
                    <p>10000 N</p>
                  </div>
                </div>
              </div>
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-80 rounded-lg text-center p-4">
                <img
                  src={parseImgUrl(
                    "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                  )}
                  className="w-20 rounded-full border-4 border-snipenear-dark mx-auto mb-2"
                />
                <p>Anti Social Ape Club</p>
                <div className="flex flex-row gap-x-2 justify-between items-center mt-4 border-t-2 border-white border-opacity-40 p-4">
                  <div>
                    <p>Total NFT</p>
                    <p>3000</p>
                  </div>
                  <div>
                    <p>Total Volume</p>
                    <p>10000 N</p>
                  </div>
                </div>
              </div>
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-80 rounded-lg text-center p-4">
                <img
                  src={parseImgUrl(
                    "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                  )}
                  className="w-20 rounded-full border-4 border-snipenear-dark mx-auto mb-2"
                />
                <p>Anti Social Ape Club</p>
                <div className="flex flex-row gap-x-2 justify-between items-center mt-4 border-t-2 border-white border-opacity-40 p-4">
                  <div>
                    <p>Total NFT</p>
                    <p>3000</p>
                  </div>
                  <div>
                    <p>Total Volume</p>
                    <p>10000 N</p>
                  </div>
                </div>
              </div>
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-80 rounded-lg text-center p-4">
                <img
                  src={parseImgUrl(
                    "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                  )}
                  className="w-20 rounded-full border-4 border-snipenear-dark mx-auto mb-2"
                />
                <p>Anti Social Ape Club</p>
                <div className="flex flex-row gap-x-2 justify-between items-center mt-4 border-t-2 border-white border-opacity-40 p-4">
                  <div>
                    <p>Total NFT</p>
                    <p>3000</p>
                  </div>
                  <div>
                    <p>Total Volume</p>
                    <p>10000 N</p>
                  </div>
                </div>
              </div>
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-80 rounded-lg text-center p-4">
                <img
                  src={parseImgUrl(
                    "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                  )}
                  className="w-20 rounded-full border-4 border-snipenear-dark mx-auto mb-2"
                />
                <p>Anti Social Ape Club</p>
                <div className="flex flex-row gap-x-2 justify-between items-center mt-4 border-t-2 border-white border-opacity-40 p-4">
                  <div>
                    <p>Total NFT</p>
                    <p>3000</p>
                  </div>
                  <div>
                    <p>Total Volume</p>
                    <p>10000 N</p>
                  </div>
                </div>
              </div>
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-80 rounded-lg text-center p-4">
                <img
                  src={parseImgUrl(
                    "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                  )}
                  className="w-20 rounded-full border-4 border-snipenear-dark mx-auto mb-2"
                />
                <p>Anti Social Ape Club</p>
                <div className="flex flex-row gap-x-2 justify-between items-center mt-4 border-t-2 border-white border-opacity-40 p-4">
                  <div>
                    <p>Total NFT</p>
                    <p>3000</p>
                  </div>
                  <div>
                    <p>Total Volume</p>
                    <p>10000 N</p>
                  </div>
                </div>
              </div>
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-80 rounded-lg text-center p-4">
                <img
                  src={parseImgUrl(
                    "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                  )}
                  className="w-20 rounded-full border-4 border-snipenear-dark mx-auto mb-2"
                />
                <p>Anti Social Ape Club</p>
                <div className="flex flex-row gap-x-2 justify-between items-center mt-4 border-t-2 border-white border-opacity-40 p-4">
                  <div>
                    <p>Total NFT</p>
                    <p>30000</p>
                  </div>
                  <div>
                    <p>Total Volume</p>
                    <p>1000000 N</p>
                  </div>
                </div>
              </div>
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-80 rounded-lg text-center p-4">
                <img
                  src={parseImgUrl(
                    "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                  )}
                  className="w-20 rounded-full border-4 border-snipenear-dark mx-auto mb-2"
                />
                <p>Anti Social Ape Club</p>
                <div className="flex flex-row gap-x-2 justify-between items-center mt-4 border-t-2 border-white border-opacity-40 p-4">
                  <div>
                    <p>Total NFT</p>
                    <p>10000</p>
                  </div>
                  <div>
                    <p>Total Volume</p>
                    <p>1000000 N</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IndexFooter />
    </>
  );
};

export default Presentation;
