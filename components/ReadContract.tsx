import React from "react";
import Accordion from "./Accordion";
import { abiItem } from "./ReadWriteContract";

type ReadContractProps = {
  contractAddress: `0x${string}`;
  abi: Array<abiItem>;
  isConnected: boolean
};

const ReadContract = ({
  contractAddress,
  abi,
  isConnected
}: ReadContractProps): JSX.Element => {
  return (
    <div className="p-4 pt-0 mx-4">
      {abi?.map((item, index) => {
        return (
          item.type === "function" &&
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
            />
          )
        );
      })}
    </div>
  );
};

export default ReadContract;
