// src/components/HomePage/HomePage.tsx

'use client';
import React, { useState } from 'react';
import Loader from '../Loader/Loader';
import Disclaimer from '../Disclaimer/Disclaimer';
import { useUserContext } from '../../contexts/UserContext';

interface HomePageProps {
  session: any;
  setActiveTab: (tab: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ session, setActiveTab }) => {
  const [loading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const { userData } = useUserContext();

  if (isPageLoading) {
    return <Loader />;
  }

  return (
    <div className="flex pt-8 flex-col min-h-screen justify-center bg-white text-black font-sans">
      <div className="flex-grow">
        <div className="text-center">
          <div
            className="px-6 py-4 mb-8 rounded-box bg-gray-100 text-black border-gray-300 shadow-md w-full lg:w-[700px] mx-auto"
          >
            <h1 className="text-3xl font-bold mb-4">MyProject</h1>
            <h2 className="text-xl font-semibold mb-4">Boilerplate</h2>
            <p className="text-lg mb-2">You are logged in as:</p>
            <p className="text-md mb-1">{userData?.email}</p>
            <p className="text-md">{userData?.name}</p>
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
};

export default HomePage;
