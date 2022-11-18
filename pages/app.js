import { providers } from "near-api-js";
import React, { Fragment, useContext, useEffect, useState } from "react";
import Header from "components/Documentation/Header";
import getConfig from "../config/near";
import AppNavbar from "pagesComponents/AppNavbar";
import UserContext from "../config/context";
import IconCheck from "../components/Icons/IconCheck";
import IconChecked from "../components/Icons/IconChecked";
import { useRouter } from "next/router";
import axios from "axios";
import { generateAuth } from "../config/utils";
import SuccessModal from "../components/Modal/SuccessModal";
import ErrorModal from "../components/Modal/ErrorModal";
import { utils } from "near-api-js";
import AutobuyModal from "../components/Modal/AutobuyModal";
import { viewMethod } from "../config/utils";
import JSBI from "jsbi";
import SuccessModalAutoBuy from "../components/Modal/SuccessModalAutoBuy";
import IconLoader from "../components/Icons/IconLoader";
import IconWarning from "../components/Icons/IconWarning";
import AOS from "aos";
import "aos/dist/aos.css";

const ModalEnum = {
  successAutoBuy: "SuccessAutoBuy",
  success: "Success",
  error: "Error",
  autobuy: "Autobuy",
};

const App = () => {
  const router = useRouter();
  const { walletSelector, walletSelectorObject, accountId } =
    useContext(UserContext);

  const [isToken, setIsToken] = useState(true);
  const [isEmail, setIsEmail] = useState(true);
  const [isPush, setIsPush] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [contractId, setContractId] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [contractResult, setContractResult] = useState({});
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [hasFetching, setHasFetching] = useState(false);
  const [email, setEmail] = useState(null);
  const [price, setPrice] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [isAutoBuy, setIsAutoBuy] = useState(false);
  const [autoBuyDeposit, setAutoBuyDeposit] = useState(null);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 300,
    });
  }, []);

  useEffect(() => {
    if (!walletSelector.isSignedIn()) {
      router.replace("/");
    }
  }, [walletSelector]);

  useEffect(() => {
    if (router.query) {
      if (router.query.contractId) {
        setContractId(router.query.contractId);
      }

      if (router.query.tokenId) {
        setIsToken(true);
        setTokenId(router.query.tokenId);
      }
    }
  }, [router.query.contractId, router.query.tokenId]);

  useEffect(() => {
    if (router.query) {
      if (router.query.transactionHashes) {
        checkTransactionHash({
          accountId: accountId,
          txHash: router.query.transactionHashes,
        });
      }
    }
  }, [router.query.transactionHashes]);

  const checkTransactionHash = async ({ accountId, txHash }) => {
    const nearConfig = getConfig(process.env.APP_ENV || "testnet");
    const txResult = await new providers.JsonRpcProvider({
      url: nearConfig.nodeUrl,
    }).txStatus(txHash, accountId);

    if (txResult.status.SuccessValue !== undefined) {
      setShowModal(ModalEnum.successAutoBuy);
    } else {
      setShowModal(ModalEnum.error);
    }
  };

  const checkNftSnipe = async () => {
    try {
      setIsFetchingMetadata(true);

      const metadataRaw = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/check-nft`,
        {
          params: {
            contractId: contractId,
            tokenId: tokenId,
          },
        }
      );

      if (metadataRaw.data.status === 0) {
        throw new Error(metadataRaw.data.message);
      }

      const mediaUrl = metadataRaw.data.data.mediaUrl;
      const contractMetadata = metadataRaw.data.data.nftMetadata;
      const nftToken = metadataRaw.data.data.nftToken;

      const contractResultData = {
        metadata: contractMetadata,
        token: nftToken,
        media: mediaUrl,
      };

      if (accountId === nftToken.owner_id) {
        setIsValid(false);
      } else {
        setIsValid(true);
      }

      window.scroll(0, 0);
      setHasFetching(true);
      setContractResult(contractResultData);
      setIsFetchingMetadata(false);
    } catch (err) {
      window.scroll(0, 0);
      const errorMessage = "NFT or Contract invalid, please try again!";
      setIsValid(false);
      setContractResult(errorMessage);
      setIsFetchingMetadata(false);
    }
  };

  const snipe = async () => {
    try {
      if (!isValid) {
        return null;
      }

      let settings = {};

      if (!price) {
        const errorMessage = "Please input Alert Price.";
        setContractResult(errorMessage);
        setIsValid(false);

        return;
      }

      if (price && parseFloat(price) < 0) {
        const errorMessage = "Alert price must be greater than zero";
        setContractResult(errorMessage);
        setIsValid(false);

        return;
      }

      const yoctoPrice = utils.format.parseNearAmount(price);

      if (isPush) {
        settings["enablePushNotification"] = true;
      }
      if (isEmail) {
        settings["emailNotification"] = email;
      }

      const formData = {
        contractId: contractId,
        price: yoctoPrice,
        settings: settings,
        isAutoBuy: isAutoBuy,
      };

      if (isToken && tokenId) {
        formData["tokenId"] = tokenId;
      }

      if (isAutoBuy && autoBuyDeposit) {
        const autoBuyDepositYocto =
          utils.format.parseNearAmount(autoBuyDeposit);

        formData["autoBuyDeposit"] = autoBuyDepositYocto;
      }

      if (isAutoBuy && autoBuyDeposit) {
        const resultSnipe = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/snipes`,
          formData,
          {
            headers: {
              authorization: await generateAuth(accountId),
            },
          }
        );

        if (resultSnipe.data && resultSnipe.data?.status === 1) {
          if (!resultSnipe.data?.data._id) {
            const errorMessage = "No ObjectId returned";
            setContractResult(errorMessage);

            throw new Error("No ObjectId returned");
          }

          const memoParams = resultSnipe.data?.data._id;

          let snipeParams = {
            contract_id: contractId,
            memo: memoParams,
          };

          if (isToken && tokenId) {
            snipeParams["token_id"] = tokenId;
          }

          const autoBuyDepositYocto =
            utils.format.parseNearAmount(autoBuyDeposit);

          const resultSnipeContract =
            await walletSelectorObject.signAndSendTransaction({
              signerId: walletSelector.store.getState().accounts[0].accountId,
              receiverId: process.env.NEXT_PUBLIC_SNIPE_CONTRACT_ID,
              actions: [
                {
                  type: "FunctionCall",
                  params: {
                    methodName: "snipe",
                    args: snipeParams,
                    gas: "100000000000000",
                    deposit: autoBuyDepositYocto,
                  },
                },
              ],
            });

          if (resultSnipeContract) {
            setShowModal(ModalEnum.success);
          } else {
            setShowModal(ModalEnum.error);
          }

          setIsValid(false);
        }
      } else {
        const resultSnipe = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/snipes`,
          formData,
          {
            headers: {
              authorization: await generateAuth(accountId),
            },
          }
        );

        if (resultSnipe.data && resultSnipe.data?.status === 1) {
          setShowModal(ModalEnum.success);
        } else {
          setShowModal(ModalEnum.error);
        }

        setIsValid(false);
      }
    } catch (err) {
      setContractResult(err);
      console.error(err);
    }
  };

  return (
    <>
      <Header title="EverSnipe | App" />
      <AppNavbar title={router.asPath} />

      {/* Mobile Section */}
      <section className="grid md:hidden header relative items-start bg-eversnipe-bg">
        <div className="grid grid-cols-1 w-full gap-x-2 mx-auto">
          <div
            className="container w-full md:w-1/3"
            style={{
              background: 'linear-gradient(180deg, rgba(74,39,75,1) 0%, rgba(20,20,32,1) 100%)',
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div data-aos="zoom-in" className="w-full px-8 md:px-4">
              <div className="mt-24">
                <p className="text-white font-bold text-2xl text-center mb-2">
                  Preview
                </p>
                <div className="flex flex-col gap-y-4 w-full md:w-96 h-[350px] bg-eversnipe-input rounded-lg overflow-y-auto overflow-hidden break-all p-4">
                  {isFetchingMetadata && (
                    <div>
                      <IconLoader size={20} colorClassName={"text-snipenear"} />
                      <p className="text-eversnipe text-md mt-4 text-center font-bold">
                        Fetching NFT metadata
                      </p>
                    </div>
                  )}
                  {typeof contractResult === "string" && (
                    <div>
                      <IconWarning
                        size={100}
                        color={"#FFF"}
                        className="mx-auto my-4"
                      />
                      <p className="text-white text-md font-bold mx-auto">
                        {contractResult}
                      </p>
                    </div>
                  )}

                  {/* Contract Result */}
                  {!isFetchingMetadata &&
                    hasFetching &&
                    !isToken &&
                    typeof contractResult === "object" &&
                    Object.keys(contractResult).length > 0 && (
                      <Fragment>
                        <p className="text-white text-md font-bold mx-auto">
                          Contract Info
                        </p>
                        <hr />
                        <img
                          src={contractResult.metadata?.icon}
                          width={100}
                          className="mx-auto border-4 border-eversnipe rounded-lg"
                        />
                        {contractResult &&
                          contractResult.token?.owner_id === accountId && (
                            <p className="text-red-200 text-sm text-center">
                              You cannot snipe your own NFT
                            </p>
                          )}
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Contract Id</p>
                          <p className="text-white text-sm">{contractId}</p>
                        </div>
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Contract Name</p>
                          <p className="text-white text-sm">
                            {contractResult.metadata?.name}
                          </p>
                        </div>
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Symbol</p>
                          <p className="text-white text-sm">
                            {contractResult.metadata?.symbol}
                          </p>
                        </div>
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">NFT Supply</p>
                          <p className="text-white text-sm">
                            {contractResult.supply}
                          </p>
                        </div>
                      </Fragment>
                    )}

                  {/* Token Result */}
                  {!isFetchingMetadata &&
                    hasFetching &&
                    isToken &&
                    typeof contractResult === "object" &&
                    !contractResult.token && (
                      <p className="text-white text-md font-bold mx-auto">
                        Token Id not found
                      </p>
                    )}

                  {!isFetchingMetadata &&
                    hasFetching &&
                    isToken &&
                    typeof contractResult === "object" &&
                    contractResult.token &&
                    Object.keys(contractResult).length > 0 && (
                      <Fragment>
                        <p className="text-white text-md font-bold mx-auto">
                          Token Info
                        </p>
                        <hr />

                        {isImageLoading ? (
                          <IconLoader
                            size={10}
                            colorClassName={"text-snipenear"}
                          />
                        ) : (
                          <img
                            src={contractResult.media}
                            width={100}
                            alt="NFT Image"
                            className="mx-auto border-4 border-eversnipe rounded-lg"
                            onLoad={() => setIsImageLoading(false)}
                          />
                        )}
                        {contractResult &&
                          contractResult.token?.owner_id === accountId && (
                            <p className="text-red-200 text-sm text-center">
                              You cannot snipe your own NFT
                            </p>
                          )}
                        <table className="table-auto mx-auto">
                          <tbody className="text-white">
                            <tr>
                              <td className="w-1/5 text-start text-xs md:text-sm py-4 align-top">
                                Token Id
                              </td>
                              <td className="py-2 px-6 text-start font-bold">
                                {contractResult.token?.token_id}
                              </td>
                            </tr>
                            <tr>
                              <td className="w-1/5 text-start text-xs md:text-sm py-4 align-top">
                                Owner Id
                              </td>
                              <td className="py-2 px-6 text-start font-bold">
                                {contractResult.token?.owner_id}
                              </td>
                            </tr>
                            <tr>
                              <td className="w-1/5 text-start text-xs md:text-sm py-4 align-top">
                                Title
                              </td>
                              <td className="py-2 px-6 text-start font-bold">
                                {contractResult.token?.metadata.title}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Fragment>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="container w-full md:w-2/3">
            <div
              data-aos="zoom-in"
              data-aos-delay="300"
              className="w-full px-8 md:px-4 text-center"
            >
              <div className="flex flex-col gap-y-2 mt-6">
                <p className=" font-poppins font-bold text-white text-md text-left md:text-xl">
                  Contract Id
                </p>
                <input
                  name="contractId"
                  className="bg-eversnipe-input w-full border-2 border-eversnipe text-white rounded-md p-2"
                  onChange={(e) => setContractId(e.target.value)}
                  defaultValue={
                    router.query && router.query.contractId
                      ? router.query.contractId
                      : null
                  }
                />
              </div>
              {/* {isToken && ( */}
              <div className="flex flex-col gap-y-2 mt-6">
                <p className="font-bold text-white text-md text-left md:text-xl">
                  Token Id
                </p>
                <input
                  name="tokenId"
                  className="bg-eversnipe-input w-full border-2 border-eversnipe text-white rounded-md p-2"
                  onChange={(e) => setTokenId(e.target.value)}
                  defaultValue={
                    router.query && router.query.tokenId
                      ? router.query.tokenId
                      : null
                  }
                />
              </div>
              {/* )} */}
              <div className="flex flex-col gap-y-2 mt-6">
                <p className="font-bold text-white text-md text-left md:text-xl">
                  Alert Price
                </p>
                <input
                  type={"number"}
                  className="bg-eversnipe-input w-full md:w-[230px] border-2 border-eversnipe text-white rounded-md p-2"
                  onChange={(e) => {
                    setAutoBuyDeposit(e.target.value);
                    setPrice(e.target.value);
                  }}
                  autoComplete={"off"}
                  style={{ WebkitAppearance: "none", margin: 0 }}
                />
              </div>
              {isEmail && (
                <div className="flex flex-col gap-y-2 mt-6">
                  <p className="font-bold text-white text-md text-left md:text-xl">
                    Your Email
                  </p>
                  <input
                    name="email"
                    type={"email"}
                    className="bg-eversnipe-input w-full md:w-[230px] border-2 border-eversnipe text-white rounded-md p-2"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
              <div className="flex flex-col gap-y-2 mt-6">
                <p className="font-bold text-white text-md text-left md:text-xl">
                  Settings
                </p>
                <div className="flex flex-col gap-y-4 w-full md:w-[230px] bg-eversnipe-input rounded-lg p-4">
                  <button className="inline-flex gap-x-2 justify-start items-center bg-eversnipe hover:bg-eversnipe-hover rounded-lg p-2">
                    <IconChecked size={25} />
                    <p className="text-eversnipe-text text-sm font-bold">
                      Email Notification
                    </p>
                  </button>
                  {isPush ? (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-eversnipe hover:bg-eversnipe-hover rounded-lg p-2"
                      onClick={() => setIsPush(!isPush)}
                    >
                      <IconChecked size={25} />
                      <p className="text-eversnipe-text text-sm font-bold">
                        Push Notification
                      </p>
                    </button>
                  ) : (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-transparent border-2 border-eversnipe hover:bg-eversnipe hover:bg-opacity-20 rounded-lg p-2"
                      onClick={() => setIsPush(!isPush)}
                    >
                      <IconCheck size={20} color={"#CCA8B4"} />
                      <p className="text-eversnipe text-sm font-bold">
                        Push Notification
                      </p>
                    </button>
                  )}

                  {isAutoBuy ? (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-eversnipe hover:bg-eversnipe-hover rounded-lg p-2"
                      onClick={() => setIsAutoBuy(!isAutoBuy)}
                    >
                      <IconChecked size={25} />
                      <p className="text-eversnipe-text text-sm font-bold">
                        Auto Buy
                      </p>
                    </button>
                  ) : (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-transparent border-2 border-eversnipe hover:bg-eversnipe hover:bg-opacity-20 rounded-lg p-2"
                      onClick={() => setIsAutoBuy(!isAutoBuy)}
                    >
                      <IconCheck size={20} color={"#CCA8B4"} />
                      <p className="text-eversnipe text-sm font-bold">
                        Auto Buy
                      </p>
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <p
                  className="text-gray-400 font-bold"
                  onClick={() => setShowModal(ModalEnum.autobuy)}
                >
                  Click here to read about Auto Buy
                </p>
              </div>

              <div className="inline-flex gap-x-4 mb-10">
                {contractId !== null && contractId !== "" ? (
                  <button
                    className="inline-flex gap-x-2 justify-center items-center bg-eversnipe hover:bg-eversnipe-hover rounded-lg py-2 mt-10"
                    onClick={checkNftSnipe}
                  >
                    <p className="text-eversnipe-text text-sm font-bold py-1 px-10">
                      Check
                    </p>
                  </button>
                ) : (
                  <button className="inline-flex gap-x-2 justify-center items-center bg-eversnipe bg-opacity-20 cursor-not-allowed rounded-lg py-2 mt-10">
                    <p className="text-eversnipe-text text-sm font-bold py-1 px-10">
                      Check
                    </p>
                  </button>
                )}

                {isValid ? (
                  <button
                    className="inline-flex gap-x-2 justify-center items-center bg-eversnipe hover:bg-eversnipe-hover rounded-lg py-2 mt-10"
                    onClick={snipe}
                  >
                    <p className="text-eversnipe-text text-sm font-bold py-1 px-10">
                      Snipe
                    </p>
                  </button>
                ) : (
                  <button className="inline-flex gap-x-2 justify-center items-center bg-eversnipe bg-opacity-20 cursor-not-allowed rounded-lg py-2 mt-10">
                    <p className="text-eversnipe-text text-sm font-bold py-1 px-10">
                      Snipe
                    </p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Section */}
      <section
        className="hidden md:flex header relative items-start bg-fill min-h-screen overflow-y-auto pb-6"
        style={{
          background: 'linear-gradient(180deg, rgba(74,39,75,1) 0%, rgba(20,20,32,1) 100%)',
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-row gap-x-2 mx-auto w-4/5">
          <div data-aos="zoom-in" className="container w-full md:w-2/3">
            <div className="w-5/12 px-8 md:px-4 text-center">
              <div className="grid grid-cols-2 gap-x-8 justify-center items-center mt-40">
                <p
                  className=" text-white text-md text-left md:text-xl"
                  style={{
                    lineHeight: 1.3,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Contract Id
                </p>
                <input
                  name="contractId"
                  className="bg-eversnipe-input w-full md:w-[230px] border-2 border-eversnipe text-white rounded-md p-2"
                  onChange={(e) => setContractId(e.target.value)}
                  defaultValue={
                    router.query && router.query.contractId
                      ? router.query.contractId
                      : null
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-x-8 justify-center items-center mt-10">
                <p
                  className=" text-white text-md text-left md:text-xl"
                  style={{
                    lineHeight: 1.3,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Token Id
                </p>
                <input
                  name="tokenId"
                  className="bg-eversnipe-input w-full md:w-[230px] border-2 border-eversnipe text-white rounded-md p-2"
                  onChange={(e) => setTokenId(e.target.value)}
                  defaultValue={
                    router.query && router.query.tokenId
                      ? router.query.tokenId
                      : null
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-x-8 justify-center items-start mt-10">
                <p
                  className=" text-white text-md text-left md:text-xl"
                  style={{
                    lineHeight: 1.3,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Alert Price
                </p>
                <input
                  name="price"
                  type={"number"}
                  className="bg-eversnipe-input w-full md:w-[230px] border-2 border-eversnipe text-white rounded-md p-2"
                  onChange={(e) => {
                    setAutoBuyDeposit(e.target.value);
                    setPrice(e.target.value);
                  }}
                  autoComplete={"off"}
                  style={{ WebkitAppearance: "none", margin: 0 }}
                />
              </div>
              {isEmail && (
                <div className="grid grid-cols-2 gap-x-8 justify-center items-start mt-10">
                  <p
                    className=" text-white text-md text-left md:text-xl"
                    style={{
                      lineHeight: 1.3,
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Your Email
                  </p>
                  <input
                    name="email"
                    type={"email"}
                    className="bg-eversnipe-input w-full md:w-[230px] border-2 border-eversnipe text-white rounded-md p-2"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-x-8 justify-center items-start mt-10">
                <p
                  className=" text-white text-md text-left md:text-xl"
                  style={{
                    lineHeight: 1.3,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Settings
                </p>
                <div className="flex flex-col gap-y-4 w-full md:w-[230px] bg-eversnipe-input rounded-lg p-4">
                  <button className="inline-flex gap-x-2 justify-start items-center bg-eversnipe hover:bg-eversnipe-hover rounded-lg p-2">
                    <IconChecked size={25} />
                    <p className="text-eversnipe-text text-sm font-bold">
                      Email Notification
                    </p>
                  </button>
                  {isPush ? (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-eversnipe hover:bg-eversnipe-hover rounded-lg p-2"
                      onClick={() => setIsPush(!isPush)}
                    >
                      <IconChecked size={25} />
                      <p className="text-eversnipe-text text-sm font-bold">
                        Push Notification
                      </p>
                    </button>
                  ) : (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-transparent border-2 border-eversnipe hover:bg-eversnipe hover:bg-opacity-20 rounded-lg p-2"
                      onClick={() => setIsPush(!isPush)}
                    >
                      <IconCheck size={20} color={"#CCA8B4"} />
                      <p className="text-eversnipe text-sm font-bold">
                        Push Notification
                      </p>
                    </button>
                  )}

                  {isAutoBuy ? (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-eversnipe hover:bg-eversnipe-hover rounded-lg p-2"
                      onClick={() => setIsAutoBuy(!isAutoBuy)}
                    >
                      <IconChecked size={25} />
                      <p className="text-eversnipe-text text-sm font-bold">
                        Auto Buy
                      </p>
                    </button>
                  ) : (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-transparent border-2 border-eversnipe hover:bg-eversnipe hover:bg-opacity-20 rounded-lg p-2"
                      onClick={() => setIsAutoBuy(!isAutoBuy)}
                    >
                      <IconCheck size={20} color={"#CCA8B4"} />
                      <p className="text-eversnipe text-sm font-bold">
                        Auto Buy
                      </p>
                    </button>
                  )}
                </div>
              </div>
              <div className="inline-flex gap-x-4">
                {contractId !== null && contractId !== "" ? (
                  <button
                    className="inline-flex gap-x-2 justify-center items-center bg-eversnipe hover:bg-eversnipe-hover rounded-lg py-2 mt-10"
                    onClick={checkNftSnipe}
                  >
                    <p className="text-eversnipe-text text-sm font-bold py-1 px-10">
                      Check
                    </p>
                  </button>
                ) : (
                  <button className="inline-flex gap-x-2 justify-center items-center bg-eversnipe bg-opacity-20 cursor-not-allowed rounded-lg py-2 mt-10">
                    <p className="text-eversnipe-text text-sm font-bold py-1 px-10">
                      Check
                    </p>
                  </button>
                )}

                {isValid ? (
                  <button
                    className="inline-flex gap-x-2 justify-center items-center bg-eversnipe hover:bg-eversnipe-hover rounded-lg py-2 mt-10"
                    onClick={snipe}
                  >
                    <p className="text-eversnipe-text text-sm font-bold py-1 px-10">
                      Snipe
                    </p>
                  </button>
                ) : (
                  <button className="inline-flex gap-x-2 justify-center items-center bg-eversnipe bg-opacity-20 cursor-not-allowed rounded-lg py-2 mt-10">
                    <p className="text-eversnipe-text text-sm font-bold py-1 px-10">
                      Snipe
                    </p>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div
            data-aos="zoom-in"
            data-aos-delay="300"
            className="container w-full md:w-1/3"
          >
            <div className="w-5/12 px-8 md:px-4">
              <div className="mt-36">
                <p className="text-white text-2xl text-left mb-2">Preview</p>
                <div className="flex flex-col scrollbar gap-y-4 w-full md:w-96 h-96 bg-eversnipe-input rounded-lg overflow-y-auto overflow-x-hidden break-all p-4">
                  {isFetchingMetadata && (
                    <div>
                      <IconLoader size={20} colorClassName={"text-snipenear"} />
                      <p className="text-eversnipe text-md mt-4 text-center font-bold">
                        Fetching NFT metadata
                      </p>
                    </div>
                  )}

                  {!isFetchingMetadata && typeof contractResult === "string" && (
                    <div>
                      <IconWarning
                        size={100}
                        color={"#FFF"}
                        className="mx-auto my-4"
                      />
                      <p className="text-white text-md font-bold text-center">
                        {contractResult}
                      </p>
                    </div>
                  )}

                  {/* Contract Result */}
                  {!isFetchingMetadata &&
                    hasFetching &&
                    !isToken &&
                    typeof contractResult === "object" &&
                    Object.keys(contractResult).length > 0 && (
                      <Fragment>
                        <p className="text-white text-md font-bold mx-auto">
                          Contract Info
                        </p>
                        <hr />
                        <img
                          src={contractResult.metadata?.icon}
                          width={100}
                          className="mx-auto border-4 border-eversnipe rounded-lg"
                        />
                        {contractResult &&
                          contractResult.token?.owner_id === accountId && (
                            <p className="text-red-200 text-sm text-center">
                              You cannot snipe your own NFT
                            </p>
                          )}
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Contract Id</p>
                          <p className="text-white text-sm">:</p>
                          <p className="text-white text-sm">{contractId}</p>
                        </div>
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Contract Name</p>
                          <p className="text-white text-sm">:</p>
                          <p className="text-white text-sm">
                            {contractResult.metadata?.name}
                          </p>
                        </div>
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Symbol</p>
                          <p className="text-white text-sm">:</p>
                          <p className="text-white text-sm">
                            {contractResult.metadata?.symbol}
                          </p>
                        </div>
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">NFT Supply</p>
                          <p className="text-white text-sm">:</p>
                          <p className="text-white text-sm">
                            {contractResult.supply}
                          </p>
                        </div>
                      </Fragment>
                    )}

                  {/* Token Result */}
                  {!isFetchingMetadata &&
                    hasFetching &&
                    isToken &&
                    typeof contractResult === "object" &&
                    !contractResult.token && (
                      <p className="text-white text-md font-bold mx-auto">
                        Token Id not found
                      </p>
                    )}

                  {!isFetchingMetadata &&
                    hasFetching &&
                    isToken &&
                    typeof contractResult === "object" &&
                    contractResult.token &&
                    Object.keys(contractResult).length > 0 && (
                      <Fragment>
                        <p className="text-white text-md font-bold mx-auto">
                          Token Info
                        </p>
                        <hr />

                        {isImageLoading ? (
                          <p>Loading...b</p>
                        ) : (
                          <img
                            src={contractResult.media}
                            width={100}
                            alt="NFT Image"
                            className="mx-auto border-4 border-eversnipe rounded-lg"
                            onLoad={() => setIsImageLoading(false)}
                          />
                        )}
                        {contractResult &&
                          contractResult.token?.owner_id === accountId && (
                            <p className="text-red-200 text-sm text-center">
                              You cannot snipe your own NFT
                            </p>
                          )}
                        <table className="table-auto mx-auto">
                          <tbody className="text-white">
                            <tr>
                              <td className="w-1/4 text-start text-sm py-4 align-top">
                                Token Id
                              </td>
                              <td className="py-2 px-2 text-start font-bold">
                                {contractResult.token?.token_id}
                              </td>
                            </tr>
                            <tr>
                              <td className="w-1/4 text-start text-sm py-4 align-top">
                                Owner Id
                              </td>
                              <td className="py-2 px-2 text-start font-bold">
                                {contractResult.token?.owner_id}
                              </td>
                            </tr>
                            <tr>
                              <td className="w-1/4 text-start text-sm py-4 align-top">
                                Title
                              </td>
                              <td className="py-2 px-2 text-start font-bold">
                                {contractResult.token?.metadata.title}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </Fragment>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal === ModalEnum.successAutoBuy && (
        <SuccessModalAutoBuy
          onClose={() => {
            setShowModal(null);
            router.replace("/my-snipe");
          }}
          onSnipeMore={() => setShowModal(null)}
        />
      )}

      {showModal === ModalEnum.success && (
        <SuccessModal
          isShow={showModal === ModalEnum.success}
          onClose={() => {
            setShowModal(null);
            router.replace("/my-snipe");
          }}
          onSnipeMore={() => {
            setShowModal(null);
          }}
        />
      )}

      {showModal === ModalEnum.error && (
        <ErrorModal onClose={() => setShowModal(null)} />
      )}

      {showModal === ModalEnum.autobuy && (
        <AutobuyModal onClose={() => setShowModal(null)} onSubmit={snipe} />
      )}
    </>
  );
};

export default App;
