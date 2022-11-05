import React, { useContext, useEffect, useState } from "react";
import Header from "components/Documentation/Header";
import IndexNavbar from "pagesComponents/IndexNavbar";
import IndexFooter from "pagesComponents/IndexFooter";
import UserContext from "../config/context";
import { parseImgUrl } from "../utils/common";
import Link from "next/link";
import { generateAuth } from "../config/utils";
import axios from "axios";
import { useRouter } from "next/router";

const Presentation = () => {
  const router = useRouter();
  const { walletConnection, contract, near } = useContext(UserContext);

  const _signIn = async () => {
    await walletConnection.requestSignIn(contract, "SnipeNear", "/");
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (
        router.query.account_id &&
        router.query.public_key &&
        router.query.all_keys
      ) {
        setup();
      }
    }
  }, [router, walletConnection]);

  const setup = async () => {
    if (!walletConnection.isSignedIn()) {
      return;
    }

    try {
      const register = await navigator.serviceWorker
        .register("./_worker.js", {
          scope: "/",
        })
        .catch((err) => {
          return console.log("Error : ", err);
        });

      await navigator.serviceWorker.ready;

      //register push
      console.log("Registering push...");

      const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BMCbH8jWoT-mPUAODqUzCrern-rO1PrhywprUvz21mhSlFBdbvvpyCpRiTBIRaXvBOhsoAIJ3E9XDjt0c0EPL44"
        ),
      });

      await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_API}/subscribe-web-push-notification`,
        headers: {
          authorization: await generateAuth(
            walletConnection.getAccountId(),
            walletConnection
          ),
        },
        data: subscription,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
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
            <div className="flex flex-col md:flex-row relative mt-16 md:mt-32">
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
                    more, SnipeNear will notify every update on an NFT or a
                    Collection in every marketplace using our blazingly fast and
                    most reliable indexer.
                  </p>
                </div>
                <br />
                <div className="flex flex-row justify-start gap-x-4">
                  {walletConnection.isSignedIn() ? (
                    <Link href="/app" replace={true}>
                      <button className="bg-snipenear hover:bg-snipenear-hover transition-colors duration-100 p-2 md:py-4 md:px-10 text-snipenear-dark font-extrabold text-2xl rounded-lg">
                        Launch App
                      </button>
                    </Link>
                  ) : (
                    <button
                      className="bg-snipenear hover:bg-snipenear-hover transition-colors duration-100 p-4 md:py-4 md:px-10 text-snipenear-dark font-extrabold text-2xl rounded-lg"
                      onClick={_signIn}
                    >
                      Sign In
                    </button>
                  )}
                  <button className="bg-transparent hover:bg-snipenear-dark-hover transition-colors duration-100 border-2 border-snipenear p-4 md:py-4 md:px-10 text-snipenear font-bold text-2xl rounded-lg">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="nfts.png"
                  alt="Material Tailwind Logo"
                  className="w-64 md:w-[450px] mx-auto md:my-10"
                />
              </div>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg text-center p-4">
                <img
                  src={parseImgUrl(
                    "bafkreihbekral363uaxi7whursbexozrkz72jggl6rymxeg5jh2u6mr4om"
                  )}
                  className="w-20 rounded-full border-4 border-snipenear-dark mx-auto mb-2"
                />
                <p className="font-bold">Anti Social Ape Club</p>
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
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg text-center p-4">
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
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg text-center p-4">
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
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg text-center p-4">
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
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg text-center p-4">
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
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg text-center p-4">
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
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg text-center p-4">
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
              <div className="text-white cursor-pointer bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg text-center p-4">
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
};;;;

export default Presentation;
