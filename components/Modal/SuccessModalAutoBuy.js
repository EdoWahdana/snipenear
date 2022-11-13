import IconMagic from "../Icons/IconMagic";

const SuccessModalAutoBuy = ({ onClose, onSnipeMore }) => {
  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center md:items-center justify-center p-4 text-center sm:items-center">
        <div className="relative transform overflow-hidden rounded-lg bg-eversnipe-input border-4 border-eversnipe">
          <div className="bg-eversnipe-input p-4">
            <div className="sm:flex sm:items-start mb-4">
              <div className="text-center sm:text-left">
                <IconMagic
                  width={70}
                  height={70}
                  color={"#FFF"}
                  className="mx-auto mb-4"
                />
                <h3
                  className="text-2xl font-bold text-center leading-6 text-white"
                  id="modal-title"
                >
                  All set. Wait for the AutoBuy Magic to happen!
                </h3>
                <div className="my-4">
                  <p className="text-sm text-white">
                    Our AutoBuy Magic system will do a magic that transfer your
                    favorite NFT when your snipe hit the target.
                  </p>
                </div>
              </div>
            </div>

            <div className="inline-flex gap-x-2 bg-eversnipe-input mx-auto">
              <button
                type="button"
                className="bg-eversnipe hover:bg-eversnipe-hover text-eversnipe-text rounded-lg p-2"
                onClick={onSnipeMore}
              >
                Snipe More
              </button>
              <button
                type="button"
                className="bg-eversnipe hover:bg-eversnipe-hover text-eversnipe-text rounded-lg p-2"
                onClick={onClose}
              >
                Go to My Snipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModalAutoBuy;
