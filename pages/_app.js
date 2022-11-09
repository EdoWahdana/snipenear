import React from "react";
import Head from "next/head";
import "material-icons/css/material-icons.min.css";
import "assets/styles/index.css";
import * as nearAPI from "near-api-js";
import getConfig from "../config/near";
import UserContext from "../config/context";
import { useEffect, useState } from "react";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
import MyNearIconUrl from "@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png";

export default function MyApp({ Component, pageProps }) {
  const [walletSelector, setWalletSelector] = useState({});
  const [initWalletSelector, setInitWalletSelector] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [walletSelectorObject, setWalletSelectorObject] = useState({});
  const [signInModal, setSignInModal] = useState(null);

  const _initWallet = async () => {
    const selector = await setupWalletSelector({
      network: process.env.NEXT_PUBLIC_APP_ENV,
      modules: [
        setupNearWallet(),
        setupMyNearWallet({ iconUrl: MyNearIconUrl }),
      ],
    });
    const modal = setupModal(selector, {
      contractId: process.env.NEXT_PUBLIC_SNIPE_CONTRACT_ID,
      description: "Please connect your wallet",
    });

    const isSignedIn = selector.isSignedIn();

    let wallet;
    let accountIdWallet;

    if (isSignedIn) {
      wallet = await selector.wallet();
      accountIdWallet = selector.store.getState().accounts[0].accountId;
    }

    return { selector, wallet, accountIdWallet, modal };
  };

  useEffect(() => {
    if (!initWalletSelector) {
      _initWallet().then(({ selector, wallet, accountIdWallet, modal }) => {
        setWalletSelector(selector);
        setWalletSelectorObject(wallet);
        setAccountId(accountIdWallet);
        setSignInModal(modal);
        setInitWalletSelector(true);
      });
    }
  }, [walletSelector]);

  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#03a9f4" />
        <title>EverSnipe</title>
      </Head>
      <UserContext.Provider
        value={{
          walletSelector: walletSelector,
          walletSelectorObject: walletSelectorObject,
          accountId: accountId,
          signInModal: signInModal,
        }}
      >
        {initWalletSelector ? <Component {...pageProps} /> : <p>Loading</p>}
      </UserContext.Provider>
    </React.Fragment>
  );
}
