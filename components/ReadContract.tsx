import React from "react";
import Accordion from "./Accordion";
import { abiItem } from "./ReadWriteContract";

type ReadContractProps = {
  contractAddress: `0x${string}`;
  abi: Array<abiItem>;
  isConnected: boolean;
  fetchedAbi: boolean;
  selectedChain: string
};

const ReadContract = ({
  contractAddress,
  abi,
  isConnected,
  fetchedAbi,
  selectedChain,
}: ReadContractProps): JSX.Element => {
  const readABI = abi.filter((item) => item.stateMutability === "view");
  return fetchedAbi ? (
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
              />
            )
          );
        })
      ) : (
        <span>
          {" "}
          Sorry, there are no available Contract ABI methods to read. Unable to
          read contract info.
        </span>
      )}
    </div>
  ) : (
    <></>
  );
};

export default ReadContract;
