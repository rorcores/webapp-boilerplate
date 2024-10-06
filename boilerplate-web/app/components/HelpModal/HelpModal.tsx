import React from 'react';

interface HelpModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isModalOpen, toggleModal }) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 custom-font-univiapro">
      <div className="fixed inset-0 bg-black opacity-50"></div>

      <div className="bg-white text-black rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-xs sm:max-w-lg z-10 mx-4 relative">
        <button
          onClick={toggleModal}
          className="absolute top-3 right-6 text-black text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h3 className="text-xl sm:text-2xl font-extrabold mb-4 text-left">
          Help
        </h3>
        <p className="mb-2 sm:mb-4 text-left text-sm sm:text-base">
          MyProject is a project that does...
        </p>
        <p className="mb-2 sm:mb-4 text-left text-sm sm:text-base">
          FOR HELP PLEASE CONTACT MyCompany:
        </p>
        <div className="italic border border-gray-300 rounded-md p-3 sm:p-4 my-2 sm:my-4 bg-gray-100 text-black text-left text-sm sm:text-base">
          contact@mycompany
        </div>
        <button
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full w-full font-bold transition-all duration-300 shadow-lg transform hover:scale-105 text-sm sm:text-base"
          onClick={toggleModal}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
