import React, { useState } from 'react';

const AuthScreen = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/v1/log-user-in-via-otp-link`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setMessage('Check your email to continue');
      setLoading(false);
      setShowMessage(true);
    } catch (error) {
      // Type narrowing: check if error is an instance of Error
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unknown error occurred');
      }
      setLoading(false);
      setShowMessage(true);
    }
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col justify-center items-center" style={{ padding: '0', margin: '0' }}>
      <div className="p-8 w-full max-w-md bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center">MyProject</h1>

        {!showMessage ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 text-black rounded-md border border-gray-300 focus:ring-2 focus:ring-gray-400 focus:outline-none"
                placeholder="your@email.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-md text-lg font-semibold focus:outline-none ${
                loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'
              }`}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Continue'}
            </button>
          </form>
        ) : (
          <div className="mt-4 p-4 bg-gray-200 rounded-md">
            <p className="text-center">{message}</p>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-500 mt-4">
        By continuing you agree to our{' '}
        <a href="/terms-and-conditions" className="underline">
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy-policy" className="underline">
          Privacy Policy
        </a>
        . &copy; 2024 MyCompany.
      </div>
    </div>
  );
};

export default AuthScreen;
