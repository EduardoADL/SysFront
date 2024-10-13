import React, { useState } from "react";
import {
  Navbar,
  Typography,
  IconButton,
  Button,
  Collapse,
} from "@material-tailwind/react";
import { Login } from "../Login/Login";
import { SignUp } from "../SignUp/SignUp";
import { useNavigate } from "react-router-dom";
import { useBalance } from "../../context/useBalance";
import { formatCurrency } from "../../utils/formatCurrency";

const Menu = () => {
  const [openNav, setOpenNav] = useState(false);
  const { balance } = useBalance();
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.setItem('isAuthenticated', '');
    localStorage.removeItem('token');
    navigate('/');
  }

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-xl px-4 py-2 bg-opacity-100 mt-4 w-10/12 ">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Typography
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-lethalforce text-xs lg:text-xl"
        >
          <span className="text-green-500">Let's</span> Bet
        </Typography>
        {isAuthenticated ? (
        <Typography
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-normal text-xs lg:text-xl"
        >
          <span className="text-green-500">SALDO:</span> {formatCurrency(balance)}
        </Typography>) : null}
        {!isAuthenticated ? (
          <div className="items-center gap-1 hidden lg:flex">
            <Login fw={false} />
            <SignUp fw={false} />
          </div>
        ) : (
          <Button
            variant="gradient"
            size="sm"
            className="hidden lg:flex"
            onClick={() => Logout()}
          >
            Sair
          </Button>
        )}

        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)">
              <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="#0F0F0F" />
            </svg>
          ) : (
            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z" fill="#0F0F0F" />
            </svg>
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">
          {!isAuthenticated ? (
            <div className="flex flex-col mt-8 mb-2 items-center gap-y-1">
              <Login fw={true} />
              <SignUp fw={true} />
            </div>
          ) : (<Button
            variant="gradient"
            size="sm"
            className=""
            fullWidth
            onClick={() => Logout()}
          >
            Sair
          </Button>)
          }
        </div>
      </Collapse>
    </Navbar>
  );
}

export default Menu;