const Header = () => {
  return (
    <div className="flex justify-between items-center space-x-4 p-4 m-4">
      <div>
      <picture>
        <source srcSet="https://uploads-ssl.webflow.com/645a621eccd7c7d1f4aa7e0d/645a767bd635e853019db61a_Logo-dark.svg" media="(prefers-color-scheme: dark)" />
        <img
        src="https://uploads-ssl.webflow.com/645a621eccd7c7d1f4aa7e0d/645a645c2b0ee679f33ba0e4_Logo_Meroku.svg"
        loading="lazy"
        alt="Meroku Logo"
      />
      </picture>
      </div>
      <div className="flex justify-center dark:text-white">
        <a className="py-2 px-4" href="https://meroku.org/" target="_blank" >Meroku</a>
        <a className="py-2 px-4" href="https://twitter.com/merokustore" target="_blank" >Twitter</a>
        <a className="py-2 px-4" href="http://github.com/merokudao" target="_blank" >Github</a>
      </div>
    </div>
  );
};

export default Header;
