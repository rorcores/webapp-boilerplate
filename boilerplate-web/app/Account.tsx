//src/Account.tsx

import React, { useState } from 'react'
import { type Session } from '@supabase/gotrue-js/src/lib/types'
import NavBar from './components/NavBar/NavBar'
import { supabase } from './supabaseClient'
import HomePage from './components/HomePage/HomePage'
import Footer from './components/Footer/Footer'
import CompleteYourProfileModal from './components/CompleteProfileModal/CompleteProfileModal'
import { useUserContext } from './contexts/UserContext'

interface AccountProps {
  session: Session
}

export default function Account({ session }: AccountProps) {
  const [activeTab, setActiveTab] = useState('homePage')
  const { userExists } = useUserContext();

  const renderContent = () => {
    switch (activeTab) {
      case 'homePage':
        return <HomePage setActiveTab={setActiveTab} session={session} />
      default:
        return <HomePage setActiveTab={setActiveTab} session={session} />
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <NavBar session={session} supabase={supabase} />
      <div className="flex flex-row flex-grow">
        <div className="flex-grow overflow-auto">
          {renderContent()}
        </div>
      </div>
      <Footer />
      {userExists === false && (
        <CompleteYourProfileModal
          session={session}
          onClose={() => {}}
        />
      )}
    </div>
  )
}
