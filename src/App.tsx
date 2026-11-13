import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check initial active session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 2. Listen for sign in / sign out changes dynamically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center min-h-screen">
        <p>Loading application...</p>
      </div>
    )
  }

  // If the user is NOT signed in, render the Sign-In view
  if (!session) {
    return (
      <div className="size-full flex items-center justify-center min-h-screen bg-gray-50">
        {/* Replace this with your Figma-generated Sign In component */}
        <div className="p-8 bg-white rounded-xl shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Welcome to Booking App</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your resident hub and bookings.</p>
          
          {/* Quick example form hookup */}
          <button 
            onClick={async () => {
              // Example magic link sign in or hook up your Figma form fields here
              const email = prompt("Enter your email for sign in:")
              if (email) {
                const { error } = await supabase.functions.invoke("request-inquiry-otp", {
                  body: { email: email.trim().toLowerCase() },
                })
                if (error) alert(error.message)
                else alert("Check your email for the login link!")
              }
            }}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Sign In with Email OTP
          </button>
        </div>
      </div>
    )
  }

  // If the user IS signed in, render your secure dashboard/bookings UI
  return (
    <div className="size-full min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Resident Hub & Bookings</h1>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <p className="text-green-600 font-medium mb-4">Successfully logged in as: {session.user.email}</p>
        
        {/* Put your Figma-generated booking list, calendar, or walkthrough components here */}
        <p className="text-gray-600">Your protected booking components go here...</p>
      </div>
    </div>
  )
}