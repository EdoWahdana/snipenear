const AutobuyModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center md:items-center justify-center p-4 text-center sm:items-center">
        <div className="relative transform overflow-hidden rounded-lg bg-eversnipe-input border-4 border-eversnipe">
          <div className="bg-eversnipe-input p-4">
            <div className="sm:flex sm:items-start mb-4">
              <div className="text-center sm:text-left">
                <h3
                  className="text-2xl font-bold text-center leading-6 text-white pb-4"
                  id="modal-title"
                >
                  Deposit NEAR to Auto Buy
                </h3>
                <div className="my-2">
                  <p className="text-sm text-white">
                    Auto Buy lets you buy your favorite NFT once the listing
                    price is below or equal your desired Alert Price.
                  </p>
                  <p className="text-sm text-white py-2">
                    In order to achieve that, you have to deposit your NEAR to
                    the smart contract.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-eversnipe-input mx-auto inline-flex gap-x-4">
              <button
                type="button"
                className="bg-eversnipe hover:bg-eversnipe-hover text-white rounded-lg p-2"
                onClick={onClose}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutobuyModal;
