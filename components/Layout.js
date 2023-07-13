import Footer from "./Footer";
import Header from "./Header";
import Metatags from "./Metatags";

const Layout = ({ children }) => {
  return (
    <>
      <Metatags />
      <div className="dark:bg-slate-800 flex-col flex h-[100%] items-center overflow-auto">
        <div className="xl:w-[60%] min-h-[92vh]">
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
