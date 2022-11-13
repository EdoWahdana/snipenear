import IconBell from "../Icons/IconBell";
import ImageViewer from "react-simple-image-viewer";
import { useState } from "react";

const LearnMoreModal = ({ isShow, onClose }) => {
  const imageList = [
    "learnmore1.png",
    "learnmore2.png",
    "learnmore3.png",
    "learnmore4.png",
    "learnmore5.png",
    "learnmore6.png",
    "learnmore7.png",
    "learnmore8.png",
    "learnmore9.png",
    "learnmore10.png",
  ];

  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imageIndex, setImageIndex] = useState(null);

  if (!isShow) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center md:items-center justify-center p-4 text-center sm:items-center">
        <div className="relative transform overflow-hidden rounded-lg bg-eversnipe-input border-4 border-eversnipe">
          <div className="bg-eversnipe-input p-4">
            <div className="sm:flex sm:items-start mb-4">
              <div className="text-center sm:text-left">
                <img
                  src="/eversnipe-logo-title.png"
                  className="w-80 mx-auto mb-10 mt-4"
                />
                <h3
                  className="text-2xl font-bold text-center leading-6 text-white"
                  id="modal-title"
                >
                  Introducing EverSnipe
                </h3>
                <div className="my-4">
                  <p className="text-md text-white text-center font-poppins">
                    The most reliable tool to snipe your favorite NFT and
                    Collection
                  </p>
                  <p className="text-md text-white text-center font-poppins">
                    How to use :
                  </p>
                  <div className="scrollbar bg-[#523550] rounded-lg max-h-96 overflow-y-auto">
                    <table className="table-auto text-white mt-4">
                      <tbody>
                        <tr>
                          <td className="p-2 align-top md:align-middle">
                            <p className="text-lg font-bold">1.</p>
                          </td>
                          <td className="p-2 align-top md:align-middle">
                            <p>
                              Before you can use our app, you have to Sign in
                              with Wallet Selector and select your favorite
                              wallet to be connected.
                              <button
                                className="hidden md:block bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mt-2 ml-2"
                                onClick={() => {
                                  setShowImagePreview(true);
                                  setImageIndex(0);
                                }}
                              >
                                Show Image
                              </button>
                            </p>
                            <button
                              className="block md:hidden bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mx-auto mt-1"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImageIndex(0);
                              }}
                            >
                              Show Image
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-top md:align-middle">
                            <p className="text-lg font-bold">2.</p>
                          </td>
                          <td className="p-2 align-top md:align-middle">
                            <p>
                              After you logged in, you should see notification
                              prompt in your browser. Click <b>"Allow"</b> to
                              get Push Notification.
                              <button
                                className="hidden md:block bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mt-2 ml-2"
                                onClick={() => {
                                  setShowImagePreview(true);
                                  setImageIndex(1);
                                }}
                              >
                                Show Image
                              </button>
                            </p>
                            <button
                              className="block md:hidden bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mx-auto mt-1"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImageIndex(1);
                              }}
                            >
                              Show Image
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-top md:align-middle">
                            <p className="text-lg font-bold">3.</p>
                          </td>
                          <td className="p-2 align-top md:align-middle">
                            <p>
                              Click the <b>"Launch App"</b> button to start
                              sniping. You will be redirected to a new page.
                              <button
                                className="hidden md:block bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mt-2 ml-2"
                                onClick={() => {
                                  setShowImagePreview(true);
                                  setImageIndex(2);
                                }}
                              >
                                Show Image
                              </button>
                            </p>
                            <button
                              className="block md:hidden bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mx-auto mt-1"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImageIndex(2);
                              }}
                            >
                              Show Image
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-top md:align-middle">
                            <p className="text-lg font-bold">4.</p>
                          </td>
                          <td className="p-2 align-top md:align-middle">
                            <p>
                              Insert Contract Id and Token Id of NFT that you
                              want to snipe.
                              <button
                                className="hidden md:block bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mt-2 ml-2"
                                onClick={() => {
                                  setShowImagePreview(true);
                                  setImageIndex(3);
                                }}
                              >
                                Show Image
                              </button>
                            </p>
                            <button
                              className="block md:hidden bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mx-auto mt-1"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImageIndex(3);
                              }}
                            >
                              Show Image
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-top md:align-middle">
                            <p className="text-lg font-bold">5.</p>
                          </td>
                          <td className="p-2 align-top md:align-middle">
                            <p>
                              Set Alert Price to get notified when the NFT is
                              listed less than or equal the Alert Price.
                              <button
                                className="hidden md:block bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mt-2 ml-2"
                                onClick={() => {
                                  setShowImagePreview(true);
                                  setImageIndex(4);
                                }}
                              >
                                Show Image
                              </button>
                            </p>
                            <button
                              className="block md:hidden bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mx-auto mt-1"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImageIndex(4);
                              }}
                            >
                              Show Image
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-top md:align-middle">
                            <p className="text-lg font-bold">6.</p>
                          </td>
                          <td className="p-2 align-top md:align-middle">
                            <p>
                              Enter your valid email that will receive the
                              notification later.
                              <button
                                className="hidden md:block bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mt-2 ml-2"
                                onClick={() => {
                                  setShowImagePreview(true);
                                  setImageIndex(5);
                                }}
                              >
                                Show Image
                              </button>
                            </p>
                            <button
                              className="block md:hidden bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mx-auto mt-1"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImageIndex(5);
                              }}
                            >
                              Show Image
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-top md:align-middle">
                            <p className="text-lg font-bold">7.</p>
                          </td>
                          <td className="p-2 align-top md:align-middle">
                            <p>
                              Enable the AutoBuy option if you want to buy the
                              NFT immediately when the snipe hit the Alert
                              Price.
                              <button
                                className="hidden md:block bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mt-2 ml-2"
                                onClick={() => {
                                  setShowImagePreview(true);
                                  setImageIndex(6);
                                }}
                              >
                                Show Image
                              </button>
                            </p>
                            <button
                              className="block md:hidden bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mx-auto mt-1"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImageIndex(6);
                              }}
                            >
                              Show Image
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-top md:align-middle">
                            <p className="text-lg font-bold">8.</p>
                          </td>
                          <td className="p-2 align-top md:align-middle">
                            <p>
                              After you finish inserting the data. Click the{" "}
                              <b>"Check"</b> button to validate the NFT.
                              <button
                                className="hidden md:block bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mt-2 ml-2"
                                onClick={() => {
                                  setShowImagePreview(true);
                                  setImageIndex(7);
                                }}
                              >
                                Show Image
                              </button>
                            </p>
                            <button
                              className="block md:hidden bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mx-auto mt-1"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImageIndex(7);
                              }}
                            >
                              Show Image
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-top md:align-middle">
                            <p className="text-lg font-bold">9.</p>
                          </td>
                          <td className="p-2 align-top md:align-middle">
                            <p>
                              If eligible, the <b>"Snipe"</b> button will be
                              enabled and you can proceed to Snipe! 🎯
                              <button
                                className="hidden md:block bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mt-2 ml-2"
                                onClick={() => {
                                  setShowImagePreview(true);
                                  setImageIndex(8);
                                }}
                              >
                                Show Image
                              </button>
                            </p>
                            <button
                              className="block md:hidden bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mx-auto mt-1"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImageIndex(8);
                              }}
                            >
                              Show Image
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-top md:align-middle">
                            <p className="text-lg font-bold">10.</p>
                          </td>
                          <td className="p-2 align-top md:align-middle">
                            <p>
                              If you enable the AutoBuy option, you will be
                              redirected to Wallet in order to deposit your
                              Alert Price.
                              <button
                                className="hidden md:block bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mt-2 ml-2"
                                onClick={() => {
                                  setShowImagePreview(true);
                                  setImageIndex(9);
                                }}
                              >
                                Show Image
                              </button>
                            </p>
                            <button
                              className="block md:hidden bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe p-1 text-eversnipe font-bold text-xs rounded-lg mx-auto mt-1"
                              onClick={() => {
                                setShowImagePreview(true);
                                setImageIndex(9);
                              }}
                            >
                              Show Image
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 align-top md:align-middle">
                            <p className="text-lg font-bold">11.</p>
                          </td>
                          <td className="p-2 align-top md:align-middle">
                            <p>
                              And that's it. You just have to wait our system to
                              tell you the NFT listed at your Alert Price or the
                              NFT is already sent to your Wallet.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-eversnipe-input mx-auto">
              <button
                type="button"
                className="bg-eversnipe hover:bg-eversnipe-hover rounded-lg py-2 px-4"
                onClick={onClose}
              >
                <p className="text-eversnipe-dark font-bold">Understand</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showImagePreview && (
        <ImageViewer
          src={imageList}
          currentIndex={imageIndex}
          onClose={() => setShowImagePreview(false)}
        />
      )}
    </div>
  );
};

export default LearnMoreModal;
