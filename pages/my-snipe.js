import React, { Fragment, useContext, useEffect, useState } from "react";
import Header from "components/Documentation/Header";
import AppNavbar from "pagesComponents/AppNavbar";
import UserContext from "../config/context";
import { parseImgUrl } from "../utils/common";
import { useRouter } from "next/router";
import axios from "axios";
import { generateAuth } from "../config/utils";
import IconDelete from "../components/Icons/IconDelete";
import IconInfo from "../components/Icons/IconInfo";
import IconEdit from "../components/Icons/IconEdit";
import SnipeInfoModal from "../components/Modal/SnipeInfoModal";
import SnipeEditModal from "../components/Modal/SnipeEditModal";

const ModalEnum = {
  Info: "Info",
  Delete: "Delete",
  Edit: "Edit",
};

const MySnipe = () => {
  const router = useRouter();
  const { walletConnection } = useContext(UserContext);

  const [isToken, setIsToken] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [contractSnipe, setContractSnipe] = useState([]);
  const [tokenSnipe, setTokenSnipe] = useState([]);
  const [page, setPage] = useState(0);
  const [selectedSnipe, setSelectedSnipe] = useState(null);
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    fetchSnipe();
  }, []);

  useEffect(() => {
    if (!walletConnection.isSignedIn()) {
      router.replace("/");
    }
  }, [walletConnection]);

  const fetchSnipe = async (initial = false) => {
    if (!hasMore || isFetching) {
      return;
    }

    setIsFetching(true);

    const tokenSnipeData = initial ? [] : tokenSnipe;
    const contractSnipeData = initial ? [] : contractSnipe;

    const resultRaw = await axios.get(`${process.env.NEXT_PUBLIC_API}/snipes`, {
      params: {
        skip: page * 10,
        limit: 10,
      },
      headers: {
        authorization: await generateAuth(
          walletConnection.getAccountId(),
          walletConnection
        ),
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

    if (newResult && newResult.length < 10) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    setIsFetching(false);
  };

  const deleteSnipe = async (snipeId) => {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API}/snipes/${snipeId}`,
      {
        headers: {
          authorization: await generateAuth(
            walletConnection.getAccountId(),
            walletConnection
          ),
        },
      }
    );

    if (res.data?.status === 1) {
      location.reload();
    }
  };

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
                  {contractSnipe.map((snipe) => (
                    <div className="bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4 mx-2 my-4">
                      <div className="flex flex-row h-20 justify-between items-center text-white">
                        <div className="inline-flex items-center gap-x-4">
                          <img
                            src={
                              snipe.metadata?.media
                                ? parseImgUrl(snipe.metadata?.media)
                                : "./logo-white.png"
                            }
                            className="w-16 h-16 border-2 border-snipenear-dark"
                          />
                          <div className="flex flex-col justify-between items-start gap-y-2">
                            <div>
                              <p className="text-white font-bold text-md">
                                {snipe.metadata?.title}
                              </p>
                              <p className="text-white text-xs">
                                {snipe.contractId}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-end items-center">
                          <div className="inline-flex gap-x-1">
                            <button
                              className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                              onClick={() => {
                                setShowModal(ModalEnum.Info);
                                setSelectedSnipe(snipe);
                              }}
                            >
                              <IconInfo size={20} />
                            </button>
                            <button
                              className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                              onClick={() => {
                                setShowModal(ModalEnum.Edit);
                                setSelectedSnipe(snipe);
                              }}
                            >
                              <IconEdit size={20} />
                            </button>
                            <button
                              className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                              onClick={() => {
                                deleteSnipe(snipe._id);
                              }}
                            >
                              <IconDelete size={20} />
                            </button>
                          </div>
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
                {tokenSnipe.map((snipe) => (
                  <div className="bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4 mx-2 my-4">
                    <div className="flex flex-row h-24 justify-between items-center text-white">
                      <div className="inline-flex items-center gap-x-4">
                        <img
                          src={
                            snipe.metadata?.media
                              ? parseImgUrl(snipe.metadata?.media)
                              : "./logo-white.png"
                          }
                          className="w-16 h-16 border-2 border-snipenear-dark"
                        />
                        <div className="flex flex-col justify-between items-start gap-y-2">
                          <div>
                            <p className="text-white font-bold text-md">
                              {snipe.metadata?.title}
                            </p>
                            <p className="text-white text-xs">
                              {snipe.contractId}
                            </p>
                            <p className="text-white text-xs">
                              {snipe.tokenId}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-end items-center">
                        <div className="inline-flex gap-x-1">
                          <button
                            className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                            onClick={() => {
                              setShowModal(ModalEnum.Info);
                              setSelectedSnipe(snipe);
                            }}
                          >
                            <IconInfo size={20} />
                          </button>
                          <button
                            className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                            onClick={() => {
                              setShowModal(ModalEnum.Edit);
                              setSelectedSnipe(snipe);
                            }}
                          >
                            <IconEdit size={20} />
                          </button>
                          <button
                            className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                            onClick={() => {
                              deleteSnipe(snipe._id);
                            }}
                          >
                            <IconDelete size={20} />
                          </button>
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
              {contractSnipe.map((snipe) => (
                <div className="hidden md:flex flex-row h-20 justify-between items-center text-white bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4 my-4">
                  <div className="inline-flex items-center gap-x-4">
                    <img
                      src={
                        snipe.metadata?.media
                          ? parseImgUrl(snipe.metadata?.media)
                          : "./logo-white.png"
                      }
                      className="w-16 h-16 border-2 border-snipenear-dark"
                    />
                    <div className="flex flex-col justify-between items-start gap-y-2">
                      <div>
                        <p className="text-white font-bold text-md">
                          {snipe.metadata?.title}
                        </p>
                        <p className="text-white text-xs">{snipe.contractId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end items-center">
                    <div className="inline-flex gap-x-1">
                      <button
                        className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                        onClick={() => {
                          setShowModal(ModalEnum.Info);
                          setSelectedSnipe(snipe);
                        }}
                      >
                        <IconInfo size={20} />
                      </button>
                      <button
                        className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                        onClick={() => {
                          setShowModal(ModalEnum.Edit);
                          setSelectedSnipe(snipe);
                        }}
                      >
                        <IconEdit size={20} />
                      </button>
                      <button
                        className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                        onClick={() => {
                          deleteSnipe(snipe._id);
                        }}
                      >
                        <IconDelete size={20} />
                      </button>
                    </div>
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
              {tokenSnipe.map((snipe) => (
                <div className="hidden md:flex flex-row h-20 justify-between items-center text-white bg-snipenear transition-colors duration-100 bg-opacity-50 hover:bg-opacity-60 rounded-lg px-4 my-4">
                  <div className="inline-flex items-center gap-x-4">
                    <img
                      alt="Token Image"
                      src={
                        snipe.metadata?.media
                          ? parseImgUrl(snipe.metadata?.media)
                          : "./logo-white.png"
                      }
                      className="w-16 h-16 border-2 border-snipenear-dark"
                    />
                    <div className="flex flex-col justify-between items-start gap-y-2">
                      <div>
                        <p className="text-white font-bold text-md">
                          {snipe.metadata?.title}
                        </p>
                        <div className="flex flex-col">
                          <p className="text-white text-xs">
                            {snipe.contractId}
                          </p>
                          <p className="text-white text-xs">{snipe.tokenId}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end items-center">
                    <div className="inline-flex gap-x-1">
                      <button
                        className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                        onClick={() => {
                          setShowModal(ModalEnum.Info);
                          setSelectedSnipe(snipe);
                        }}
                      >
                        <IconInfo size={20} />
                      </button>
                      <button
                        className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                        onClick={() => {
                          setShowModal(ModalEnum.Edit);
                          setSelectedSnipe(snipe);
                        }}
                      >
                        <IconEdit size={20} />
                      </button>
                      <button
                        className="bg-snipenear-input text-sm p-2 rounded-lg hover:bg-opacity-50"
                        onClick={() => {
                          deleteSnipe(snipe._id);
                        }}
                      >
                        <IconDelete size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Loop token snipe */}
            </div>
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
        isShow={showModal === ModalEnum.Edit}
        onClose={() => setShowModal(null)}
      />
    </>
  );
};;

export default MySnipe;
