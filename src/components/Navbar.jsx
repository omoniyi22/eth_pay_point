import React, { useContext } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiFillPlayCircle } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";

import logo from "../../images/logo.svg";
import { TransactionContext } from "../context/TransactionContext";

const NavBarItem = ({ title, classprops }) => (
  <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

const Navbar = () => {

  const { disconnectWallet, connectWallet, currentAccount } = useContext(TransactionContext);

  const [toggleMenu, setToggleMenu] = React.useState(false);

  return (
    <nav className="w-full flex md:justify-center justify-between items-center pt-0 sm:w-full  p-0">
      <div className=" flex flex-row justify-between px-4  md:w-[80%] xs:w-[94%] w-[100%] mx-auto h-[150px]">

        <div className="justify-center -ml-[50px]  bt:ml-0 items-center  px-0 mr-auto max-xs:-m-[10%] ">
          <img src={logo} alt="logo" className="w-44 ursor-pointer ml-0  py-0 h-[150px]" />
        </div>

        <ul className=" justify-center my-auto items-center   max-w-fit  bt:mr-28">
          {/* {["Market", "Exchange", "Wallets"].map((item, index) => (
          <NavBarItem key={item + index} title={item} />
        ))} */}
          {currentAccount ? <li className="flex flex-row justify-center items-center my-5 bg-[#1e0a2880] p-3 px-5 rounded-lg cursor-pointer hover:bg-[#1e0a2895] text-white "
            onClick={disconnectWallet}>
            Disconnect
          </li> :
            <button
              type="button"
              onClick={connectWallet}
              className="flex flex-row justify-center items-center my-5 bg-[#1e0a2880] p-3 px-5 rounded-lg cursor-pointer hover:bg-[#1e0a2895]"
            >
              <p className="text-white text-base font-semibold">
                Connect Wallet
              </p>
            </button>

          }
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;