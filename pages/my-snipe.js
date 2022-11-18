import React, { Fragment, useContext, useEffect, useState } from "react";
import Header from "components/Documentation/Header";
import AppNavbar from "pagesComponents/AppNavbar";
import UserContext from "../config/context";
import { parseImgUrl, prettyTruncate } from "../utils/common";
import { useRouter } from "next/router";
import axios from "axios";
import { generateAuth } from "../config/utils";
import IconDelete from "../components/Icons/IconDelete";
import IconInfo from "../components/Icons/IconInfo";
import IconEdit from "../components/Icons/IconEdit";
import SnipeInfoModal from "../components/Modal/SnipeInfoModal";
import SnipeEditModal from "../components/Modal/SnipeEditModal";
import IconWarning from "../components/Icons/IconWarning";
import InfiniteScroll from "react-infinite-scroll-component";
import IconRedirect from "../components/Icons/IconRedirect";
import AOS from 'aos';
import 'aos/dist/aos.css';

const FilterEnum = {
  Waiting: "Waiting",
  Success: "Success",
};

const ModalEnum = {
  Info: "Info",
  Delete: "Delete",
  Edit: "Edit",
};

const SnipeStatusEnum = {
  NotActive: "not_active",
  Waiting: "waiting",
  Success: "success",
  Failed: "failed",
};

