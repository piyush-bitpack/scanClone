import type { NextPage } from "next";
import ReadWriteContract from "../components/ReadWriteContract";
import Header from "../components/Header";

const Home: NextPage = () => {
  return (
    <div className="flex justify-center max-lg:pl-[60px]">
      <div className="xl:w-[60%]">
        <Header />
        <ReadWriteContract />
      </div>
    </div>
  );
};

export default Home;
