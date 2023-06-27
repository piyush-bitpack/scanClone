import type { NextPage } from 'next';
import ReadWriteContract from '../components/ReadWriteContract'

const Home: NextPage = () => {
  return (
      <div>
      <h1 className="shadow-md flex items-center space-x-4 p-4 m-4">
        Read/Write Features
      </h1>
      <ReadWriteContract />
    </div>

  );
};

export default Home;
