import React, { useContext, useEffect, useState } from "react";
import Header from "components/Documentation/Header";
import IndexNavbar from "pagesComponents/IndexNavbar";
import IndexFooter from "pagesComponents/IndexFooter";
import UserContext from "../config/context";
import { parseImgUrl } from "../utils/common";
import Link from "next/link";
import LearnMoreModal from "../components/Modal/LearnMoreModal";
import { useRouter } from "next/router";
import AOS from 'aos';
import 'aos/dist/aos.css';

const RecommendedTokens = [
  {
    contract_id: "baby.minimous34.testnet",
    token_id: "37:1",
    title: "Baby Munky #0024 #1",
    media:
      "https://ipfs.io/ipfs/bafkreiaxmuvsvtwa36iklbcb323dix3wmykktdndp7sxqysdsdj4whyi74",
  },
  {
    contract_id: "nft-frontend-simple-mint.blockhead.testnet",
    token_id: "pandadev.testnet-my-token-1667590458671",
    title: "First NFT",
    media:
      "https://gateway.pinata.cloud/ipfs/QmZBu8PLzLgmaV9RWFjPPihkHTdapSmkAVSEYcDEDFdfcq",
  },
  {
    contract_id: "paras-token-v1.testnet",
    token_id: "1116:1",
    title: "Test #1",
    media:
      "https://ipfs.fleek.co/ipfs/bafybeiaquqjvebxsnjj6viz5dxudauvnmupujq7sjbvkbqev6t656wq72u",
  },
  {
    contract_id: "gorillashops2.mintspace2.testnet",
    token_id: "312",
    title: "Gorilla Shop",
    media: "https://arweave.net/Cvzyg8eq_OvYCk8WfAzzas2EwPIYns4AA1JW4NG8TDc",
  },
  {
    contract_id: "super.minimous34.testnet",
    token_id: "2:1",
    title: "Super Munky #0001 #1",
    media:
      "https://ipfs.fleek.co/ipfs/bafkreiammqx274xedukmxuprlctc7vfmwmlkaitcscpsneistgfvkytke4",
  },
  {
    contract_id: "nft-v1.internal.fayyr.testnet",
    token_id: "token-fef6b853-5a0a-45bd-b1ea-ecd6947618cb_5",
    title: "Lion!",
    media:
      "https://cloudflare-ipfs.com/ipfs/QmcWXfEuQuxQ1Do5v8cBVMSC3faHEdMmuQreHtmnjBo7uG",
  },
  {
    contract_id: "nft.endlesss.testnet",
    token_id: "f44bc3c0255411ed83c0ffa350072944",
    title: "Test #1",
    media:
      "https://endlesss-dev.fra1.cdn.digitaloceanspaces.com/attachments/avatars/band30560fca25",
  },
  {
    contract_id: "paras-token-v1.testnet",
    token_id: "1090:1",
    title: "bot #1",
    media:
      "https://ipfs.fleek.co/ipfs/bafkreicqw7dbon4pcmksfiwvvkq6nryvd3swzkp7gaspius45x7cds5kze",
  },
];

const ModalEnum = {
  LearnMore: "LearnMore",
};

