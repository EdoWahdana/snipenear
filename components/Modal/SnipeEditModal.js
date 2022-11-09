import { formatNearAmount } from "near-api-js/lib/utils/format";
import { useState } from "react";
import { parseImgUrl } from "../../utils/common";
import axios from "axios";
import { generateAuth } from "../../config/utils";

const SnipeEditModal = ({ isShow, accountId, data, onClose }) => {
  const [price, setPrice] = useState(data?.price || null);
  const [email, setEmail] = useState(data?.email || null);
  const [message, setMessage] = useState(null);

  if (!isShow) {
    return null;
  }

  const updateSnipe = async () => {
    const snipeId = data._id;

    data["price"] = price;
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
      <div className="flex min-h-full items-center justify-center p-4 text-center w-1/3 mx-auto">
        <div className="grow relative transform overflow-hidden rounded-lg bg-eversnipe-input">
          <div className="bg-eversnipe-input p-4 w-full">
            <div className="sm:items-start mb-4 w-full">
              <div className="text-center sm:text-center">
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
                      : "./logo-white-new.png"
                  }
                  width={100}
                  className="mx-auto border-4 border-eversnipe rounded-lg"
                />

                <div className="my-4">
                  <div className="flex flex-col gap-y-2 mt-10">
                    <p className=" font-poppins font-bold text-white text-md text-left md:text-xl mx-auto">
                      Alert Price
                    </p>
                    <div className="inline-flex mx-auto">
                      <input
                        name="price"
                        type={"number"}
                        className="bg-eversnipe-input border-2 border-eversnipe text-white rounded-md p-1 pr-10 mr-4"
                        onChange={(e) => setPrice(e.target.value)}
                        defaultValue={data._meta.formatNearAmount}
                      />
                    </div>
                  </div>
                  {data.settings?.emailNotification && (
                    <div className="flex flex-col gap-y-2 mt-4">
                      <p className=" font-poppins font-bold text-white text-md text-left md:text-xl mx-auto">
                        Email
                      </p>
                      <div className="inline-flex mx-auto">
                        <input
                          name="contractId"
                          className="bg-eversnipe-input border-2 border-eversnipe text-white rounded-md p-1 pr-10 mr-4"
                          onChange={(e) => setEmail(e.target.value)}
                          defaultValue={data.settings.emailNotification}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="inline-flex gap-x-4 bg-eversnipe-input mx-auto">
              <div className="font-poppins mr-0 md:mr-4" onClick={onClose}>
                <p className="bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe py-2 px-4 text-eversnipe font-bold text-lg rounded-lg cursor-pointer">
                  Close
                </p>
              </div>
<div className="font-poppins mr-0 md:mr-4" onClick={updateSnipe}>
                <p className="bg-eversnipe hover:bg-eversnipe-hover transition-colors duration-100 border-2 border-eversnipe py-2 px-4 text-eversnipe-text font-bold text-lg rounded-lg cursor-pointer">
                  Update
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnipeEditModal;
