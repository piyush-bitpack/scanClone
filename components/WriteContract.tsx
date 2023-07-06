import React from "react";
import Accordion from "./Accordion";
import { abiItem } from "./ReadWriteContract";

type WriteContractProps = {
  contractAddress: `0x${string}`;
  abi: Array<abiItem>;
  isConnected: boolean;
  selectedChain: string
  isProxy?: boolean
  ownerOnlyFunctions: Array<string>
  adminOnly?: boolean
};

const WriteContract = ({
  contractAddress,
  abi,
  isConnected,
  selectedChain,
  isProxy,
  ownerOnlyFunctions,
  adminOnly
}: WriteContractProps): JSX.Element => {
  const writeAbi = abi.filter((item) => item.stateMutability !== "view" && (adminOnly ? ownerOnlyFunctions.includes(item.name) : !ownerOnlyFunctions.includes(item.name)));
  return (
    <div className="p-4 pt-2 mx-4">
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
              isProxy={isProxy}
            />
          );
        })
      ) : null}
    </div>
  )
};

export default WriteContract;
