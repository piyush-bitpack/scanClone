import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Accordion from "./Accordion";
import { abiItem } from "./ReadWriteContract";

type WriteContractProps = {
  contractAddress: `0x${string}`;
  abi: Array<abiItem>;
  isConnected: boolean;
  fetchedAbi: boolean;
  selectedChain: string
};

const WriteContract = ({
  contractAddress,
  abi,
  isConnected,
  fetchedAbi,
  selectedChain,
}: WriteContractProps): JSX.Element => {
  const writeAbi = abi.filter((item) => item.stateMutability !== "view");
  return fetchedAbi ? (
    <div className="p-4 mx-4">
      <ConnectButton showBalance={false} chainStatus="none" />
      {writeAbi.length > 0 ? (
        writeAbi?.map((item, index) => {
          return (
            <Accordion
              key={index}
              type="write"
              functionName={item.name}
              inputs={item.inputs}
              outputs={item.outputs}
              contractAddress={contractAddress}
              abi={abi}
              isConnected={isConnected}
              selectedChain={selectedChain}
            />
          );
        })
      ) : (
        <span>
          {" "}
          Sorry, there are no available Contract ABI methods to write. Unable to
          write contract info.
        </span>
      )}
    </div>
  ) : (
    <></>
  );
};

export default WriteContract;
