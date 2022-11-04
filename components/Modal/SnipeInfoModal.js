import { formatNearAmount } from "near-api-js/lib/utils/format";
import { parseImgUrl } from "../../utils/common";

const StatusEnum = {
  Waiting: "waiting",
  Success: "success",
};

const SnipeInfoModal = ({ isShow, data, onClose }) => {
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
                  {data.tokenId ? "Token Snipe" : "Collection Snipe"}
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
                  <p className="text-sm text-white">
                    Collection : {data.metadata?.title}
                  </p>
                  <p className="text-sm text-white">
                    Contract Id : {data.contractId}
                  </p>
                  {data.tokenId && (
                    <p className="text-sm text-white">
                      Token Id : {data.tokenId}
                    </p>
                  )}
                  <p className="text-sm text-white">
                    Alert Price :{" "}
                    {data.price ? formatNearAmount(data.price) : "None"} Ⓝ
                  </p>
                  <p className="text-sm text-white">
                    Created : {new Date(data.createdAt).toLocaleString()}
                  </p>
                  {data.status === StatusEnum.Waiting && (
                    <p className="text-sm text-white">
                      Status :<span className="text-yellow-700">Waiting</span>
                    </p>
                  )}
                  {data.status === StatusEnum.Success && (
                    <p className="text-sm text-white">
                      Status : <span className="text-green-700">Success</span>
                    </p>
                  )}
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

export default SnipeInfoModal;
