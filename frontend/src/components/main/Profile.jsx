import React from 'react'
import { useAuth0 } from '@auth0/auth0-react';

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please log in</div>

  return (
    <div className="flex items-center space-x-3">
      <img src={user?.picture} alt={`profile of ${user?.name}`} className="w-11 h-11 rounded-full shadow shadow-gray-400 hover:scale-105 transition duration-300" />
      <div>
        <h3 className="text-base md:text-lg">Welcome, {user?.name.split(" ")[0] || user?.name}</h3>
        <p className="text-sm text-gray-300">{user?.email}</p>
      </div>
    </div>
  )
}