const Home = () => {
  const router = useRouter();
  const { walletSelector, walletSelectorObject, accountId, signInModal } =
    useContext(UserContext);

  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 300
    })
  }, [])

  const _signIn = async () => {
    signInModal.show();
  };

  return (
    <>
      <Header title="EverSnipe" />
      <IndexNavbar />

      <section
        className="header relative items-center flex bg-fill"
        style={{
          backgroundImage: `url('./landing-page-min.png')`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container max-w-7xl mx-auto">
          <div className="w-full px-8 md:px-4 text-center">
            <div data-aos="zoom-in" className="flex flex-col md:flex-row relative mt-16 md:mt-32">
              <div className="md:w-6/12 mr-auto mt-10">
                <div className="block md:hidden mb-4 md:mb-0">
                  <img
                    src="nfts.png"
                    alt="Material Tailwind Logo"
                    className="w-72 md:w-[450px] mx-auto md:my-10"
                  />
                </div>
                <div className="w-[90%]">
                  <p
                    className="tracking-wide text-white text-3xl font-bold text-left md:text-5xl font-poppins"
                    style={{ lineHeight: 1.3 }}
                  >
                    The most reliable tool to snipe your favorite NFT &
                    Collection
                  </p>
                </div>
                <br />
                <div className="w-5/6">
                  <p
                    className=" text-white text-lg text-left md:text-xl"
                    style={{
                      lineHeight: 1.3,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Have you ever missed getting your most wanted NFT? Worry no
                    more, EverSnipe will notify every update on an NFT or a
                    Collection in every marketplace using our blazingly fast and
                    most reliable indexer.
                  </p>
                </div>
                <br />
                <div className="flex flex-row justify-start gap-x-4">
                  {walletSelector.isSignedIn() ? (
                    <Link href="/app" replace={true}>
                      <button className="bg-eversnipe hover:bg-eversnipe-hover transition-colors duration-100 p-2 md:py-4 md:px-10 text-eversnipe-dark font-extrabold text-2xl rounded-lg">
                        Launch App
                      </button>
                    </Link>
                  ) : (
                    <button
                      className="bg-eversnipe hover:bg-eversnipe-hover transition-colors duration-100 p-4 md:py-4 md:px-10 text-eversnipe-dark font-extrabold text-2xl rounded-lg"
                      onClick={_signIn}
                    >
                      Sign In
                    </button>
                  )}
                  <button
                    className="bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-4 md:py-4 md:px-10 text-eversnipe font-bold text-2xl rounded-lg"
                    onClick={() => {
                      setShowModal(ModalEnum.LearnMore);
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <a href="#recommendation">
                  <img
                    src="nfts-new.png"
                    alt="Material Tailwind Logo"
                    className="w-64 md:w-[450px] mx-auto md:my-10"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="recommendation" className="overflow-hidden bg-[url('/landing-page-2.png')] bg-no-repeat bg-cover py-10 md:py-20">
        <div className="flex flex-wrap items-center">
          <div className="w-full md:w-9/12 px-8 md:px-4 ml-auto mr-auto mt-10">
            <div className="w-80 md:w-full mb-10 mx-auto">
              <p className="text-5xl text-white font-poppins font-bold text-center">
                Recommended NFTs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {RecommendedTokens.map((token, index) => (
                <div
                  data-aos='zoom-in'
                  key={index}
                  className="text-white cursor-pointer bg-eversnipe transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg text-center p-4 overflow-ellipsis"
                  onClick={() => {
                    walletSelector.isSignedIn()
                      ? router.push({
                          pathname: "/app",
                          query: {
                            contractId: token.contract_id,
                            tokenId: token.token_id,
                          },
                        })
                      : _signIn();
                  }}
                >
                  <img
                    src={parseImgUrl(token.media)}
                    className="w-20 border-2 border-eversnipe-text mx-auto mb-2"
                  />
                  <p className="font-bold">{token.title}</p>
                  <div className="flex flex-row gap-x-2 justify-between items-center mt-4 border-t-2 border-white border-opacity-40 p-2">
                    <div className="w-1/2 h-14 overflow-hidden">
                      <p className="text-xs mb-2">Token Id</p>
                      <p className="text-sm font-bold truncate">
                        {token.token_id}
                      </p>
                    </div>
                    <div className="w-1/2 h-14 overflow-hidden">
                      <p className="text-xs mb-2">Contract Id</p>
                      <p className="text-sm font-bold truncate">
                        {token.contract_id}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <IndexFooter />

      <LearnMoreModal
        isShow={showModal === ModalEnum.LearnMore}
        onClose={() => setShowModal(null)}
      />
    </>
  );
};

export default Home;
