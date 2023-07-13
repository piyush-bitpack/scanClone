import { useRouter } from "next/router";
import ReadWriteContract from "../../components/ReadWriteContract";

const ContractPage = () => {
  const router = useRouter();
  return (
    <ReadWriteContract
      contract={router.query.contract as string}
      chainId={Number(router.query.chainId) as number}
    />
  );
};

export default ContractPage;
