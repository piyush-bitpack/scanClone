import type { NextPage } from "next";
import ReadWriteContract from "../components/ReadWriteContract";
import Header from "../components/Header";

const Home: NextPage = () => {
  return (
    <div className="dark:bg-slate-800 h-screen flex justify-center overflow-auto">
      <div className="xl:w-[60%]">
        <Header />
        <ReadWriteContract />
      </div>
    </div>
  );
};

export default Home;
