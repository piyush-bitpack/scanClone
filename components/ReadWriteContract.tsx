import React, { useState, ChangeEvent } from "react";
import { useAccount } from 'wagmi'
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

const ReadWriteContract = (): JSX.Element => {
  const [contractAddress, setContractAddress] = useState<string>();
  const [contractAbi, setContractAbi] = useState<Array<abiItem>>([]);
  const [writeTab, setWrieTab] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { isConnected } = useAccount()

  const handleAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setContractAddress(event.target.value);
  };

  const fetchAbi = async () => {
    try {
      if (contractAddress) {
        const key = process.env.NEXT_PUBLIC_POLYGON_SCAN_API_KEY;
        const baseUrl = process.env.NEXT_PUBLIC_ENVIRONMENT === 'testnet' ? process.env.NEXT_PUBLIC_POLYGON_SCAN_BASE_URL_TESTNET : process.env.NEXT_PUBLIC_POLYGON_SCAN_BASE_URL
        const res = await fetch(
          `${baseUrl}?module=contract&action=getabi&address=${contractAddress}&apikey=${key}`
        );
        const data = await res.json();
        if(data.message === 'OK') {
          const abi = data.result;
          if(abi) {
            setContractAbi(JSON.parse(abi));
          }
        } else {
          setError(data.result)
        }
      }
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <>
      <SearchForm handleAddress={handleAddress} fetchAbi={fetchAbi} />
      {error && <span className="px-4 m-4 text-red-700">{error}</span>}
      <div className="flex items-center px-4 mx-4">
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
          <li className="mr-2">
            <button
              className={`text-black inline-block p-4 hover:bg-gray-50 rounded-t-lg ${!writeTab ? 'bg-gray-100' : ''}`}
              onClick={() => setWrieTab(false)}
            >
              Read
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`text-black inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 ${writeTab ? 'bg-gray-100' : ''}`}
              onClick={() => setWrieTab(true)}
            >
              Write
            </button>
          </li>
        </ul>
      </div>
      {writeTab ? (
        <WriteContract
          abi={contractAbi}
          contractAddress={contractAddress as `0x${string}`}
          isConnected={isConnected}
        />
      ) : (
        <ReadContract
          abi={contractAbi}
          contractAddress={contractAddress as `0x${string}`}
          isConnected={isConnected}
        />
      )}
    </>
  );
};

export default ReadWriteContract;
