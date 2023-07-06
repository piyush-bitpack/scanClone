import React, { useState, useEffect } from "react";
import accordionStyles from "../styles/Home.module.css";
import { readContract } from "@wagmi/core";
import { polygon, mainnet } from "@wagmi/core/chains";
import { abiItem } from "./ReadWriteContract";
import humanizeString from 'humanize-string';
import { utils } from "web3";
import Spinner from './Spinner'

type PrefetchedCardProps = {
  proxyContractAbi: Array<abiItem>;
  contractAbi: Array<abiItem>;
  selectedChain: string;
  contractAddress: `0x${string}`;
};

type InputOutputType = {
  internalType?: string;
  name: string;
  type?: string;
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
  const [loading, setLoading] = useState<boolean>(false);

  const fetchResponse = async (fns: resultDataType[]) => {
    try {
      setLoading(true)
      const response = await Promise.allSettled(
        fns.map(async (item) => {
          return readContract({
            address: contractAddress,
            abi: item.isProxy ? proxyContractAbi : contractAbi,
            functionName: item.functionName,
            chainId: selectedChain === 'Ethereum' ? mainnet.id : polygon.id
              // selectedChain === "Polygon Mumbai"
              //   ? polygonMumbai.id
              //   : (selectedChain === 'Ethereum' ? mainnet.id : polygon.id),
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
      setLoading(false)
    } catch (e) {
      setLoading(false)
      console.log(e);
    }
  };

  useEffect(() => {
    let readFunction: resultDataType[] = [];
    if (proxyContractAbi && proxyContractAbi.length > 0) {
      proxyContractAbi.forEach((item) => {
        if ((item.stateMutability === "view"  || item.stateMutability === "pure") && item.inputs.length === 0) {
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
    <div className="px-4 m-4">
      <div className={`${accordionStyles.card} shadow`}>
        <div className="flex border-b bg-gray-100 border-gray-300 p-2">
        <div className="w-[35%]">Read functions without parameters</div>
        <div className="w-[65%]">Response</div>
        </div>
        {loading ? (
          <div className="p-5 flex justify-center">
        <Spinner />
        </div>
        ) : (
        <ul>
          {result.length > 0 &&
            result.map((item, index) => (
              <li key={index} className="flex p-3 border-b border-gray-300">
                <div className="w-[35%]">
                  {humanizeString(item.functionName)}
                  {item.isProxy ? "*" : null}:
                </div>
                <div className="w-[65%]">{`${item?.value}`}</div>
              </li>
            ))}
        </ul>
        )}
      </div>
    </div>
  );
};

export default PrefetchedCard;
