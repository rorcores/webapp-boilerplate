import { type Session } from '@supabase/gotrue-js/src/lib/types'
import React, { useState, useEffect } from 'react'
import { FaUser, FaQuestionCircle } from 'react-icons/fa'
import UpdateProfileModal from '../UpdateProfileModal/UpdateProfileModal'
import HelpModal from '../HelpModal/HelpModal'
import { useUserContext } from '@/app/contexts/UserContext'

interface NavBarProps {
  session: Session | null
  supabase: any
}

const NavBar: React.FC<NavBarProps> = ({ session, supabase }) => {
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showCashOutModal, setShowCashOutModal] = useState(false)

  const { userData } = useUserContext()
  // console.log('NavBar userData:', userData);
  const credits = userData?.credits || 0

  // Function to handle trimming for mobile view
  const formatUsernameOrEmail = (value: string) => {
    return value.length > 14 ? `${value.slice(0, 11)}...` : value
  }

  const handleSignOut = async () => {
    try {
      const accessToken = session?.access_token

      if (!accessToken) {
        console.error('No access token found')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/v1/log-sign-out-event`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ accessToken }),
        },
      )

      if (response.ok) {
        // console.log('Sign-out logged successfully')

        // Clear the Supabase session client-side
        await supabase.auth.signOut() // Ensure the client-side session is cleared as well
      } else {
        const { error } = await response.json()
        console.error('Error logging sign-out:', error)
      }
    } catch (error) {
      console.error('Sign-out failed:', error)
    }
  }

  const handleOpenModal = () => {
    setShowInfoModal(true)
  }

  const handleCloseModal = () => {
    setShowInfoModal(false)
  }

  const toggleHelpModal = () => {
    setShowHelpModal((prev) => !prev)
  }

  const toggleCashOutModal = () => {
    setShowCashOutModal((prev) => !prev)
  }

  useEffect(() => {
    // console.log('userData changed:', userData);
  }, [userData]);

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white shadow-lg custom-font-univiapro">
      <nav className="flex items-center justify-between px-4 py-2 md:px-6 md:py-4 border-b border-purple-300">
        <div className="flex items-center space-x-4 w-full">
          {session?.user && (
            <button
              className="flex items-center p-2 bg-white bg-opacity-10 rounded-lg border border-white text-xs md:text-sm text-white shadow-md cursor-pointer"
              onClick={handleOpenModal}
            >
              <FaUser className="mr-2" />
              <span className="mobile-username">
                {formatUsernameOrEmail(
                  userData?.username || session.user.email,
                )}
              </span>
            </button>
          )}
          <button onClick={toggleHelpModal} className="text-white text-xl">
            <FaQuestionCircle />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {session?.user && (
            <button
              onClick={toggleCashOutModal}
              className="flex items-center bg-white bg-opacity-10 p-2 rounded-lg border border-white text-xs md:text-sm text-white shadow-md uppercase"
            >
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(credits)}
              </span>
            </button>
          )}
          {session?.user && (
            <button
              className="flex items-center bg-purple-600 hover:bg-purple-700 p-2 rounded-lg text-xs md:text-sm text-white shadow-md uppercase focus:ring-4 focus:outline-none focus:ring-purple-300 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-purple-500/50 cursor-pointer whitespace-nowrap"
              onClick={handleSignOut}
            >
              LOG OUT
            </button>
          )}
        </div>
      </nav>
      {showInfoModal && (
        <UpdateProfileModal session={session!} onClose={handleCloseModal} />
      )}
      <HelpModal isModalOpen={showHelpModal} toggleModal={toggleHelpModal} />
      <style jsx>{`
        @media (max-width: 768px) {
          nav {
            flex-direction: row;
            justify-content: space-between;
            padding: 0.5rem 1rem;
          }
          .flex.items-center.space-x-4 {
            justify-content: space-between;
            width: 100%;
          }
          button {
            flex: 1;
            justify-content: center;
          }

          .mobile-username {
            display: block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      `}</style>
    </div>
  )
}

export default NavBar
