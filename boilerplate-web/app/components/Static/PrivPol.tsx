import React from 'react';
import { useRouter } from 'next/router';

const PrivPol = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push(`${window.location.origin}`);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-white text-black py-10">
      <div className="container mx-auto p-8 bg-gray-100 text-gray-900 shadow-2xl max-w-2xl rounded-lg privpol-content custom-font-univiapro">
        <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>
        <div className="text-gray-700 space-y-4 px-5">
          <p>
            <strong>Introduction:</strong> Your privacy is important to us. This
            Privacy Policy explains how we collect, use, and protect your
            personal information when using MyProject.
          </p>

          <h2 className="text-lg font-semibold mt-5 mb-2">Information Collection</h2>
          <ul className="list-disc">
            <li>
              <strong>Personal Information:</strong> We collect personal
              information such as your email address, first name, last name, and
              username to provide you with our services.
            </li>
            <li>
              <strong>Usage Data:</strong> We collect anonymized data on how the
              app is used to improve service functionality and the overall user
              experience.
            </li>
            <li>
              <strong>Communications:</strong> We may use your personal
              information to send you service-related notifications or changes to the app or
              policies.
            </li>
          </ul>

          <h2 className="text-lg font-semibold mt-5 mb-2">Use of Information</h2>
          <ul className="list-disc">
            <li>
              <strong>Service Provision:</strong> Your personal information is
              used to manage your account and allow you to use this service.
            </li>
            <li>
              <strong>Improvement:</strong> We use collected data to understand
              user interaction and to improve the app's features and
              performance.
            </li>
            <li>
              <strong>Support:</strong> Your information enables us to provide
              customer support and resolve any issues you may have with the
              service.
            </li>
          </ul>

          <h2 className="text-lg font-semibold mt-5 mb-2">Sharing of Information</h2>
          <p>
            We do not sell, rent, or share your personal information with third
            parties, except as required by law or to protect our rights. We
            implement strict measures to secure your personal data from
            unauthorized access.
          </p>

          <h2 className="text-lg font-semibold mt-5 mb-2">Data Security</h2>
          <p>
            We take appropriate measures to protect your personal information
            from unauthorized access, alteration, disclosure, or destruction.
            While we strive to secure your data, no method of transmission over
            the internet or electronic storage is completely secure, and we
            cannot guarantee its absolute security.
          </p>

          <h2 className="text-lg font-semibold mt-5 mb-2">Changes to Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect
            changes to our practices or for other operational, legal, or
            regulatory reasons. We encourage you to review this page
            periodically for the latest updates.
          </p>

          <h2 className="text-lg font-semibold mt-5 mb-2">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our practices
            regarding your personal information, please contact us at
            contact@MYCOMPANY.com.
          </p>

          <p className="mt-6 text-center text-gray-600">
            By using our service, you consent to the practices described in this
            Privacy Policy.
          </p>
        </div>
        <div className="text-center mt-8">
          <button
            onClick={handleBackClick}
            className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-300"
          >
            BACK
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .privpol-content {
            max-width: 90%; /* Ensure it doesn't go full width on mobile */
            font-size: 0.875rem; /* Smaller font size for mobile */
            padding: 1.5rem; /* Reduce padding on mobile */
          }
        }
      `}</style>
    </div>
  );
};

export default PrivPol;
