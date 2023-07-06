import React, { useState, ChangeEvent, useEffect } from "react";
import { getNetwork, switchNetwork } from "@wagmi/core";
import { polygon, polygonMumbai } from "@wagmi/core/chains";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import web3 from "web3";
import SearchForm from "./SearchForm";
import ReadContract from "./ReadContract";
import WriteContract from "./WriteContract";
import PrefetchedCard from "./PrefetchedCard";
import { getOnlyOwnerFunctions } from "./getOwnerFunction";

export type abiItem = {
  type: string;
  stateMutability: string;
  inputs: [];
  name: string;
  outputs: [];
};

type tabType = "read" | "write" | "Admin";

type contractAddressType = `0x${string}`;

const ReadWriteContract = (): JSX.Element => {
  const [contractAddress, setContractAddress] = useState<string>("");
  const [proxyContractAddress, setProxyContractAddress] = useState<string>("");
  const [contractAbi, setContractAbi] = useState<Array<abiItem>>([]);
  const [proxyContractAbi, setProxyContractAbi] = useState<Array<abiItem>>([]);
  const [activeTab, setActiveTab] = useState<tabType>("read");
  const [error, setError] = useState<string>("");
  const [ownerOnlyFunctions, setOwnerOnlyFunctions] = useState<Array<string>>([]);
  const [selectedChain, setSelectedChain] = useState<string>("Polygon");

  const { isConnected } = useAccount();

  const { chain } = getNetwork();

  const changeNetwork = async () => {
    try {
      await switchNetwork({
        chainId: selectedChain === "Polygon" ? polygon.id : polygonMumbai.id,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const clearState = () => {
    setActiveTab("read");
    setContractAbi([]);
    setProxyContractAbi([]);
    setError("");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/index.iife.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("loaded");
    };
  }, []);

  useEffect(() => {
    if (chain && chain.name !== selectedChain) {
      changeNetwork();
    }
  }, [chain, selectedChain]);

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
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async () => {
    clearState();
    fetchAbi(contractAddress);
    fetchImplementContract(contractAddress as contractAddressType);
    const ownerOnlyFunctions: any = await getOnlyOwnerFunctions(
      contractAddress as contractAddressType,
      selectedChain
    );
    if (ownerOnlyFunctions.length > 0) {
      setOwnerOnlyFunctions(ownerOnlyFunctions);
    }
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
      <PrefetchedCard
        proxyContractAbi={proxyContractAbi}
        contractAbi={contractAbi}
        selectedChain={selectedChain}
        contractAddress={contractAddress as contractAddressType}
      />
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
          {ownerOnlyFunctions.length > 0 && (
            <>
              <li className="mr-2">
                <button
                  className={`text-black inline-block p-4 hover:bg-gray-50 rounded-t-lg ${
                    activeTab === "Admin" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setActiveTab("Admin")}
                >
                  Admin Functions
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
      {activeTab === "write" && (
        <>
          <div className="pt-2 pl-4 mx-4">
            <ConnectButton showBalance={false} chainStatus="none" />
          </div>
          {proxyContractAbi.length > 0 && (
            <WriteContract
              abi={proxyContractAbi}
              contractAddress={contractAddress as `0x${string}`}
              isConnected={isConnected}
              selectedChain={selectedChain}
              ownerOnlyFunctions={ownerOnlyFunctions}
              isProxy
            />
          )}
          <WriteContract
            abi={contractAbi}
            contractAddress={contractAddress as `0x${string}`}
            isConnected={isConnected}
            selectedChain={selectedChain}
            ownerOnlyFunctions={ownerOnlyFunctions}
          />
        </>
      )}
      {activeTab === "read" && (
        <>
          {proxyContractAbi.length > 0 && (
            <ReadContract
              abi={proxyContractAbi}
              contractAddress={contractAddress as `0x${string}`}
              isConnected={isConnected}
              selectedChain={selectedChain}
              isProxy
            />
          )}
          <ReadContract
            abi={contractAbi}
            contractAddress={contractAddress as `0x${string}`}
            isConnected={isConnected}
            selectedChain={selectedChain}
          />
        </>
      )}
      {activeTab === "Admin" && (
        <>
        <div className="pt-2 pl-4 mx-4">
            <ConnectButton showBalance={false} chainStatus="none" />
          </div>
        {proxyContractAbi.length > 0 && (
            <WriteContract
              abi={proxyContractAbi}
              contractAddress={contractAddress as `0x${string}`}
              isConnected={isConnected}
              selectedChain={selectedChain}
              ownerOnlyFunctions={ownerOnlyFunctions}
              isProxy
              adminOnly
            />
          )}
        <WriteContract
            abi={contractAbi}
            contractAddress={contractAddress as `0x${string}`}
            isConnected={isConnected}
            selectedChain={selectedChain}
            ownerOnlyFunctions={ownerOnlyFunctions}
            adminOnly
          />
        </>
      )}
    </>
  );
};

export default ReadWriteContract;
