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
import { providers } from "near-api-js";

const THIRTY_TGAS = "30000000000000";
const NO_DEPOSIT = "0";

export default function MyApp({ Component, pageProps }) {
  const [walletConnection, setWalletConnection] = useState({});
  const [contract, setContract] = useState({});
  const [near, setNear] = useState({});
  const [account, setAccount] = useState({});
  const [init, setInit] = useState(false);
  const [walletSelector, setWalletSelector] = useState({});
  const [initWalletSelector, setInitWalletSelector] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [walletSelectorObject, setWalletSelectorObject] = useState({});
  const [signInModal, setSignInModal] = useState(null);

  const _initWallet = async () => {
    const selector = await setupWalletSelector({
      network: process.env.NEXT_PUBLIC_APP_ENV,
      debug: true,
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
        viewMethods: [],
        changeMethods: [],
        sender: walletConnection.getAccountId(),
      }
    );

    return { walletConnection, contract, near, account };
  };

  const callMethod = async ({
    contractId,
    method,
    args = {},
    gas = THIRTY_TGAS,
    deposit = NO_DEPOSIT,
  }) => {
    // Sign a transaction with the "FunctionCall" action
    const outcome = await walletSelector.signAndSendTransaction({
      signerId: accountId,
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });

    return providers.getTransactionLastResult(outcome);
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

    if (!initWalletSelector) {
      _initWallet().then(({ selector, wallet, accountIdWallet, modal }) => {
        setWalletSelector(selector);
        setWalletSelectorObject(wallet);
        setAccountId(accountIdWallet);
        setSignInModal(modal);
        setInitWalletSelector(true);
      });
    }
  }, [walletConnection, walletSelector]);

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
