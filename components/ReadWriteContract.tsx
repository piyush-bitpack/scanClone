import React, { useState, ChangeEvent, useEffect } from "react";
import { getNetwork, switchNetwork } from '@wagmi/core'
import { polygon, polygonMumbai } from "@wagmi/core/chains";
import { useAccount } from "wagmi";
import web3 from "web3";
import SearchForm from "./SearchForm";
import ReadContract from "./ReadContract";
import WriteContract from "./WriteContract";

export type abiItem = {
  type: string;
  stateMutability: string;
  inputs: [];
  name: string;
  outputs: [];
};

type tabType = "read" | "write" | "proxyRead" | "proxyWrite"

type contractAddressType = `0x${string}`;

const ReadWriteContract = (): JSX.Element => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [proxyContractAddress, setProxyContractAddress] = useState<string>("");
  const [contractAbi, setContractAbi] = useState<Array<abiItem>>([]);
  const [proxyContractAbi, setProxyContractAbi] = useState<Array<abiItem>>([]);
  const [activeTab, setActiveTab] = useState<tabType>("read");
  const [fetchedAbi, setFetchedAbi] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState<string>('Polygon');

  const { isConnected } = useAccount();

  const { chain } = getNetwork()

  const changeNetwork = async () => {
    try {
      await switchNetwork({
        chainId: selectedChain === 'Polygon' ? polygon.id : polygonMumbai.id,
      })
    } catch (e) {
      console.log(e)
    }
  }

  const clearState = () => {
    setFetchedAbi(false)
    setActiveTab('read');
    setContractAbi([])
    setProxyContractAbi([])
  }

  useEffect(() => {
    if (chain && chain.name !== selectedChain) {
      changeNetwork()
    }
  }, [chain, selectedChain])

  const handleAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setContractAddress(event.target.value);
  };

  const fetchImplementContract = async (proxyContract: contractAddressType) => {
    const providerURL =
    selectedChain === "Polygon Mumbai"
        ? process.env.NEXT_PUBLIC_PROVIDER_URL_TESTNET
        : process.env.NEXT_PUBLIC_PROVIDER_URL;
    const web3Instance = new web3(
      new web3.providers.HttpProvider(providerURL as string)
    );
    const storage = await web3Instance.eth.getStorageAt(
      proxyContract as string,
      "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
    );
    const address = storage.replace("x000000000000000000000000", "x");
    if (web3Instance.utils.toNumber(address)) {
      setProxyContractAddress(address);
      await fetchAbi(address, "proxy");
    }
  };

  const fetchAbi = async (
    contractAddress: string,
    type: "base" | "proxy" = "base"
  ) => {
    try {
      if (contractAddress) {
        const key = process.env.NEXT_PUBLIC_POLYGON_SCAN_API_KEY;
        const baseUrl =
          selectedChain === "Polygon Mumbai"
            ? process.env.NEXT_PUBLIC_POLYGON_SCAN_BASE_URL_TESTNET
            : process.env.NEXT_PUBLIC_POLYGON_SCAN_BASE_URL;
        const res = await fetch(
          `${baseUrl}?module=contract&action=getabi&address=${contractAddress}&apikey=${key}`
        );
        const data = await res.json();
        if (data.message === "OK") {
          const abi = data.result;
          if (abi) {
            const parsedABI: Array<abiItem> = JSON.parse(abi);
            const filteredABI = parsedABI.filter(
              (item) => item.type === "function"
            );
            if (type === "base") {
              setContractAbi(filteredABI);
            } else {
              setProxyContractAbi(filteredABI);
            }
          }
        } else {
          setError(data.result);
        }
      }
      setFetchedAbi(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async () => {
    clearState();
    fetchAbi(contractAddress);
    fetchImplementContract(contractAddress as contractAddressType);
  };

  return (
    <>
      <SearchForm
        setSelectedChain={setSelectedChain}
        handleAddress={handleAddress}
        fetchAbi={handleSubmit}
        selectedChain={selectedChain}
      />
      {error && <span className="px-4 m-4 text-red-700">{error}</span>}
      <div className="flex items-center px-4 mx-4">
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
          <li className="mr-2">
            <button
              className={`text-black inline-block p-4 hover:bg-gray-50 rounded-t-lg ${
                activeTab === "read" ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveTab("read")}
            >
              Read
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`text-black inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ${
                activeTab === "write" ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveTab("write")}
            >
              Write
            </button>
          </li>
          {proxyContractAbi.length > 0 && (
            <>
              <li className="mr-2">
                <button
                  className={`text-black inline-block p-4 hover:bg-gray-50 rounded-t-lg ${
                    activeTab === "proxyRead" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setActiveTab("proxyRead")}
                >
                  Read as Proxy
                </button>
              </li>
              <li className="mr-2">
                <button
                  className={`text-black inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ${
                    activeTab === "proxyWrite" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setActiveTab("proxyWrite")}
                >
                  Write as Proxy
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
      {activeTab === "write" && (
        <WriteContract
          abi={contractAbi}
          contractAddress={contractAddress as `0x${string}`}
          isConnected={isConnected}
          fetchedAbi={fetchedAbi}
          selectedChain={selectedChain}
        />
      )}
      {activeTab === "read" && (
        <ReadContract
          abi={contractAbi}
          contractAddress={contractAddress as `0x${string}`}
          isConnected={isConnected}
          fetchedAbi={fetchedAbi}
          selectedChain={selectedChain}
        />
      )}
      {activeTab === "proxyWrite" && (
        <WriteContract
          abi={proxyContractAbi}
          contractAddress={proxyContractAddress as `0x${string}`}
          isConnected={isConnected}
          fetchedAbi={fetchedAbi}
          selectedChain={selectedChain}
        />
      )}
      {activeTab === "proxyRead" && (
        <ReadContract
          abi={proxyContractAbi}
          contractAddress={proxyContractAddress as `0x${string}`}
          isConnected={isConnected}
          fetchedAbi={fetchedAbi}
          selectedChain={selectedChain}
        />
      )}
    </>
  );
};

export default ReadWriteContract;
