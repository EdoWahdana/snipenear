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

const AppNavbar = () => {
  const [openNavbar, setOpenNavbar] = useState(false);

  return (
    <Navbar>
      <NavbarContainer>
        <NavbarWrapper>
          <NavbarBrand color="white">
            <Link href="/" replace={true}>
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
              <Link href="/profile" replace={true}>
                <div className="font-poppins mr-0 md:mr-4">
                  <p className="text-lg text-[#CCA8B4] cursor-pointer hover:text-opacity-80">
                    Profile
                  </p>
                </div>
              </Link>
            </NavLink>
          </Nav>
        </NavbarCollapse>
      </NavbarContainer>
    </Navbar>
  );
};

export default AppNavbar;