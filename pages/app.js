import React, { Fragment, useContext, useEffect, useState } from "react";
import Header from "components/Documentation/Header";
import AppNavbar from "pagesComponents/AppNavbar";
import UserContext from "../config/context";
import IconCheck from "../components/Icons/IconCheck";
import IconChecked from "../components/Icons/IconChecked";
import { useRouter } from "next/router";
import axios from "axios";
import { generateAuth } from "../config/utils";
import SuccessModal from "../components/Modal/SuccessModal";
import { utils } from "near-api-js";

const ModalEnum = {
  success: "Success",
  error: "Error",
};

const App = () => {
  const router = useRouter();
  const { walletConnection, account, authToken } = useContext(UserContext);

  const [isToken, setIsToken] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPush, setIsPush] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [contractId, setContractId] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [contractResult, setContractResult] = useState({});
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [hasFetching, setHasFetching] = useState(false);
  const [email, setEmail] = useState(null);
  const [price, setPrice] = useState(null);
  const [showModal, setShowModal] = useState(ModalEnum.success);

  useEffect(() => {
    if (!walletConnection.isSignedIn()) {
      router.replace("/");
    }
  }, [walletConnection]);

  const checkContract = async () => {
    try {
      const resMetadata = await account.viewFunction(
        contractId,
        "nft_metadata",
        {}
      );
      const resNftSupply = await account.viewFunction(
        contractId,
        "nft_total_supply",
        {}
      );

      const resObject = {
        metadata: resMetadata,
        supply: resNftSupply,
      };

      setIsValid(true);
      setHasFetching(true);
      setContractResult(resObject);
    } catch (err) {
      setIsValid(false);
      setContractResult(err.toString());
    }
  };

  const checkTokenContract = async () => {
    try {
      const resMetadata = await account.viewFunction(
        contractId,
        "nft_metadata",
        {}
      );
      const resToken = await account.viewFunction(contractId, "nft_token", {
        token_id: tokenId,
      });

      const resObject = {
        metadata: resMetadata,
        token: resToken,
      };

      setIsValid(true);
      setHasFetching(true);
      setContractResult(resObject);
    } catch (err) {
      setIsValid(false);
      setContractResult(err.toString());
    }
  };

  const snipe = async () => {
    if (!isValid) {
      return null;
    }

    const metadata = isToken
      ? {
          title: contractResult.token?.metadata?.title,
          media: `${contractResult.metadata?.base_uri}/${contractResult.token?.metadata?.media}`,
        }
      : {
          title: contractResult.metadata?.name,
          media: contractResult.metadata?.icon,
        };

    const yoctoPrice = utils.format.parseNearAmount(price);
    const settings = isEmail
      ? {
          emailNotification: email,
          enableNotificationo: true,
        }
      : {
          enableNotificationo: true,
        };

    const formData = {
      contractId: contractId,
      price: yoctoPrice,
      settings: settings,
      metadata: metadata,
    };

    if (isToken && tokenId) {
      formData["tokenId"] = tokenId;
    }

    const resultSnipe = await axios.post(
      `${process.env.NEXT_PUBLIC_API}/snipes`,
      formData,
      {
        headers: {
          authorization: await generateAuth(
            walletConnection.getAccountId(),
            walletConnection
          ),
        },
      }
    );

    if (resultSnipe.data && resultSnipe.data?.status === 1) {
      setShowModal(ModalEnum.success);
    } else {
      setShowModal(ModalEnum.error);
    }

    setTokenId(null);
    setContractId(null);
    setIsValid(false);
  };

  return (
    <>
      <Header title="SnipeNear | App" />
      <AppNavbar />

      {/* Mobile Section */}
      <section className="grid md:hidden header relative items-start bg-snipenear-bg">
        <div className="grid grid-cols-1 gap-x-2 mx-auto">
          <div
            className="container w-full md:w-1/3"
            style={{
              backgroundImage: `url('./landing-page.png')`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="w-full px-8 md:px-4">
              <div className="mt-24">
                <p className="text-white font-bold text-2xl text-center mb-2">
                  Preview
                </p>
                <div className="flex flex-col gap-y-4 w-full md:w-96 h-[350px] bg-snipenear-input rounded-lg overflow-y-auto p-4">
                  {typeof contractResult === "string" && (
                    <p className="text-white text-md font-bold mx-auto">
                      {contractResult}
                    </p>
                  )}

                  {/* Contract Result */}
                  {hasFetching &&
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
                          className="mx-auto border-4 border-snipenear rounded-lg"
                        />
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
                  {hasFetching &&
                    isToken &&
                    typeof contractResult === "object" &&
                    !contractResult.token && (
                      <p className="text-white text-md font-bold mx-auto">
                        Token Id not found
                      </p>
                    )}

                  {hasFetching &&
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
                          <p>Loading...</p>
                        ) : (
                          <img
                            src={`${contractResult.metadata?.base_uri}/${contractResult.token?.metadata?.media}`}
                            width={100}
                            alt="NFT Image"
                            className="mx-auto border-4 border-snipenear rounded-lg"
                            onLoad={() => setIsImageLoading(false)}
                          />
                        )}
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Token Id</p>
                          <p className="text-white text-sm">:</p>
                          <p className="text-white text-sm">
                            {contractResult.token?.token_id}
                          </p>
                        </div>
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Owner Id</p>
                          <p className="text-white text-sm">:</p>
                          <p className="text-white text-sm">
                            {contractResult.token?.owner_id}
                          </p>
                        </div>
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Title</p>
                          <p className="text-white text-sm">:</p>
                          <p className="text-white text-sm">
                            {contractResult.token?.metadata?.title}
                          </p>
                        </div>
                      </Fragment>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="container w-full md:w-2/3">
            <div className="w-full px-8 md:px-4 text-center">
              <div className="flex flex-col gap-y-2 mt-10">
                <p className=" font-poppins font-bold text-white text-md text-left md:text-xl">
                  Contract Id
                </p>
                <div className="inline-flex">
                  <input
                    name="contractId"
                    className="bg-snipenear-input border-2 border-snipenear text-white rounded-md p-1 pr-10 mr-4"
                    onChange={(e) => setContractId(e.target.value)}
                  />
                  <button
                    className="inline-flex gap-x-2 justify-center items-center bg-snipenear hover:bg-snipenear-hover rounded-lg p-2"
                    onClick={() => {
                      setIsToken(!isToken);
                      setTokenId(null);
                      setHasFetching(false);
                      setIsValid(false);
                    }}
                  >
                    {isToken ? (
                      <IconChecked size={25} />
                    ) : (
                      <IconCheck size={25} color={"#5C4A50"} />
                    )}
                    <p className="text-snipenear-text text-sm font-bold">
                      Snipe Token?
                    </p>
                  </button>
                </div>
              </div>
              {isToken && (
                <div className="flex flex-col gap-y-2 mt-6">
                  <p className="font-bold text-white text-md text-left md:text-xl">
                    Token Id
                  </p>
                  <input
                    name="tokenId"
                    className="bg-snipenear-input w-full border-2 border-snipenear text-white rounded-md p-2"
                    onChange={(e) => setTokenId(e.target.value)}
                  />
                </div>
              )}
              <div className="flex flex-col gap-y-2 mt-6">
                <p className="font-bold text-white text-md text-left md:text-xl">
                  Alert Price
                </p>
                <input
                  name="price"
                  type={"number"}
                  className="bg-snipenear-input w-full md:w-[230px] border-2 border-snipenear text-white rounded-md p-2"
                  onChange={(e) => setPrice(e.target.value)}
                  autoComplete={"off"}
                  style={{ WebkitAppearance: "none", margin: 0 }}
                />
              </div>
              <div className="flex flex-col gap-y-2 mt-6">
                <p className="font-bold text-white text-md text-left md:text-xl">
                  Notification
                </p>
                <div className="flex flex-col gap-y-4 w-full md:w-[230px] bg-snipenear-input rounded-lg p-4">
                  {isEmail ? (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-snipenear hover:bg-snipenear-hover rounded-lg p-2"
                      onClick={() => setIsEmail(!isEmail)}
                    >
                      <IconChecked size={25} />
                      <p className="text-snipenear-text text-sm font-bold">
                        Email
                      </p>
                    </button>
                  ) : (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-transparent border-2 border-snipenear hover:bg-snipenear hover:bg-opacity-20 rounded-lg p-2"
                      onClick={() => setIsEmail(!isEmail)}
                    >
                      <IconCheck size={20} color={"#CCA8B4"} />
                      <p className="text-snipenear text-sm font-bold">Email</p>
                    </button>
                  )}

                  {isPush ? (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-snipenear hover:bg-snipenear-hover rounded-lg p-2"
                      onClick={() => setIsPush(!isPush)}
                    >
                      <IconChecked size={25} />
                      <p className="text-snipenear-text text-sm font-bold">
                        Push Notification
                      </p>
                    </button>
                  ) : (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-transparent border-2 border-snipenear hover:bg-snipenear hover:bg-opacity-20 rounded-lg p-2"
                      onClick={() => setIsPush(!isPush)}
                    >
                      <IconCheck size={20} color={"#CCA8B4"} />
                      <p className="text-snipenear text-sm font-bold">
                        Push Notification
                      </p>
                    </button>
                  )}
                </div>
              </div>
              {isEmail && (
                <div className="flex flex-col gap-y-2 mt-6">
                  <p className="font-bold text-white text-md text-left md:text-xl">
                    Your Email
                  </p>
                  <input
                    name="email"
                    type={"email"}
                    className="bg-snipenear-input w-full md:w-[230px] border-2 border-snipenear text-white rounded-md p-2"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
              <div className="inline-flex gap-x-4 mb-10">
                {contractId !== null && contractId !== "" ? (
                  <button
                    className="inline-flex gap-x-2 justify-center items-center bg-snipenear hover:bg-snipenear-hover rounded-lg py-2 mt-10"
                    onClick={
                      isToken && tokenId !== ""
                        ? checkTokenContract
                        : checkContract
                    }
                  >
                    <p className="text-snipenear-text text-sm font-bold py-1 px-10">
                      Check
                    </p>
                  </button>
                ) : (
                  <button className="inline-flex gap-x-2 justify-center items-center bg-snipenear bg-opacity-20 cursor-not-allowed rounded-lg py-2 mt-10">
                    <p className="text-snipenear-text text-sm font-bold py-1 px-10">
                      Check
                    </p>
                  </button>
                )}

                {isValid ? (
                  <button
                    className="inline-flex gap-x-2 justify-center items-center bg-snipenear hover:bg-snipenear-hover rounded-lg py-2 mt-10"
                    onClick={snipe}
                  >
                    <p className="text-snipenear-text text-sm font-bold py-1 px-10">
                      Snipe
                    </p>
                  </button>
                ) : (
                  <button className="inline-flex gap-x-2 justify-center items-center bg-snipenear bg-opacity-20 cursor-not-allowed rounded-lg py-2 mt-10">
                    <p className="text-snipenear-text text-sm font-bold py-1 px-10">
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
          backgroundImage: `url('./landing-page.png')`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {showModal === ModalEnum.success && (
          <SuccessModal onClose={() => setShowModal(null)} />
        )}

        {showModal === ModalEnum.error && (
          <SuccessModal onClose={() => setShowModal(null)} />
        )}

        <div className="flex flex-row gap-x-2 mx-auto">
          <div className="container w-full md:w-2/3">
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
                <div className="inline-flex">
                  <input
                    name="contractId"
                    className="bg-snipenear-input border-2 border-snipenear text-white rounded-md p-1 pr-10 mr-4"
                    onChange={(e) => setContractId(e.target.value)}
                  />
                  <button
                    className="inline-flex gap-x-2 justify-center items-center bg-snipenear hover:bg-snipenear-hover rounded-lg p-2"
                    onClick={() => {
                      setIsToken(!isToken);
                      setTokenId(null);
                      setHasFetching(false);
                      setIsValid(false);
                    }}
                  >
                    {isToken ? (
                      <IconChecked size={25} />
                    ) : (
                      <IconCheck size={25} color={"#5C4A50"} />
                    )}
                    <p className="text-snipenear-text text-sm font-bold">
                      Snipe Token?
                    </p>
                  </button>
                </div>
              </div>
              {isToken && (
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
                    className="bg-snipenear-input w-full md:w-[230px] border-2 border-snipenear text-white rounded-md p-2"
                    onChange={(e) => setTokenId(e.target.value)}
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
                  Alert Price
                </p>
                <input
                  name="price"
                  type={"number"}
                  className="bg-snipenear-input w-full md:w-[230px] border-2 border-snipenear text-white rounded-md p-2"
                  onChange={(e) => setPrice(e.target.value)}
                  autoComplete={"off"}
                  style={{ WebkitAppearance: "none", margin: 0 }}
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
                  Notification
                </p>
                <div className="flex flex-col gap-y-4 w-full md:w-[230px] bg-snipenear-input rounded-lg p-4">
                  {isEmail ? (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-snipenear hover:bg-snipenear-hover rounded-lg p-2"
                      onClick={() => setIsEmail(!isEmail)}
                    >
                      <IconChecked size={25} />
                      <p className="text-snipenear-text text-sm font-bold">
                        Email
                      </p>
                    </button>
                  ) : (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-transparent border-2 border-snipenear hover:bg-snipenear hover:bg-opacity-20 rounded-lg p-2"
                      onClick={() => setIsEmail(!isEmail)}
                    >
                      <IconCheck size={20} color={"#CCA8B4"} />
                      <p className="text-snipenear text-sm font-bold">Email</p>
                    </button>
                  )}

                  {isPush ? (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-snipenear hover:bg-snipenear-hover rounded-lg p-2"
                      onClick={() => setIsPush(!isPush)}
                    >
                      <IconChecked size={25} />
                      <p className="text-snipenear-text text-sm font-bold">
                        Push Notification
                      </p>
                    </button>
                  ) : (
                    <button
                      className="inline-flex gap-x-2 justify-start items-center bg-transparent border-2 border-snipenear hover:bg-snipenear hover:bg-opacity-20 rounded-lg p-2"
                      onClick={() => setIsPush(!isPush)}
                    >
                      <IconCheck size={20} color={"#CCA8B4"} />
                      <p className="text-snipenear text-sm font-bold">
                        Push Notification
                      </p>
                    </button>
                  )}
                </div>
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
                    className="bg-snipenear-input w-full md:w-[230px] border-2 border-snipenear text-white rounded-md p-2"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
              <div className="inline-flex gap-x-4">
                {contractId !== null && contractId !== "" ? (
                  <button
                    className="inline-flex gap-x-2 justify-center items-center bg-snipenear hover:bg-snipenear-hover rounded-lg py-2 mt-10"
                    onClick={
                      isToken && tokenId !== ""
                        ? checkTokenContract
                        : checkContract
                    }
                  >
                    <p className="text-snipenear-text text-sm font-bold py-1 px-10">
                      Check
                    </p>
                  </button>
                ) : (
                  <button className="inline-flex gap-x-2 justify-center items-center bg-snipenear bg-opacity-20 cursor-not-allowed rounded-lg py-2 mt-10">
                    <p className="text-snipenear-text text-sm font-bold py-1 px-10">
                      Check
                    </p>
                  </button>
                )}

                {isValid ? (
                  <button
                    className="inline-flex gap-x-2 justify-center items-center bg-snipenear hover:bg-snipenear-hover rounded-lg py-2 mt-10"
                    onClick={snipe}
                  >
                    <p className="text-snipenear-text text-sm font-bold py-1 px-10">
                      Snipe
                    </p>
                  </button>
                ) : (
                  <button className="inline-flex gap-x-2 justify-center items-center bg-snipenear bg-opacity-20 cursor-not-allowed rounded-lg py-2 mt-10">
                    <p className="text-snipenear-text text-sm font-bold py-1 px-10">
                      Snipe
                    </p>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="container w-full md:w-1/3">
            <div className="w-5/12 px-8 md:px-4">
              <div className="mt-36">
                <p className="text-white text-2xl text-left mb-2">Preview</p>
                <div className="flex flex-col gap-y-4 w-full md:w-96 h-96 bg-snipenear-input rounded-lg overflow-y-auto p-4">
                  {typeof contractResult === "string" && (
                    <p className="text-white text-md font-bold mx-auto">
                      {contractResult}
                    </p>
                  )}

                  {/* Contract Result */}
                  {hasFetching &&
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
                          className="mx-auto border-4 border-snipenear rounded-lg"
                        />
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
                  {hasFetching &&
                    isToken &&
                    typeof contractResult === "object" &&
                    !contractResult.token && (
                      <p className="text-white text-md font-bold mx-auto">
                        Token Id not found
                      </p>
                    )}

                  {hasFetching &&
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
                            src={`${contractResult.metadata?.base_uri}/${contractResult.token?.metadata?.media}`}
                            width={100}
                            alt="NFT Image"
                            className="mx-auto border-4 border-snipenear rounded-lg"
                            onLoad={() => setIsImageLoading(false)}
                          />
                        )}
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Token Id</p>
                          <p className="text-white text-sm">:</p>
                          <p className="text-white text-sm">
                            {contractResult.token?.token_id}
                          </p>
                        </div>
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Owner Id</p>
                          <p className="text-white text-sm">:</p>
                          <p className="text-white text-sm">
                            {contractResult.token?.owner_id}
                          </p>
                        </div>
                        <div className="grid grid-cols-3">
                          <p className="text-white text-sm">Title</p>
                          <p className="text-white text-sm">:</p>
                          <p className="text-white text-sm">
                            {contractResult.token?.metadata?.title}
                          </p>
                        </div>
                      </Fragment>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default App;
