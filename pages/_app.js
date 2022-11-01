import React from "react";
import Head from "next/head";
import "material-icons/css/material-icons.min.css";
import "assets/styles/index.css";
import * as nearAPI from "near-api-js";
import getConfig from "../config/near";
import UserContext from "../config/context";
import { useEffect, useState } from "react";

export default function MyApp({ Component, pageProps }) {
  const [walletConnection, setWalletConnection] = useState({});
  const [contract, setContract] = useState({});
  const [near, setNear] = useState({});
  const [account, setAccount] = useState({});
  const [init, setInit] = useState(false);

  const _initContract = async () => {
    const nearConfig = getConfig("testnet");

    const near = await nearAPI.connect({
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
      ...nearConfig,
    });

    const walletConnection = new nearAPI.WalletConnection(near);

    const account = await near.account("testingdo.testnet");

    const contract = await new nearAPI.Contract(
      walletConnection.account(),
      nearConfig.contractName,
      {
        viewMethods: ["nft_token", "nft_tokens_for_owner", "nft_metadata"],
        changeMethods: [],
        sender: walletConnection.getAccountId(),
      }
    );

    return { walletConnection, contract, near, account };
  };

  useEffect(() => {
    if (!init) {
      _initContract().then(({ walletConnection, contract, near, account }) => {
        setWalletConnection(walletConnection);
        setContract(contract);
        setNear(near);
        setAccount(account);
        setInit(true);
      });
    }
  }, [walletConnection]);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#03a9f4" />
        <title>SnipeNear</title>
      </Head>
      <UserContext.Provider
        value={{
          walletConnection: walletConnection,
          contract: contract,
          near: near,
          account: account,
        }}
      >
        {init ? <Component {...pageProps} /> : <p>Loading</p>}
      </UserContext.Provider>
    </React.Fragment>
  );
}
