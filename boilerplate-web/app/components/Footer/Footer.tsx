import React from 'react'

const Footer = () => {
  return (
    <footer className="flex justify-between items-center p-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white border-t border-purple-300 custom-font-univiapro uppercase">
      <span className="text-sm text-yellow-300 footer-left">
        &copy; 2024 MyCompany
        <span className="hidden md:inline">. All rights reserved.</span>
      </span>
      <div className="text-right space-y-1 text-sm footer-links">
        <a
          href="/terms-and-conditions"
          className="text-yellow-300 hover:underline hover:text-yellow-400 pr-8"
        >
          Terms & Conditions
        </a>
        <a
          href="/privacy-policy"
          className="text-yellow-300 hover:underline hover:text-yellow-400"
        >
          Privacy Policy
        </a>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .footer-left {
            text-align: left;
            flex: 1;
          }
          .footer-links {
            text-align: right;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
          }
          .footer-links a {
            padding-right: 0;
            white-space: nowrap; /* Prevents wrapping mid-word */
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
