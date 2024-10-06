import React from 'react'

const Disclaimer: React.FC = () => {
  return (
    <footer className="text-center text-sm text-gray-200 mb-32 md:mt-8 mt-16 custom-font-univiapro">
      <div className="max-w-3xl w-4/5 mx-auto">
        By using this tool, you agree to the{' '}
        <a
          href="/terms-and-conditions"
          className="text-yellow-300 hover:underline"
        >
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy-policy" className="text-yellow-300 hover:underline">
          Privacy Policy
        </a>
        .<br />
        &copy; 2024 MyProject. All rights reserved.
      </div>
    </footer>
  )
}

export default Disclaimer