const MySnipe = () => {
  const router = useRouter();
  const { walletSelector, walletSelectorObject, accountId } =
    useContext(UserContext);

  const [filter, setFilter] = useState(null);
  const [isToken, setIsToken] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [contractSnipe, setContractSnipe] = useState([]);
  const [tokenSnipe, setTokenSnipe] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedSnipe, setSelectedSnipe] = useState(null);
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 300
    })

    fetchSnipe();
  }, []);

  useEffect(() => {
    if (!walletSelector.isSignedIn()) {
      router.replace("/");
    }
  }, [walletSelector]);

  const parseSnipeStatus = (status) => {
    if (status === SnipeStatusEnum.NotActive) {
      return <p className="text-sm text-center text-gray-400">Not Active</p>;
    } else if (status === SnipeStatusEnum.Waiting) {
      return <p className="text-sm text-center text-yellow-300">Waiting</p>;
    } else if (status === SnipeStatusEnum.Success) {
      return <p className="text-sm text-center text-green-300">Success</p>;
    } else if (status === SnipeStatusEnum.Failed) {
      return <p className="text-sm text-center text-gray-300">Failed</p>;
    } else {
      return <p className="text-sm text-center text-gray-400">{status}</p>;
    }
  };

  const fetchSnipe = async (initial = false) => {
    const _hasMore = initial ? true : hasMore;

    if (!_hasMore || isFetching) {
      return;
    }

    setIsFetching(true);

    const tokenSnipeData = initial ? [] : tokenSnipe;
    const contractSnipeData = initial ? [] : contractSnipe;

    const resultRaw = await axios.get(`${process.env.NEXT_PUBLIC_API}/snipes`, {
      params: {
        skip: initial ? 0 : page * 10,
        limit: 50,
      },
      headers: {
        authorization: await generateAuth(accountId),
      },
    });

    const newResult = await resultRaw.data.data.data;
    const filteredTokenSnipe = newResult
      .filter((res) => res.tokenId)
      .map((res) => {
        if (res.tokenId) {
          return res;
        }
      });
    const filteredContractSnipe = newResult
      .filter((res) => !res.tokenId)
      .map((res) => {
        if (!res.tokenId) {
          return res;
        }
      });

    const newTokenSnipe = [...tokenSnipeData, ...filteredTokenSnipe];
    const newContractSnipe = [...contractSnipeData, ...filteredContractSnipe];

    setTokenSnipe(newTokenSnipe);
    setContractSnipe(newContractSnipe);
    setPage(page + 1);

    if (newResult && newResult.length < 10) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    setIsFetching(false);
  };

  const deleteSnipe = async (snipe) => {
    const snipeId = snipe._id;

    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API}/snipes/${snipeId}`,
      {
        headers: {
          authorization: await generateAuth(accountId),
        },
      }
    );

    if (res.data?.status === 1) {
      await fetchSnipe(true);
    }
  };

  const deleteSnipeAutoBuy = async (snipe) => {
    const externalId = snipe.externalId;

    const resultDeleteSnipeContract =
      await walletSelectorObject.signAndSendTransaction({
        signerId: walletSelector.store.getState().accounts[0].accountId,
        receiverId: process.env.NEXT_PUBLIC_SNIPE_CONTRACT_ID,
        actions: [
          {
            type: "FunctionCall",
            params: {
              methodName: "delete_snipe",
              args: {
                snipe_id: externalId,
              },
              gas: "100000000000000",
              deposit: "1",
            },
          },
        ],
      });

    if (resultDeleteSnipeContract) {
      console.log(resultDeleteSnipeContract);
    }
  };

  const filterWaitingOnly = async () => {
    const resultRaw = await axios.get(`${process.env.NEXT_PUBLIC_API}/snipes`, {
      params: {
        skip: 0,
        limit: 50,
      },
      headers: {
        authorization: await generateAuth(accountId),
      },
    });

    const newResult = await resultRaw.data.data.data;
    const filteredTokenSnipe = newResult
      .filter((res) => res.tokenId)
      .map((res) => {
        if (res.tokenId) {
          return res;
        }
      });

    const filteredToken = filteredTokenSnipe.filter(
      (token) => token.status === "waiting"
    );
    setTokenSnipe(filteredToken);
  };

  const filterSuccessOnly = async () => {
    const resultRaw = await axios.get(`${process.env.NEXT_PUBLIC_API}/snipes`, {
      params: {
        skip: 0,
        limit: 50,
      },
      headers: {
        authorization: await generateAuth(accountId),
      },
    });

    const newResult = await resultRaw.data.data.data;
    const filteredTokenSnipe = newResult
      .filter((res) => res.tokenId)
      .map((res) => {
        if (res.tokenId) {
          return res;
        }
      });

    const filteredToken = filteredTokenSnipe.filter(
      (token) => token.status === "success"
    );
    setTokenSnipe(filteredToken);
  };

  const generateTransactionHashFromReceipt = async (receiptId) => {
    const responseNearBlockApi = axios.get(
      "https://api.nearblocks.io/v1/search/receipt",
      {
        params: {
          keyword: receiptId,
        },
      }
    );

    const resultData = await responseNearBlockApi.data.receipt;

    if (resultData && resultData.length < 1) {
      return null;
    }

    return resultData[0].originated_from_transaction_hash || null;
  };

  return (
    <>
      <Header title="EverSnipe | App" />
      <AppNavbar title={router.asPath} />

      {/* Mobile Section */}
      <section
        className="grid md:hidden header relative items-start bg-fill min-h-screen overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, rgba(74,39,75,1) 0%, rgba(20,20,32,1) 100%)',
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

          <div className="grid grid-cols-1 w-full divide-x-2 divide-eversnipe divide-solid px-2 md:px-10">
            {/* Token Snipe */}
            {isToken && (
              <div className="">
                <div className="flex flex-row justify-center items-center mt-4">
                  <button
                    // className={`${!filter && 'bg-eversnipe-hover border-r-0 border-eversnipe-text'} rounded-l-lg text-eversnipe-text p-2`}
                    className={`${
                      !filter
                        ? "bg-eversnipe-hover border-r-2"
                        : "bg-eversnipe border-2 border-r-0"
                    } border-eversnipe-text hover:bg-eversnipe-hover text-eversnipe-text rounded-l-lg p-2`}
                    onClick={() => {
                      setFilter(null);
                      fetchSnipe(true);
                    }}
                  >
                    All
                  </button>
                  <button
                    className={`${
                      filter === FilterEnum.Waiting
                    ? "bg-eversnipe-hover border-r-2 border-l-2"
                    : "bg-eversnipe border-2 border-r-0 border-l-0"
                    } border-eversnipe-text hover:bg-eversnipe-hover text-eversnipe-text p-2`}
                    onClick={() => {
                      setFilter(FilterEnum.Waiting);
                      filterWaitingOnly();
                    }}
                  >
                    Waiting
                  </button>
                  <button
                    className={`${
                      filter === FilterEnum.Success
                        ? "bg-eversnipe-hover border-l-2"
                        : "bg-eversnipe border-2 border-l-0"
                    } border-eversnipe-text hover:bg-eversnipe-hover text-eversnipe-text rounded-r-lg p-2`}
                    onClick={() => {
                      setFilter(FilterEnum.Success);
                      filterSuccessOnly();
                    }}
                  >
                    Success
                  </button>
                </div>

                {tokenSnipe.length <= 0 && (
                  <div className="mt-44 text-center">
                    <IconWarning
                      size={80}
                      color={"rgb(158 158 158 / var(--tw-text-opacity))"}
                      className="mx-auto mb-4"
                    />
                    <p className="text-gray-500">
                      No NFT Snipe. Snipe some NFT now!
                    </p>
                  </div>
                )}

                {tokenSnipe.map((snipe) => (
                  <div
                    data-aos='zoom-in'
                    key={snipe._id}
                    className="bg-eversnipe transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4 mx-2 my-4"
                  >
                    <div className="flex flex-row h-24 justify-between items-center text-white">
                      <div className="inline-flex items-center gap-x-4">
                        <img
                          src={
                            snipe._meta?.mediaUrl
                              ? parseImgUrl(snipe._meta?.mediaUrl)
                              : "./logo-white-new.png"
                          }
                          className="w-16 h-16 border-2 border-eversnipe-dark"
                        />
                        <div className="flex flex-col justify-between items-start gap-y-2">
                          <div>
                            <p className="text-white font-bold text-md">
                              {snipe._meta?.nftToken?.metadata.title}
                            </p>
                            <p className="text-white text-xs">
                              {prettyTruncate(snipe.contractId, 20, "address")}
                            </p>
                            <p className="text-white text-xs">
                              {prettyTruncate(snipe.tokenId, 18, "address")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-2 justify-start items-end">
                        {parseSnipeStatus(snipe.status)}
                        <div className="inline-flex gap-x-1">
                          <button
                            className="bg-eversnipe-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                            onClick={() => {
                              setShowModal(ModalEnum.Info);
                              setSelectedSnipe(snipe);
                            }}
                          >
                            <IconInfo size={20} />
                          </button>
                          {snipe.status === SnipeStatusEnum.Waiting && (
                            <>
                              <button
                                className="bg-eversnipe-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                                onClick={() => {
                                  setShowModal(ModalEnum.Edit);
                                  setSelectedSnipe(snipe);
                                }}
                              >
                                <IconEdit size={20} />
                              </button>
                              <button
                                className="bg-eversnipe-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                                onClick={() => {
                                  snipe.isAutoBuy
                                    ? deleteSnipeAutoBuy(snipe)
                                    : deleteSnipe(snipe);
                                }}
                              >
                                <IconDelete size={20} />
                              </button>
                            </>
                          )}
                        </div>
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
          background: 'linear-gradient(180deg, rgba(74,39,75,1) 0%, rgba(20,20,32,1) 100%)',
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container w-full mx-auto">
          <div className="mt-32 mb-6">
            <p className="text-3xl text-white font-poppins font-bold text-center">
              MY SNIPE
            </p>
            <div className="flex flex-row justify-center items-center mt-4">
              <button
                // className={`${!filter && 'bg-eversnipe-hover border-r-0 border-eversnipe-text'} rounded-l-lg text-eversnipe-text p-2`}
                className={`${
                  !filter
                    ? "bg-eversnipe-hover border-r-2"
                    : "bg-eversnipe border-2 border-r-0"
                } border-eversnipe-text hover:bg-eversnipe-hover text-eversnipe-text rounded-l-lg p-2`}
                onClick={() => {
                  setFilter(null);
                  fetchSnipe(true);
                }}
              >
                All
              </button>
              <button
                className={`${
                  filter === FilterEnum.Waiting
                    ? "bg-eversnipe-hover border-r-2 border-l-2"
                    : "bg-eversnipe border-2 border-r-0 border-l-0"
                } border-eversnipe-text hover:bg-eversnipe-hover text-eversnipe-text p-2`}
                onClick={() => {
                  setFilter(FilterEnum.Waiting);
                  filterWaitingOnly();
                }}
              >
                Waiting
              </button>
              <button
                className={`${
                  filter === FilterEnum.Success
                    ? "bg-eversnipe-hover border-l-2"
                    : "bg-eversnipe border-2 border-l-0"
                } border-eversnipe-text hover:bg-eversnipe-hover text-eversnipe-text rounded-r-lg p-2`}
                onClick={() => {
                  setFilter(FilterEnum.Success);
                  filterSuccessOnly();
                }}
              >
                Success
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 w-full px-2 md:px-32">
            {/* Token Snipe */}
            <InfiniteScroll
              dataLength={tokenSnipe.length}
              next={fetchSnipe}
              hasMore={hasMore}
              className={
                "grid grid-cols-3 gap-x-4 xl:grid-cols-5 xl:gap-x-4 pl-2 pr-0"
              }
            >
              {tokenSnipe.map((snipe) => (
                <div
                  data-aos='zoom-in'
                  data-aos-offset='100'
                  key={snipe._id}
                  className="w-full shadow-sm shadow-eversnipe-input justify-between items-center text-white bg-eversnipe transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4 my-4"
                >
                  <div className="text-lg font-bold mt-4 mb-2">
                    {parseSnipeStatus(snipe.status)}
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative h-36 w-36">
                      <div className="absolute h-36 flex flex-col w-full">
                        <div className="my-2 relative flex flex-grow h-0 mx-auto">
                          <div className="w-32">
                            <img
                              alt="Token Image"
                              src={
                                snipe._meta?.mediaUrl
                                  ? parseImgUrl(snipe._meta?.mediaUrl)
                                  : "./logo-white-new.png"
                              }
                              className="relative object-contain w-full h-full drop-shadow-xl mx-auto z-10"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-start gap-y-2">
                      <div>
                        <p className="text-white font-bold text-md text-center mb-2">
                          {snipe._meta?.nftToken?.metadata.title}
                        </p>
                        <div className="flex flex-col">
                          <p className="text-white text-xs text-center">
                            {prettyTruncate(snipe.contractId, 30, "address")}
                          </p>
                          <p className="text-white text-xs text-center">
                            {prettyTruncate(snipe.tokenId, 30, "address")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-y-2 justify-center items-end my-4">
                    {snipe.status === SnipeStatusEnum.Waiting && (
                      <div className="grid grid-cols-3 gap-x-1">
                        <button
                          className="  items-center gap-x-2 bg-eversnipe-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                          onClick={() => {
                            setShowModal(ModalEnum.Info);
                            setSelectedSnipe(snipe);
                          }}
                        >
                          <p className="text-sm text-center self-center justify-self-center">
                            Info
                          </p>
                        </button>
                        <button
                          className=" items-center gap-x-2 bg-eversnipe-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                          onClick={() => {
                            setShowModal(ModalEnum.Edit);
                            setSelectedSnipe(snipe);
                          }}
                        >
                          <p className="text-sm text-center self-center justify-self-center">
                            Edit
                          </p>
                        </button>
                        <button
                          className=" items-center gap-x-2 bg-eversnipe-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                          onClick={() => {
                            snipe.isAutoBuy
                              ? deleteSnipeAutoBuy(snipe)
                              : deleteSnipe(snipe);
                          }}
                        >
                          <p className="text-sm text-center self-center justify-self-center">
                            Delete
                          </p>
                        </button>
                      </div>
                    )}

                    {snipe.status === SnipeStatusEnum.Success && (
                      <div className={`${snipe.isAutoBuy ? 'grid grid-cols-2 gap-x-2' : 'grid grid-cols-1'}`}>
                        <button
                          className={`${snipe.isAutoBuy ? 'p-2' : 'py-4 px-8'} items-center gap-x-2 bg-eversnipe-input text-sm rounded-lg hover:bg-opacity-50`}
                          onClick={() => {
                            setShowModal(ModalEnum.Info);
                            setSelectedSnipe(snipe);
                          }}
                        >
                          <p className="text-sm text-center self-center justify-self-center">
                            Info
                          </p>
                        </button>
                        {snipe.isAutoBuy && (
                          <button
                            className="inline-flex items-center gap-x-2 bg-eversnipe-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                          >
                            <a href={`https://explorer.testnet.near.org/?query=${snipe?.buyReceiptId}`} className="text-sm self-end justify-self-end">
                              Show Receipt
                            </a>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </InfiniteScroll>
            {/* Loop token snipe */}
          </div>
        </div>
      </section>

      <SnipeInfoModal
        data={selectedSnipe}
        isShow={showModal === ModalEnum.Info}
        onClose={() => setShowModal(null)}
      />

      <SnipeEditModal
        data={selectedSnipe}
        accountId={accountId}
        isShow={showModal === ModalEnum.Edit}
        onClose={() => {
          fetchSnipe(true);
          setShowModal(null);
        }}
      />
    </>
  );
};

export default MySnipe;
