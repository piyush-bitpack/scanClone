import React, { ChangeEvent, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getNetwork, switchNetwork } from "@wagmi/core";
import { polygon, mainnet } from "@wagmi/core/chains";

type SearchFormProps = {
  contract?: string;
  chains?: string;
};

const SearchForm = ({ contract, chains }: SearchFormProps): JSX.Element => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [selectedChain, setSelectedChain] = useState<string>('');
  const router = useRouter();
  const { chain } = getNetwork();

  const changeNetwork = async () => {
    try {
      await switchNetwork({
        chainId: selectedChain === "Polygon" ? polygon.id : mainnet.id,
      });
      router.push(`/`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setContractAddress(event.target.value);
  };

  const handleSubmit = () => {
    let chaindId: number = polygon.id;
    if (selectedChain === "Ethereum") {
      chaindId = mainnet.id;
    }
    if(chaindId && contractAddress) {
      router.push(`/${chaindId}/${contractAddress}`);
    }
  };

  useEffect(() => {
    if (chain && selectedChain !== '' && chain.name !== selectedChain) {
      changeNetwork();
    }
    if(chain && selectedChain === '') {
      setSelectedChain(chain.name)
    }
  }, [chain, selectedChain]);

  useEffect(() => {
    if(chains && contract) {
      setContractAddress(contract);
      setSelectedChain(chains)
    }
  }, [chains, contract])

  return (
    <div className="flex items-center p-4 mx-4">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only"
      >
        Search
      </label>
      <div className="relative flex w-full">
        <select
          onChange={(e) => setSelectedChain(e.target.value)}
          value={selectedChain}
          className="text-sm text-gray-900 p-4 border border-gray-300 rounded-s-lg bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option className="p-3" value="Polygon">
            Polygon
          </option>
          <option className="p-3" value="Ethereum">
            Ethereum
          </option>
        </select>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-e-lg bg-gray-50 focus-visible:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search Contract"
          onChange={handleAddress}
          value={contractAddress}
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchForm;
