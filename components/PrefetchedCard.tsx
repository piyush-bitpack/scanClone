import React, { useState, useEffect } from "react";
import Link from "next/link";
import accordionStyles from "../styles/Home.module.css";
import { readContract } from "@wagmi/core";
import { polygon, mainnet } from "@wagmi/core/chains";
import { abiItem } from "./ReadWriteContract";
import humanizeString from "humanize-string";
import { formatNumber } from "./getOwnerFunction";
import { utils } from "web3";
import Spinner from "./Spinner";

type PrefetchedCardProps = {
  proxyContractAbi: Array<abiItem>;
  contractAbi: Array<abiItem>;
  selectedChain: string;
  contractAddress: `0x${string}`;
};

type creatorType = {
  contractAddress: string;
  contractCreator: string;
  txHash: string;
};

type InputOutputType = {
  internalType?: string;
  name: string;
  type: string;
};

type resultDataType = {
  isProxy: boolean;
  functionName: string;
  output: Array<InputOutputType>;
  value?: any;
};

const PrefetchedCard = ({
  proxyContractAbi,
  contractAbi,
  selectedChain,
  contractAddress,
}: PrefetchedCardProps): JSX.Element => {
  const [result, setResult] = useState<Array<resultDataType>>([]);
  const [creator, setCreator] = useState<Array<creatorType>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const numberFormatUnits = [
    "uint256",
    "uint128",
    "uint64",
    "uint32",
    "number",
    "bigint",
  ];

  const fetchCreator = async (address: `0x${string}`) => {
    try {
      const response = await fetch(
        `/api/fetchcreators?selectedChain=${selectedChain}&contractAddress=${address}`
      );
      const parsedResponse = await response.json();
      const data = parsedResponse.data;
      if (data.message === "OK") {
        setCreator(data.result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchResponse = async (fns: resultDataType[]) => {
    try {
      setLoading(true);
      const response = await Promise.allSettled(
        fns.map(async (item) => {
          return readContract({
            address: contractAddress,
            abi: item.isProxy ? proxyContractAbi : contractAbi,
            functionName: item.functionName,
            chainId: selectedChain === "Ethereum" ? mainnet.id : polygon.id,
          }).then((res) => {
            return {
              ...item,
              value:
                typeof res === "bigint"
                  ? res.toString()
                  : item.output[0].type === "bytes"
                  ? utils.hexToAscii(res as string)
                  : res,
            };
          });
        })
      );
      const results: resultDataType[] = [];
      response.forEach((item) => {
        if (item.status === "fulfilled") {
          results.push(item.value);
        }
      });
      setResult(results);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  useEffect(() => {
    if (contractAddress) fetchCreator(contractAddress);
    let readFunction: resultDataType[] = [];
    if (proxyContractAbi && proxyContractAbi.length > 0) {
      proxyContractAbi.forEach((item) => {
        if (
          (item.stateMutability === "view" ||
            item.stateMutability === "pure") &&
          item.inputs.length === 0
        ) {
          readFunction.push({
            functionName: item.name,
            isProxy: true,
            output: item.outputs,
          });
        }
      });
    }
    if (contractAbi && contractAbi.length > 0) {
      contractAbi.forEach((item) => {
        if (item.stateMutability === "view" && item.inputs.length === 0) {
          readFunction.push({
            functionName: item.name,
            isProxy: false,
            output: item.outputs,
          });
        }
      });
    }
    if (readFunction.length > 0) fetchResponse(readFunction);
  }, [proxyContractAbi, contractAbi]);

  return (
    <>
      <div className="px-4 m-4">
        <div
          className={`${accordionStyles.card} dark:!border-gray-600 dark:bg-gray-700 shadow`}
        >
          <div className="border-b bg-gray-100 border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
            <div className="w-[45%]">Contract Info</div>
          </div>
          {loading ? (
            <div className="p-5 flex justify-center dark:bg-gray-700 ">
              <Spinner />
            </div>
          ) : (
            <ul>
              {creator.length > 0 && (
                <li className="flex p-3 border-b border-gray-300 dark:text-white dark:bg-gray-700 dark:border-gray-600">
                  <div className="w-[45%]">Contract Creator:</div>
                  <div className="w-[55%]">
                    <Link
                      className="mr-[2px] underline text-blue-500"
                      href={
                        selectedChain === "Ethereum"
                          ? `https://polygonscan.com/address/${creator[0].contractCreator}`
                          : `https://etherscan.io/address/${creator[0].contractCreator}`
                      }
                    >
                      {creator[0].contractCreator}
                    </Link>
                    <span>at txn </span>
                    <Link
                      className="ml-[2px] underline text-blue-500"
                      href={
                        selectedChain === "Ethereum"
                          ? `https://polygonscan.com/tx/${creator[0].txHash}`
                          : `https://etherscan.io/tx/${creator[0].txHash}`
                      }
                    >
                      {creator[0].txHash}
                    </Link>
                  </div>
                </li>
              )}
              {result.length > 0 &&
                result.map(
                  (item, index) =>
                    item.functionName === "name" && (
                      <li
                        key={index}
                        className="flex p-3 border-b border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <div className="w-[45%]">Token Tracker:</div>
                        <div className="w-[55%]">{`${item?.value}`}</div>
                      </li>
                    )
                )}
            </ul>
          )}
        </div>
      </div>
      <div className="px-4 m-4 dark:text-white">
        <div
          className={`${accordionStyles.card} dark:!border-gray-600 dark:bg-gray-700 shadow`}
        >
          <div className="flex border-b bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 border-gray-300 p-2">
            <div className="w-[45%]">Read functions without parameters</div>
            <div className="w-[55%]">Response</div>
          </div>
          {loading ? (
            <div className="p-5 flex justify-center dark:bg-gray-700 ">
              <Spinner />
            </div>
          ) : (
            <ul>
              {result.length > 0 &&
                result.map((item, index) => (
                  <li
                    key={index}
                    className="flex p-3 border-b border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <div className="w-[45%]">
                      {humanizeString(item.functionName)}
                      {item.isProxy ? "*" : null}:
                    </div>
                    <div className="w-[55%]">{`${
                      numberFormatUnits.includes(item.output[0].type)
                        ? formatNumber(item?.value)
                        : item?.value
                    }`}</div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default PrefetchedCard;
