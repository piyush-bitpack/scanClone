function parseCode(code) {
  const ownerFunction = [];
  const parsedContract = window?.SolidityParser.parse(code);
  parsedContract.children.forEach((child) => {
    if (child.type === "ContractDefinition") {
      child.subNodes.forEach((subNode) => {
        if (subNode.type === "FunctionDefinition") {
          subNode.modifiers.forEach((modifier) => {
            if (modifier.name === "onlyOwner") {
              ownerFunction.push(subNode.name);
            }
          });
        }
      });
    }
  });
  return ownerFunction;
}

export async function getOnlyOwnerFunctions(address, selectedChain) {
  const contractAddress = address;
  let ownerFunctions = [];
  const key = process.env.NEXT_PUBLIC_POLYGON_SCAN_API_KEY;
        const baseUrl =
          selectedChain === "Polygon Mumbai"
            ? process.env.NEXT_PUBLIC_POLYGON_SCAN_BASE_URL_TESTNET
            : process.env.NEXT_PUBLIC_POLYGON_SCAN_BASE_URL;
  const response = await fetch(
    `${baseUrl}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${key}`
  );
  const data = await response.json();
  if (data.result[0].ABI === "Contract source code not verified") {
    console.log("Contract source code not verified");
    return [];
  }
  try {
    if (data.result[0].SourceCode === null) {
      console.log("No source code found for this contract address");
      return [];
    }
    if (data.result[0].SourceCode[0] === "{") {
      console.log("Source code is in multiple files");
      const trimmedResponse = JSON.parse(
        data.result[0].SourceCode.slice(1, -1)
      );
      Object.entries(trimmedResponse.sources).forEach(([key, value]) => {
        const solidityCode = value.content;
        const ownerOnlyFunction = parseCode(solidityCode);
        if (ownerOnlyFunction.length > 0) {
          ownerFunctions = ownerFunctions.concat(ownerOnlyFunction);
        }
      });
      return ownerFunctions;
    } else {
      const solidityCode = data.result[0].SourceCode;
      return parseCode(solidityCode);
    }
  } catch (err) {
    console.log(err, "No source code found for this contract address");
    return;
  }
}
