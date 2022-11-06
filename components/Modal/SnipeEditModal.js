import { formatNearAmount } from "near-api-js/lib/utils/format";
import { useState } from "react";
import { parseImgUrl } from "../../utils/common";

const SnipeEditModal = ({ isShow, data, onClose, onUpdate }) => {
  const [price, setPrice] = useState(data?.price || null);

  if (!isShow) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center md:items-end justify-center p-4 text-center sm:items-center">
        <div className="relative transform overflow-hidden rounded-lg bg-snipenear-input">
          <div className="bg-snipenear-input p-4">
            <div className="sm:flex sm:items-start mb-4">
              <div className="text-center sm:text-left">
                <h3
                  className="text-2xl font-bold text-center leading-6 text-white mb-2"
                  id="modal-title"
                >
                  Edit Snipe
                </h3>
                <img
                  src={
                    data.metadata?.media
                      ? parseImgUrl(data.metadata?.media)
                      : "./logo-white.png"
                  }
                  width={100}
                  className="mx-auto border-4 border-snipenear rounded-lg"
                />

                <div className="my-4">
                  <div className="flex flex-col gap-y-2 mt-10">
                    <p className=" font-poppins font-bold text-white text-md text-left md:text-xl">
                      Alert Price
                    </p>
                    <div className="inline-flex">
                      <input
                        name="price"
                        type={"number"}
                        className="bg-snipenear-input border-2 border-snipenear text-white rounded-md p-1 pr-10 mr-4"
                        onChange={(e) => setContractId(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-2 mt-4">
                    <p className=" font-poppins font-bold text-white text-md text-left md:text-xl">
                      Contract Id
                    </p>
                    <div className="inline-flex">
                      <input
                        name="contractId"
                        className="bg-snipenear-input border-2 border-snipenear text-white rounded-md p-1 pr-10 mr-4"
                        onChange={(e) => setContractId(e.target.value)}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-white">
                    Contract Id : {data.contractId}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-snipenear-input mx-auto">
              <button
                type="button"
                className="bg-snipenear hover:bg-snipenear-hover text-snipenear-text rounded-lg p-2"
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

export default SnipeEditModal;
