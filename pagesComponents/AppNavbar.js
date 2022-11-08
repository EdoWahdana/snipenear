import React, { useState, useContext } from "react";
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
import { useRouter } from "next/router";
import axios from "axios";

const AppNavbar = () => {
  const router = useRouter();
  const [openNavbar, setOpenNavbar] = useState(false);
  const { walletSelector, walletSelectorObject, accountId } =
    useContext(UserContext);

  const _signOut = async () => {
    await unsubscribePushManager();
  };

  const unsubscribePushManager = async () => {
    if (!walletSelector.isSignedIn()) {
      return;
    }

    try {
      navigator.serviceWorker
        .register("/_worker.js")
        .then(async (serviceWorkerRegistration) => {
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
                  authorization: await generateAuth(
                    accountId,
                    walletSelectorObject
                  ),
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
              <Link href="/app" replace={true}>
                <div className="mr-0 md:mr-4">
                  <p
                    className={`font-poppins text-[#CCA8B4] text-lg cursor-pointer hover:text-opacity-80`}
                  >
                    Snipe
                  </p>
                </div>
              </Link>
              <Link href="/my-snipe" replace={true}>
                <div className="font-poppins mr-0 md:mr-4">
                  <p className="text-lg text-[#CCA8B4] cursor-pointer hover:text-opacity-80">
                    My Snipe
                  </p>
                </div>
              </Link>
              {walletSelector.isSignedIn() && (
                <Link href="/">
                  <div className="font-poppins mr-0 md:mr-4" onClick={_signOut}>
                    <p className="bg-transparent hover:bg-snipenear-dark-hover transition-colors duration-100 border-2 border-snipenear py-2 px-4 text-snipenear font-bold text-lg rounded-lg cursor-pointer">
                      SIGN OUT
                    </p>
                  </div>
                </Link>
              )}
            </NavLink>
          </Nav>
        </NavbarCollapse>
      </NavbarContainer>
    </Navbar>
  );
};

export default AppNavbar;
