import { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Metatags from "./Metatags";

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Metatags />
      <div className="dark:bg-slate-800 flex-col flex h-full items-center overflow-auto">
        <div className="w-full xl:w-[60%] min-h-[92vh]">
          <Header />
          {children}
        </div>
        <div className="lg:ml-[-26%]">
        <Footer />
        </div>
      </div>
    </>
  );
};

export default Layout;
