import React, { useState } from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { Login } from "../Login/Login";
import { SignUp } from "../SignUp/SignUp";
import { useNavigate } from "react-router-dom";
import betIcon from '../../assets/img/svg/bet-icon.svg'
import walletIcon from '../../assets/img/svg/wallet-icon.svg'
import moneyIcon from '../../assets/img/svg/money-icon.svg'

const Menu = () => {
    const [openNav, setOpenNav] = useState(false);
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const navigate = useNavigate();
    const Logout = () =>{
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
   
    const navList = (
      <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium"
        >
            <img className="w-4" src={moneyIcon}/>
            <a href="/landing" className="flex items-center">
                Apostar
            </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="flex items-center gap-x-2 p-1 font-medium"
        >
          <img className="w-4" src={walletIcon}/>
          <a href="#" className="flex items-center">
            Carteira
          </a>
        </Typography>
      </ul>
    );
   
    return (
      <Navbar className="mx-auto max-w-screen-xl px-4 py-2 lg:px-8 lg:py-4">
        <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
          <Typography
            href="#"
            className="mr-4 cursor-pointer py-1.5 font-lethalforce text-xl"
          >
            <span className="text-green-500">Let's</span> Bet
          </Typography>
          {isAuthenticated ? (<div className="hidden lg:block">{navList}</div>):null}
          {!isAuthenticated ? (
                <div className="items-center gap-1 hidden lg:flex">
                    <Login fw={false}/>
                    <SignUp fw={false}/>
                </div>
            ):(
                <Button         
                variant="gradient"
                size="sm"
                className="hidden lg:flex"
                onClick={()=> Logout()}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
        <MobileNav open={openNav}>
          <div className="container mx-auto">
          {isAuthenticated ? navList : null}
          {!isAuthenticated ? (
            <div className="flex flex-col mt-8 mb-2 items-center gap-y-1">
                <Login fw={true}/>
                <SignUp fw={true}/>
            </div>
            ) : (<Button         
                    variant="gradient"
                    size="sm"
                    className=""
                    fullWidth
                    onClick={()=> Logout()}
                >
                Sair
                </Button>)
            }
          </div>
        </MobileNav>
      </Navbar>
    );
}

export default Menu;