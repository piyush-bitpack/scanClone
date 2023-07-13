const Footer = () => {
    return (
        <footer>
      <p className="bottom-0 space-x-4 mx-4 p-4 dark:text-white">
        Build with
         <svg className='w-4 h-4 inline mx-1' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path className='fill-red-500' d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/>
        </svg> 
        using
        <a className="px-1 text-blue-500 !m-0" href="https://etherscan.io/" target="_blank" >EtherScan</a>
        and
        <a className="px-1 text-blue-500 !m-0" href="https://polygonscan.com/" target="_blank" >PolygonScan</a>
        APIs
      </p>
      </footer>
    );
  };
  
  export default Footer;
  