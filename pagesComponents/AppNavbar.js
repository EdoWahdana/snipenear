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
import { generateAuth } from "../config/utils";
import { prettyTruncate } from "../utils/common";

const TitleEnum = {
  Snipe: "/app",
  MySnipe: "/my-snipe",
};

const AppNavbar = ({ title }) => {
  const router = useRouter();
  const [openNavbar, setOpenNavbar] = useState(false);
  const { walletSelector, walletSelectorObject, accountId } =
    useContext(UserContext);

  const _signOut = async () => {
    if (!walletSelector.isSignedIn()) {
      return;
    }

    await axios.post(
      `${process.env.NEXT_PUBLIC_API}/remove-account-identity`,
      null,
      {
        headers: {
          authorization: await generateAuth(accountId),
        },
      }
    );

    localStorage.removeItem("account_identity");

    await walletSelectorObject.signOut();
    router.replace(process.env.NEXT_PUBLIC_BASE_URL);
  };

  return (
    <Navbar isOpen={openNavbar}>
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
              <Link href="/app" replace={true}>
                <div className="mr-0 md:mr-4">
                  <p
                    className={`${
                      title === TitleEnum.Snipe && "font-bold underline"
                    } font-poppins text-[#CCA8B4] text-lg cursor-pointer hover:text-opacity-80`}
                  >
                    Snipe
                  </p>
                </div>
              </Link>
              <Link href="/my-snipe" replace={true}>
                <div className="font-poppins mr-0 md:mr-4">
                  <p
                    className={`${
                      title === TitleEnum.MySnipe && "font-bold underline"
                    } text-lg text-[#CCA8B4] cursor-pointer hover:text-opacity-80`}
                  >
                    My Snipe
                  </p>
                </div>
              </Link>
              {walletSelector.isSignedIn() && (
                <Link href="/">
                  <div className="font-poppins mr-0 md:mr-4" onClick={_signOut}>
                    <p className="bg-transparent hover:bg-eversnipe-dark-hover transition-colors duration-100 border-2 border-eversnipe py-2 px-4 text-eversnipe font-bold text-lg rounded-lg cursor-pointer">
                      {prettyTruncate(accountId, 18, "address")}
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
