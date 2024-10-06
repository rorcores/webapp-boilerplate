import React from 'react';
import { useRouter } from 'next/router';

const Terms = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push(`${window.location.origin}`);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-white text-black py-10">
      <div className="container mx-auto p-8 bg-gray-100 text-gray-900 shadow-2xl max-w-2xl rounded-lg terms-content custom-font-univiapro">
        <h1 className="text-4xl font-bold text-center mb-6">Terms and Conditions</h1>
        <ol className="list-decimal space-y-4 px-5 text-gray-700">
          <li>
            <strong>Acceptance of Terms</strong>: By using this service, you agree
            to these Terms and Conditions. If you do not agree with any part of
            these Terms, you must stop using the service immediately.
          </li>
          <li>
            <strong>User Responsibilities</strong>: You are responsible for
            ensuring the accuracy of the information you provide (such as email,
            username, first and last name). You must use the service in
            compliance with all applicable laws and regulations. The service must
            not be used for any unlawful purposes or fraudulent activities.
          </li>
          <li>
            <strong>Privacy Policy</strong>: Your privacy is important to us.
            Our Privacy Policy outlines how we collect, use, and protect your
            personal information. Please refer to our Privacy Policy for more
            details.
          </li>
          <li>
            <strong>Service Availability</strong>: While we aim to provide a
            smooth and continuous experience, we cannot guarantee uninterrupted
            access to the service. The service may be temporarily unavailable due to
            maintenance, updates, or technical issues. We are not liable for any
            losses or inconveniences resulting from these disruptions.
          </li>
          <li>
            <strong>Limitation of Liability</strong>: To the fullest extent
            permitted by law, we are not liable for any direct, indirect,
            incidental, or consequential damages that may arise from your use of
            the service or inability to use the service.
          </li>
          <li>
            <strong>Amendments to Terms</strong>: We reserve the right to modify
            or update these Terms at any time. Continued use of the service after
            changes are made indicates your acceptance of the revised Terms. It
            is your responsibility to review the Terms regularly for any
            updates.
          </li>
          <li>
            <strong>Governing Law</strong>: These Terms and Conditions are
            governed by the laws of the jurisdiction where our company is
            registered, without regard to its conflict of law provisions.
          </li>
          <li>
            <strong>Contact Information</strong>: If you have any questions or
            concerns about these Terms, please contact us at
            contact@MYCOMPANY.com.
          </li>
        </ol>
        <p className="mt-6 text-center">
          By using this service, you acknowledge that you have read, understood,
          and agree to be bound by these Terms and Conditions.
        </p>
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
          .terms-content {
            max-width: 90%; /* Ensure it doesn't go full width on mobile */
            font-size: 0.875rem; /* Smaller font size for mobile */
            padding: 1.5rem; /* Reduce padding on mobile */
          }
        }
      `}</style>
    </div>
  );
};

export default Terms;
