import React, { useState, useEffect } from 'react'
import { type Session } from '@supabase/gotrue-js/src/lib/types'
import { useUserContext } from '../../contexts/UserContext'
import { validateInputFields } from '@/app/utils/inputValidationHelpers'

interface InfoModalProps {
  onClose: () => void
  session: Session
}

const CompleteYourProfileModal: React.FC<InfoModalProps> = ({
  onClose,
  session,
}) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false) 
  const [isFormInvalid, setIsFormInvalid] = useState(true) 

  const { refreshUserData } = useUserContext()

  const validateFields = () => {
    const error = validateInputFields(firstName, lastName, username)
    setErrorMessage(error)
    setIsFormInvalid(!!error)
  }

  useEffect(() => {
    validateFields()
  }, [firstName, lastName, username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isFormInvalid || !session) return

    setIsSubmitting(true)

    try {
      const token = session.access_token

      // Check if the username is available
      const checkUsernameResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/v1/check-if-username-exists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        },
      )

      const checkUsernameData = await checkUsernameResponse.json()

      if (checkUsernameData.error) {
        setErrorMessage(checkUsernameData.error)
        setIsSubmitting(false)
        return
      }

      // Proceed to add the user profile
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/v1/create-new-user`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            username,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Error adding user profile')
      }

      await refreshUserData() // Refresh user data in context
      onClose() // Close the modal on success
    } catch (error) {
      console.error('Error adding user profile:', error)
      setErrorMessage('An error occurred while saving your information.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center custom-font-univiapro"
      style={{ zIndex: 9999 }}
    >
      <div
        className="p-8 rounded-3xl shadow-lg space-y-4 w-full max-w-md mx-4 sm:mx-auto bg-gradient-to-r from-gray-700 to-gray-900"
        style={{
          border: '2px solid rgba(147, 112, 219, 0.8)',
          boxShadow: '0 0 15px rgba(147, 112, 219, 0.7)',
        }}
      >
        <h2 className="text-2xl font-bold text-yellow-300 uppercase">
          COMPLETE YOUR PROFILE
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white">
              EMAIL
            </label>
            <p className="mt-1 block w-full px-3 py-2 bg-gray-100 text-gray-500 border border-gray-300 rounded-md shadow-sm">
              {session?.user.email}
            </p>
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username_here"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
              required
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isFormInvalid || isSubmitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 uppercase ${
                isFormInvalid || isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
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

export default CompleteYourProfileModal
