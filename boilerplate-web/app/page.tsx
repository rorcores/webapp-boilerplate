'use client'
import React, { useState, useEffect } from 'react'
import '../styles/globals.css'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Account from './Account'
import { type Session } from '@supabase/gotrue-js/src/lib/types'
import Loader from './components/Loader/Loader'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session)
      setLoading(false)
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  if (!isHydrated) {
    return null
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      {!session ? (
        <Auth />
      ) : (
        <Account key={session.user.id} session={session} />
      )}
    </div>
  )
}

export default App
