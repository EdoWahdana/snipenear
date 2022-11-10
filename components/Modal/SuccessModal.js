import IconEmailSent from "../Icons/IconEmailSent";

const SuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center md:items-center justify-center p-4 text-center sm:items-center">
        <div className="relative transform overflow-hidden rounded-lg bg-eversnipe-input border-4 border-eversnipe">
          <div className="bg-eversnipe-input p-4">
            <div className="sm:flex sm:items-start mb-4">
              <div className="text-center sm:text-left">
                <IconEmailSent
                  width={150}
                  height={100}
                  className="mx-auto mb-4"
                />
                <h3
                  className="text-2xl font-bold text-center leading-6 text-white"
                  id="modal-title"
                >
                  All set. Just wait an email from us!
                </h3>
                <div className="my-4">
                  <p className="text-sm text-white">
                    You just have to chill n wait our system to notify you via
                    email when your snipe hit the target.
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

export default SuccessModal;
