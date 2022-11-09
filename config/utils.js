import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  InMemorySigner,
} from "near-api-js";
import getConfig from "./near";
import { Base64 } from "js-base64";
import sha256 from "js-sha256";
import { providers } from 'near-api-js';

const nearConfig = getConfig(process.env.NODE_ENV || "development");

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId();

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: ["get_greeting"],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: ["set_greeting"],
    }
  );
}

export function logout() {
  window.walletConnection.signOut();
  // reload page
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName);
}

export async function generateAuth(accountId) {
  if (!accountId) {
    return null;
  }

  try {
    const arr = new Array(accountId);
    for (var i = 0; i < accountId.length; i++) {
      arr[i] = accountId.charCodeAt(i);
    }
    const msgBuf = new Uint8Array(arr);
    const signedMsg = await signMessage(
      msgBuf,
      accountId,
      process.env.NEXT_PUBLIC_APP_ENV
    );
    const pubKey = Buffer.from(signedMsg.publicKey.data).toString("hex");
    const signature = Buffer.from(signedMsg.signature).toString("hex");
    const payload = [accountId, pubKey, signature];
    const _authToken = Base64.encode(payload.join("&"));
    return _authToken;
  } catch (err) {
    return null;
  } 

  async function signMessage(message, accountId, networkId) {
    const _keyStore = new keyStores.BrowserLocalStorageKeyStore();

    const hash = new Uint8Array(sha256.sha256.array(message));
    if (!accountId) {
      throw new Error("InMemorySigner requires provided account id");
    }
    const keyPair = await _keyStore.getKey(networkId, accountId);
    if (keyPair === null) {
      throw new Error(`Key for ${accountId} not found in ${networkId}`);
    }
    return keyPair.sign(hash);
  }
}

 export async function viewMethod(contractId, method, args = {}) {
    const network = getConfig(process.env.NEXT_PUBLIC_APP_ENV);
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    let res = await provider.query({
      request_type: "call_function",
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
      finality: "optimistic",
    });
    return JSON.parse(Buffer.from(res.result).toString());
  }
