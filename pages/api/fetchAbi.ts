import type { NextApiRequest, NextApiResponse } from "next";

export default async function fetchAbi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { selectedChain, contractAddress },
  } = req;

  const key =
    selectedChain === "Ethereum"
      ? process.env.NEXT_PUBLIC_ETHER_SCAN_API_KEY
      : process.env.NEXT_PUBLIC_POLYGON_SCAN_API_KEY;
  const baseUrl =
    selectedChain === "Ethereum"
      ? process.env.NEXT_PUBLIC_ETHER_SCAN_BASE_URL
      : process.env.NEXT_PUBLIC_POLYGON_SCAN_BASE_URL;

  const response = await fetch(
    `${baseUrl}?module=contract&action=getabi&address=${contractAddress}&apikey=${key}`
  );
  const data = await response.json();
  res.status(200).json({
    data: data,
  });
}
