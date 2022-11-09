import IconError from "../Icons/IconError";

const ErrorModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center md:items-end justify-center p-4 text-center sm:items-center">
        <div className="relative transform overflow-hidden rounded-lg bg-eversnipe-input border-4 border-eversnipe">
          <div className="bg-eversnipe-input p-4">
            <div className="sm:flex sm:items-start mb-4">
              <div className="text-center sm:text-left">
                <IconError size={100} className="mx-auto mb-4" />
                <h3
                  className="text-2xl font-bold text-center leading-6 text-white"
                  id="modal-title"
                >
                  Something went wrong
                </h3>
                <div className="my-2">
                  <p className="text-sm text-white">
                    You can try to snipe your favorite NFT and Collection again
                    tho.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-eversnipe-input mx-auto">
              <button
                type="button"
                className="bg-eversnipe hover:bg-eversnipe-hover text-eversnipe-text rounded-lg p-2"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
