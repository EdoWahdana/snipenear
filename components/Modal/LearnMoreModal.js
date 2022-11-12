

const LearnMoreModal = ({ isShow, onClose }) => {
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
                  <table className="table-auto border text-white mt-4">
                    <tbody>
                      <tr>
                        <td className="p-2">
                          <p className="text-lg font-bold">1.</p>
                        </td>
                        <td className="p-2">
                          <p>
                            Before you can use our app, you have to Sign in with
                            Wallet Selector and select your favorite wallet to
                            be connected.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2">
                          <p className="text-lg font-bold">2.</p>
                        </td>
                        <td className="p-2">
                          <p>
                            Click the <b>"Launch App"</b> button to start sniping. You will be redirected to a new page.
                          </p>
                        </td>
                      </tr>
<tr>
                        <td className="p-2">
                          <p className="text-lg font-bold">2.</p>
                        </td>
                        <td className="p-2">
                          <p>
                            Click the <b>"Launch App"</b> button to start sniping. You will be redirected to a new page.
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
    </div>
  );
};

export default LearnMoreModal;
