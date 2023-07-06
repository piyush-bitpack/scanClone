import React from "react";
import Accordion from "./Accordion";
import { abiItem } from "./ReadWriteContract";

type ReadContractProps = {
  contractAddress: `0x${string}`;
  abi: Array<abiItem>;
  isConnected: boolean;
  selectedChain: string
  isProxy?: boolean
};

const ReadContract = ({
  contractAddress,
  abi,
  isConnected,
  selectedChain,
  isProxy
}: ReadContractProps): JSX.Element => {
  const readABI = abi.filter((item) => item.stateMutability === "view" && item.inputs.length > 0);
  return (
    <div className="p-4 pt-0 mx-4">
      {readABI.length > 0 ? (
        readABI.map((item, index) => {
          return (
            item.stateMutability === "view" && (
              <Accordion
                key={index}
                type="read"
                functionName={item.name}
                inputs={item.inputs}
                outputs={item.outputs}
                contractAddress={contractAddress}
                abi={abi}
                isConnected={isConnected}
                selectedChain={selectedChain}
                isProxy={isProxy}
              />
            )
          );
        })
      ) : null}
    </div>
  );
};

export default ReadContract;
