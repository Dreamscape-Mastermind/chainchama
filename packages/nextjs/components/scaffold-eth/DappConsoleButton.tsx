"use client";

import Image from "next/image";
import sunny from "../assets/sunny.svg";

/**
 * FaucetButton button which lets you grab eth.
 */
export const DappConsoleButton = () => {
  const openSuperchainFaucet = () => {
    window.open("https://console.optimism.io/?utm_source=scaffoldop", "_blank");
  };

  return (
    <div className={"ml-1"} data-tip="Enter Dapp Developer Console">
      <button className="btn btn-secondary btn-sm px-2 rounded-full flex-nowrap" onClick={() => openSuperchainFaucet()}>
        <Image alt="Sunny Logo" src={sunny} width={20} height={20} />
        Dapp Console
      </button>
    </div>
  );
};
