import CID from "cids";

export const parseImgUrl = (imgUrl, defaultValue = "") => {
  if (!imgUrl) {
    return defaultValue;
  }

  if (imgUrl.includes("data:image")) {
    return imgUrl;
  }

  let url = imgUrl.includes("://") ? imgUrl : `ipfs://${imgUrl}`;
  let schema = url.split("://")[0];
  if (schema === "ipfs") {
    let parts = url.split("/");
    let hash = parts[2];
    let path = parts.length > 3 ? `/${parts.slice(3).join("/")}` : "";
    let cid;
    try {
      cid = new CID(hash);
    } catch (e) {
      console.error(`Unable to parse CID: ${hash}`, e);
      return imgUrl;
    }

    return `https://ipfs.fleek.co/ipfs/${cid}${path}`;
  }

  return imgUrl;
};

export const prettyTruncate = (str = '', len = 8, type) => {
	if (str && str.length > len) {
		if (type === 'address') {
			const front = Math.ceil(len / 2)
			const back = str.length - (len - front)
			return `${str.slice(0, front)}...${str.slice(back)}`
		}
		return `${str.slice(0, len)}...`
	}

	return str
};
