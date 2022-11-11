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
  const { walletSelector, walletSelectorObject, accountId, signInModal } =
    useContext(UserContext);

  const [openNavbar, setOpenNavbar] = useState(false);

  const _signIn = async () => {
    signInModal.show();
  };

  const _signOut = async () => {
    unsubscribePushManager();
  };

  const unsubscribePushManager = async () => {
    if (!walletSelector.isSignedIn()) {
      return;
    }

    try {
      navigator.serviceWorker
        .register("/_worker.js")
        .then(async (serviceWorkerRegistration) => {
          await serviceWorkerRegistration.unregister();

          const subscription =
            await serviceWorkerRegistration.pushManager.getSubscription();

          if (!subscription) {
            await walletSelectorObject.signOut();
            router.replace(process.env.NEXT_PUBLIC_BASE_URL);

            return;
          }

          await subscription
            .unsubscribe()
            .then(async () => {
              await axios({
                method: "POST",
                data: subscription,
                url: `${process.env.NEXT_PUBLIC_API}/unsubscribe-web-push-notification`,
                headers: {
                  authorization: await generateAuth(accountId),
                },
              });
            })
            .then(async () => {
              await walletSelectorObject.signOut();
              router.replace(process.env.NEXT_PUBLIC_BASE_URL);
            })
            .catch((error) => {
              console.error("UNSUBSCRIBE ERR : ", error);
            });
        });
    } catch (err) {
      console.error("GET SUBSCRIPTION ERR : ", err);
    }
  };

  return (
    <Navbar>
      <NavbarContainer>
        <NavbarWrapper>
          <NavbarBrand color="white">
            <Link href="/" replace={true}>
              <img
                src="eversnipe-logo-title.png"
                alt="EverSnipe Logo"
                className="w-48 mr-auto md:w-72 md:mx-auto cursor-pointer"
              />
            </Link>
          </NavbarBrand>
          <NavbarToggler
            onClick={() => setOpenNavbar(!openNavbar)}
            color="eversnipe"
          />
        </NavbarWrapper>

        <NavbarCollapse open={openNavbar}>
          <Nav>
            <NavLink ripple="dark">
              {walletSelector.isSignedIn() && (
                <Link href="/">
                  <div className="mr-0 md:mr-4" onClick={_signOut}>
                    <p className="font-poppins font-bold text-[#CCA8B4] text-lg cursor-pointer hover:text-opacity-80">
                      LOGOUT
                    </p>
                  </div>
                </Link>
              )}

              {walletSelector.isSignedIn() ? (
                <Link href="/app">
                  <div className="font-poppins mr-0 md:mr-4">
                    <p className="bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe py-2 px-4 text-eversnipe font-bold text-lg rounded-lg cursor-pointer">
                      LAUNCH APP
                    </p>
                  </div>
                </Link>
              ) : (
                <Link href="/">
                  <div
                    className="font-poppins mr-0 md:mr-4"
                    onClick={() => {
                      walletSelector.isSignedIn() ? _signOut() : _signIn();
                    }}
                  >
                    {walletSelector.isSignedIn() ? (
                      <p className="bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe py-2 px-4 text-eversnipe font-bold text-lg rounded-lg cursor-pointer">
                        SIGN OUT
                      </p>
                    ) : (
                      <p className="bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe py-2 px-4 text-eversnipe font-bold text-lg rounded-lg cursor-pointer">
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
