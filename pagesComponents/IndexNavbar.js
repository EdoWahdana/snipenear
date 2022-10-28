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

export default function IndexNavbar() {
  const [openNavbar, setOpenNavbar] = useState(false);
  const { walletConnection, contract, near } = useContext(UserContext);

  const _signIn = async () => {
    await walletConnection.requestSignIn(contract, "NEARGotchi");
  };

  const _signOut = async () => {
    await walletConnection.signOut();
    location.reload();
  };

  return (
    <Navbar>
      <NavbarContainer>
        <NavbarWrapper>
          <NavbarBrand color="white">
            <Link href="/">
              <img
                src="snipenear-logo-title.png"
                alt="Material Tailwind Logo"
                className="w-32 mr-auto md:w-72 md:mx-auto cursor-pointer"
              />
            </Link>
          </NavbarBrand>
          <NavbarToggler
            onClick={() => setOpenNavbar(!openNavbar)}
            ripple="dark"
            color="green"
          />
        </NavbarWrapper>

        <NavbarCollapse open={openNavbar}>
          <Nav>
            <NavLink ripple="dark">
              <Link href="#roadmap">
                <div className="mr-0 md:mr-4">
                  <p className="font-poppins font-bold text-[#CCA8B4] text-lg cursor-pointer hover:text-opacity-80">
                    Home
                  </p>
                </div>
              </Link>
              <Link href="#team">
                <div className="font-poppins mr-0 md:mr-4">
                  <p className="text-lg text-[#CCA8B4] cursor-pointer hover:text-opacity-80">
                    GITHUB
                  </p>
                </div>
              </Link>
              <Link href="#faq">
                <div className="font-poppins mr-0 md:mr-4">
                  <p
                    href="#faq"
                    className="text-lg text-[#CCA8B4] cursor-pointer hover:text-opacity-80"
                  >
                    ABOUT
                  </p>
                </div>
              </Link>
              <Link href="https://app.snipenear.xyz">
                <div className="font-poppins mr-0 md:mr-4">
                  <p className="bg-transparent hover:bg-snipenear-dark-hover transition-colors duration-100 border-2 border-snipenear py-2 px-4 text-snipenear font-bold text-lg rounded-lg cursor-pointer">
                    LAUNCH APP
                  </p>
                </div>
              </Link>
              {/* {walletConnection.isSignedIn() && (
                <Link href="/nft">
                  <div className="text-white text-lg font-poppins cursor-pointer mr-0 md:mr-4">
                    {walletConnection.isSignedIn() && <p>MY NFTS</p>}
                  </div>
                </Link>
              )} */}
            </NavLink>
          </Nav>
        </NavbarCollapse>
      </NavbarContainer>
    </Navbar>
  );
}
