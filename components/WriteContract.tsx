import React from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Accordion from "./Accordion";
import { abiItem } from "./ReadWriteContract";

type WriteContractProps = {
  contractAddress: `0x${string}`;
  abi: Array<abiItem>;
  isConnected: boolean
};

const WriteContract = ({
  contractAddress,
  abi,
  isConnected
}: WriteContractProps): JSX.Element => {
  return (
    <div className="p-4 mx-4">
    <ConnectButton />
      {abi?.map((item, index) => {
        return (
          item.type === "function" &&
          item.stateMutability !== "view" && (
            <Accordion
              key={index}
              type="write"
              functionName={item.name}
              inputs={item.inputs}
              outputs={item.outputs}
              contractAddress={contractAddress}
              abi={abi}
              isConnected={isConnected}
            />
          )
        );
      })}
    </div>
  );
};

export default WriteContract;
