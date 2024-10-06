import React, { useState, useEffect } from 'react'
import { Session } from '@supabase/gotrue-js/src/lib/types'
import Loader from '../Loader/Loader'
import { supabase } from '@/app/supabaseClient'
import { useUserContext } from '../../contexts/UserContext'
import { validateInputFields } from '@/app/utils/inputValidationHelpers'

interface InfoModalProps {
  onClose: () => void
  session: Session
}

const UpdateProfileModal: React.FC<InfoModalProps> = ({ onClose, session }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isFormInvalid, setIsFormInvalid] = useState(false)
  const [otpSent, setOtpSent] = useState(false)

  const { userData, refreshUserData } = useUserContext()

  useEffect(() => {
    if (userData) {
      setFirstName(userData.first_name || '')
      setLastName(userData.last_name || '')
      setUsername(userData.username || '')
      setLoading(false)
    } else {
      setLoading(true)
    }
  }, [userData])

  const validateFields = () => {
    const error = validateInputFields(firstName, lastName, username)
    setErrorMessage(error)
    setIsFormInvalid(!!error)
  }

  useEffect(() => {
    validateFields()
  }, [firstName, lastName, username])

  const handleEmailChange = async () => {
    if (!newEmail) {
      setErrorMessage('Please enter a valid email address')
      return
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      })

      if (error) {
        setErrorMessage('Error updating email - contact support.')
        console.error(error)
      } else {
        setOtpSent(true)
        // setErrorMessage('OTP sent to new email. Please verify.')
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isFormInvalid) return

    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData?.session) {
      setErrorMessage('Failed to retrieve session.')
      return
    }

    const token = sessionData.session.access_token

    try {
      // First, check if the username is available
      const checkUsernameResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/v1/check-if-username-exists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email: sessionData.session.user.email,
          }),
        },
      )

      const checkUsernameData = await checkUsernameResponse.json()

      if (checkUsernameData.error) {
        setErrorMessage(checkUsernameData.error)
        return
      }

      // Proceed to update the user data
      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/v1/update-users-profile-information`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: sessionData.session.user.email,
            firstName,
            lastName,
            username,
          }),
        },
      )

      if (updateResponse.ok) {
        // Refresh the user data in the context
        await refreshUserData()
        onClose()
      } else {
        setErrorMessage('An error occurred while saving your information.')
      }
    } catch (error) {
      console.error('Error updating user information:', error)
      setErrorMessage('An error occurred. Please try again.')
    }
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="p-8 rounded-3xl shadow-lg space-y-4 w-full max-w-md mx-4 sm:mx-auto bg-gradient-to-r from-gray-700 to-gray-900 relative"
        style={{
          border: '2px solid rgba(147, 112, 219, 0.8)',
          boxShadow: '0 0 15px rgba(147, 112, 219, 0.7)',
          zIndex: 9999,
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-6 text-white text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-yellow-300">
          UPDATE YOUR PROFILE
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-white">
              EMAIL
            </label>
            <p className="mt-1 block w-full px-3 py-2 bg-gray-100 text-gray-500 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none cursor-not-allowed">
              {session?.user.email}
            </p>
            <input
              type="email"
              placeholder="Enter new email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button
              type="button"
              className="mt-2 bg-purple-600 text-white p-2 rounded"
              onClick={handleEmailChange}
              disabled={otpSent}
            >
              Update Email
            </button>
            {otpSent && <p className="text-green-500">OTP sent. Check your email!</p>}
          </div>
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-white"
            >
              FIRST NAME
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-white"
            >
              LAST NAME
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"
              required
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-white"
            >
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="button_player"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-black"
              required
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md ${
                isFormInvalid
                  ? 'bg-purple-300 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
              }`}
              disabled={isFormInvalid}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .info-modal-content {
            max-width: 90%;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default UpdateProfileModal
