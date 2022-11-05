import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import Nav from "components/Nav/Nav";
import Navbar from "components/Navbar/Navbar";
import NavLink from "components/Nav/NavLink";
import NavbarContainer from "components/Navbar/NavbarContainer";
import NavbarWrapper from "components/Navbar/NavbarWrapper";
import NavbarBrand from "components/Navbar/NavbarBrand";
import NavbarCollapse from "components/Navbar/NavbarCollapse";
import UserContext from "../config/context";
import NavbarToggler from "components/Navbar/NavbarToggler";
import axios from "axios";
import { generateAuth } from "../config/utils";
import { useRouter } from "next/router";

export default function IndexNavbar() {
  const router = useRouter();
  const { walletConnection } = useContext(UserContext);

  const [openNavbar, setOpenNavbar] = useState(false);

  const _signIn = async () => {
    await walletConnection.requestSignIn(
      process.env.NEXT_PUBLIC_CONTRACT_ID,
      "SnipeNear",
      `${process.env.NEXT_PUBLIC_BASE_URL}?successLogin=${new Date().getTime()}`
    );
  };

  const _signOut = async () => {
    await unsubscribePushManager();
  };

  const unsubscribePushManager = async () => {
    if (!walletConnection.getAccountId()) {
      return;
    }

    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      serviceWorkerRegistration.pushManager
        .getSubscription()
        .then(async (subscription) => {
          if (!subscription) {
            await walletConnection.signOut();
            router.replace(process.env.NEXT_PUBLIC_BASE_URL);

            return;
          }

          await subscription
            .unsubscribe()
            .then(async (success) => {
              await axios({
                method: "POST",
                data: subscription,
                url: `${process.env.NEXT_PUBLIC_API}/unsubscribe-web-push-notification`,
                headers: {
                  authorization: await generateAuth(walletConnection),
                },
              });
            })
            .then(async () => {
              await walletConnection.signOut();
              router.replace(process.env.NEXT_PUBLIC_BASE_URL);
            })
            .catch((error) => {
              console.error(`Error unsubscribe : ${error}`);
            });
        })
        .catch((err) => {
          console.error(`Error during getSubscription(): ${err}`);
        });
    });
  };

  return (
    <Navbar>
      <NavbarContainer>
        <NavbarWrapper>
          <NavbarBrand color="white">
            <Link href="/" replace={true}>
              <img
                src="snipenear-logo-title.png"
                alt="SnipeNear Logo"
                className="w-48 mr-auto md:w-72 md:mx-auto cursor-pointer"
              />
            </Link>
          </NavbarBrand>
          <NavbarToggler
            onClick={() => setOpenNavbar(!openNavbar)}
            color="snipenear"
          />
        </NavbarWrapper>

        <NavbarCollapse open={openNavbar}>
          <Nav>
            <NavLink ripple="dark">
              {walletConnection.isSignedIn() && (
                <Link href="/">
                  <div className="mr-0 md:mr-4" onClick={_signOut}>
                    <p className="font-poppins font-bold text-[#CCA8B4] text-lg cursor-pointer hover:text-opacity-80">
                      LOGOUT
                    </p>
                  </div>
                </Link>
              )}

              {walletConnection.isSignedIn() ? (
                <Link href="/app">
                  <div className="font-poppins mr-0 md:mr-4">
                    <p className="bg-transparent hover:bg-snipenear-dark-hover transition-colors duration-100 border-2 border-snipenear py-2 px-4 text-snipenear font-bold text-lg rounded-lg cursor-pointer">
                      LAUNCH APP
                    </p>
                  </div>
                </Link>
              ) : (
                <Link href="/">
                  <div
                    className="font-poppins mr-0 md:mr-4"
                    onClick={() => {
                      walletConnection.getAccountId() ? _signOut() : _signIn();
                    }}
                  >
                    {walletConnection.getAccountId() ? (
                      <p className="bg-transparent hover:bg-snipenear-dark-hover transition-colors duration-100 border-2 border-snipenear py-2 px-4 text-snipenear font-bold text-lg rounded-lg cursor-pointer">
                        SIGN OUT
                      </p>
                    ) : (
                      <p className="bg-transparent hover:bg-snipenear-dark-hover transition-colors duration-100 border-2 border-snipenear py-2 px-4 text-snipenear font-bold text-lg rounded-lg cursor-pointer">
                        SIGN IN
                      </p>
                    )}
                  </div>
                </Link>
              )}
            </NavLink>
          </Nav>
        </NavbarCollapse>
      </NavbarContainer>
    </Navbar>
  );
}
