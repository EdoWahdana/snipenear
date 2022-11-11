import { formatNearAmount } from "near-api-js/lib/utils/format";
import { parseImgUrl, prettyTruncate } from "../../utils/common";

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
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center">
        <div className="w-[400px] relative transform overflow-hidden rounded-lg bg-eversnipe-input border-4 border-eversnipe">
          <div className="p-4">
            <div className="mb-4">
              <div className="text-center sm:text-left">
                <h3
                  className="text-2xl font-bold text-center leading-6 text-white mb-2"
                  id="modal-title"
                >
                  {data.tokenId ? "NFT Snipe" : "Collection Snipe"}
                </h3>
                <img
                  src={
                    data._meta?.mediaUrl
                      ? parseImgUrl(data._meta?.mediaUrl)
                      : "./logo-white-new.png"
                  }
                  width={100}
                  className="mx-auto border-4 border-eversnipe rounded-lg mb-6"
                />

                <table className="table-auto mx-auto">
                  <tbody className="text-white">
                    <tr>
                      <td className="p-2 text-start text-xs md:text-sm">Collection</td>
                      <td className="py-2 px-6 text-start font-bold">
                        {data._meta?.nftToken?.metadata.title}
                      </td>
                    </tr>
                    <tr className="p-2 text-start">
                      <td className="p-2 text-start text-xs md:text-sm">Contract Id</td>
                      <td className="py-2 px-6 text-start font-bold">
                        {data.contractId}
                      </td>
                    </tr>
                    {data.tokenId && (
                      <tr className="p-2 text-start">
                        <td className="p-2 text-start text-xs md:text-sm">Token Id</td>
                        <td className="py-2 px-6 text-start font-bold">
                          {data.tokenId}
                        </td>
                      </tr>
                    )}
                    {data._meta?.nftToken?.owner_id && (
                    <tr className="p-2 text-start">
                      <td className="p-2 text-start text-xs md:text-sm">Current Owner</td>
                      <td className="py-2 px-6 text-start font-bold">
                        {prettyTruncate(data._meta.nftToken.owner_id, 20, 'address')}
                      </td>
                    </tr>

                    )}
                    <tr className="p-2 text-start">
                      <td className="p-2 text-start text-xs md:text-sm">Alert Price</td>
                      <td className="py-2 px-6 text-start font-bold">
                        {data.price ? formatNearAmount(data.price) : "None"} Ⓝ
                      </td>
                    </tr>
                    <tr className="p-2 text-start">
                      <td className="p-2 text-start text-xs md:text-sm">Created</td>
                      <td className="py-2 px-6 text-start font-bold">
                        {new Date(data.createdAt).toLocaleString()}
                      </td>
                    </tr>
                    {data.status === StatusEnum.Waiting && (
                      <tr className="text-sm">
                        <td className="p-2 text-start text-xs md:text-sm">Status</td>
                        <td className="py-2 px-6 text-start font-bold">
                          <span className="text-yellow-700">Waiting</span>
                        </td>
                      </tr>
                    )}
                    {data.status === StatusEnum.Success && (
                      <tr className="text-sm">
                        <td className="p-2 text-start text-xs md:text-sm">Status</td>
                        <td className="py-2 px-6 text-start font-bold">
                          <span className="text-green-700">Success</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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

export default SnipeInfoModal;
