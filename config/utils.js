import {
  connect,
  Contract,
  keyStores,
  WalletConnection,
  InMemorySigner,
} from "near-api-js";
import getConfig from "./near";
import { Base64 } from "js-base64";

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

export async function generateAuth(wallet) {
  if (!wallet) {
    return null;
  }

  if (!wallet.getAccountId) {
    return null;
  }

  try {
    const signer = new InMemorySigner(wallet._keyStore);
    const arr = new Array(wallet.getAccountId());
    for (var i = 0; i < wallet.getAccountId().length; i++) {
      arr[i] = wallet.getAccountId().charCodeAt(i);
    }
    const msgBuf = new Uint8Array(arr);
    const signedMsg = await signer.signMessage(
      msgBuf,
      wallet._authData.accountId,
      wallet._networkId
    );
    const pubKey = Buffer.from(signedMsg.publicKey.data).toString("hex");
    const signature = Buffer.from(signedMsg.signature).toString("hex");
    const payload = [wallet.getAccountId(), pubKey, signature];
    const _authToken = Base64.encode(payload.join("&"));
    return _authToken;
  } catch (err) {
    return null;
  }
}
