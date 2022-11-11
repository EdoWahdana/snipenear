import { formatNearAmount } from "near-api-js/lib/utils/format";
import { utils } from "near-api-js";
import { useState } from "react";
import { parseImgUrl } from "../../utils/common";
import axios from "axios";
import { generateAuth } from "../../config/utils";

const SnipeEditModal = ({ isShow, accountId, data, onClose }) => {
  const [price, setPrice] = useState(data?._meta.formatNearAmount || null);
  const [email, setEmail] = useState(data?.email || null);
  const [message, setMessage] = useState(null);

  if (!isShow) {
    return null;
  }

  const updateSnipe = async () => {
    const snipeId = data._id;
    const yoctoPrice = utils.format.parseNearAmount(price.toString());

    data["price"] = yoctoPrice;
    data["email"] = email;

    const resultUpdate = await axios.put(
      `${process.env.NEXT_PUBLIC_API}/snipes/${snipeId}`,
      data,
      {
        headers: {
          authorization: await generateAuth(accountId),
        },
      }
    );

    if (resultUpdate.data && resultUpdate.data?.status === 1) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-20 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-full items-center justify-center p-4 text-center w-full md:w-1/3 mx-auto">
        <div className="grow relative transform overflow-hidden rounded-lg bg-eversnipe-input border-4 border-eversnipe">
          <div className="p-4 w-full">
            <div className="sm:items-start mb-4 w-full">
              <div className="text-center sm:text-center">
                <h3
                  className="text-2xl font-bold text-center leading-6 text-white border-b-2 border-eversnipe mb-6 pb-2"
                  id="modal-title"
                >
                  Edit Snipe
                </h3>
                <img
                  src={
                    data._meta?.mediaUrl
                      ? parseImgUrl(data._meta?.mediaUrl)
                      : "./logo-white-new.png"
                  }
                  width={100}
                  className="mx-auto border-4 border-eversnipe rounded-lg"
                />

                <div className="my-8">
                  {data.settings?.emailNotification && (
                    <div className="grid grid-cols-3 gap-y-2 mb-4 grid-flow-col items-start">
                      <p className=" font-poppins font-bold text-white text-md text-left md:text-lg">
                        Email
                      </p>
                      <div className="inline-flex md:hidden mx-auto">
                        <input
                          name="contractId"
                          type={"email"}
                          className="bg-eversnipe-input border-2 border-eversnipe text-white rounded-md p-1 mr-4"
                          onChange={(e) => setEmail(e.target.value)}
                          defaultValue={data.settings.emailNotification}
                        />
                      </div>

                      <div className="hidden md:inline-flex mx-auto">
                        <input
                          name="contractId"
                          type={"email"}
                          className="bg-eversnipe-input border-2 border-eversnipe text-white rounded-md p-1 mr-4"
                          onChange={(e) => setEmail(e.target.value)}
                          defaultValue={data.settings.emailNotification}
                          size={20}
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-y-2 grid-flow-col items-start">
                    <p className=" font-poppins font-bold text-white text-md text-left md:text-lg">
                      Alert Price
                    </p>
                    <div className="inline-flex mx-auto relative">
                      <input
                        name="price"
                        type={"number"}
                        className="bg-eversnipe-input border-2 border-eversnipe text-white rounded-md p-1 mr-4"
                        onChange={(e) => setPrice(e.target.value)}
                        defaultValue={data._meta.formatNearAmount}
                        min={0}
                      />
                      <div className="absolute right-5 top-0 flex items-center text-white text-opacity-70 h-full px-2">
                        Ⓝ
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="inline-flex gap-x-4 bg-eversnipe-input mx-auto">
              <div className="font-poppins mr-0 md:mr-4" onClick={onClose}>
                <p className="bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe py-2 px-4 text-eversnipe font-bold text-lg rounded-lg cursor-pointer">
                  Close
                </p>
              </div>
              <button type="submit" className="font-poppins mr-0 md:mr-4" onClick={updateSnipe}>
                <p className="bg-eversnipe hover:bg-eversnipe-hover transition-colors duration-100 border-2 border-eversnipe py-2 px-4 text-eversnipe-text font-bold text-lg rounded-lg cursor-pointer">
                  Update
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnipeEditModal;
