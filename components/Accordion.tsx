import React, { useState } from "react";
import accordionStyles from "../styles/Home.module.css";
import { readContract, writeContract } from "@wagmi/core";
import { polygon, polygonMumbai } from "@wagmi/core/chains";
import { abiItem } from "./ReadWriteContract";
import { isEmpty } from "lodash";
import { formatEther } from "viem";

type InputOutputType = {
  internalType?: string;
  name: string;
  type?: string;
};

type AccordionProps = {
  functionName: string;
  inputs: Array<InputOutputType>;
  outputs: Array<InputOutputType>;
  type: "read" | "write";
  contractAddress: `0x${string}`;
  abi: Array<abiItem>;
  isConnected: boolean;
  selectedChain: string
};

const Accordion = ({
  functionName,
  type,
  abi,
  contractAddress,
  outputs,
  inputs,
  isConnected,
  selectedChain
}: AccordionProps): JSX.Element => {
  const [isOpen, setOpen] = useState<Boolean>(false);
  const [output, setOutput] = useState<BigInt | any>(null);
  const [values, setValues] = useState<{ [key: string]: any }>({});
  const [error, setError] = useState(null);

  const toggle = () => {
    setOpen((isOpen) => !isOpen);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    stateName: string
  ) => {
    setValues((values) => {
      return { ...values, [stateName]: event?.target.value };
    });
  };

  const handleSubmit = async () => {
    try {
      const arguements = !isEmpty(values)
        ? Object.keys(values).map((key) => values[key])
        : [];
      if (type === "read") {
        const rate: any = await readContract({
          address: contractAddress,
          abi: abi,
          functionName: functionName,
          args: arguements,
          chainId:
            selectedChain === "Polygon Mumbai"
              ? polygonMumbai.id
              : polygon.id,
        });
        const convertedRate =
          typeof rate === "bigint" ? formatEther(rate) : rate;
        setOutput(`${convertedRate}`);
      } else if (type === "write") {
        const { hash } = await writeContract({
          address: contractAddress,
          abi: abi,
          functionName: functionName,
          args: arguements,
        });
        const url =
          process.env.NEXT_PUBLIC_ENVIRONMENT === "testnet"
            ? `https://mumbai.polygonscan.com/tx/${hash}`
            : `https://polygonscan.com/tx/${hash}`;
        setOutput(url);
      }
      setError(null);
    } catch (e: any) {
      setError(e.message.replace(/ *Version:.+/gi, ""));
      setOutput(null);
    }
  };

  return (
    <div className={`${accordionStyles.card} shadow-none my-3`}>
      <div
        className={`${accordionStyles.cardHeader} cursor-pointer bg-light card-collapse p-0`}
        onClick={toggle}
      >
        {functionName}
        <span>
          {isOpen ? (
            <svg
              data-accordion-icon
              className="w-6 h-6 rotate-180 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          )}
        </span>
      </div>
      <div
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? "max-h-72 !overflow-auto" : "max-h-0"
        }`}
      >
        <div className="p-3">
          {inputs.length > 0 &&
            inputs.map((item) => (
              <>
                <label>{item?.name}</label>
                <input
                  type="text"
                  className="block w-full mb-[5px] p-[5px] text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={`${item.name} (${item?.type})`}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(event, item.name);
                  }}
                />
              </>
            ))}
          <button
            className="text-white mt-2 disabled:bg-blue-400 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            onClick={handleSubmit}
            disabled={type === "write" && !isConnected}
          >
            Execute
          </button>
          {output !== null && type === "write" && (
            <button className="ml-[10px] text-white mt-2 disabled:bg-blue-400 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
              <a href={output} target="_blank">
                View Transaction
              </a>
            </button>
          )}
        </div>
        {output !== null && type === "read" && (
          <div className="p-3 pt-1 border">
            <label>Response of method</label>
            <br />
            <span>
              {output} {outputs[0].type}
            </span>
          </div>
        )}
        {error !== null && (
          <div className="p-3 pt-1 border">
            <span className="text-red-700">Error: {error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accordion;
