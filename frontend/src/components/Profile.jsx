import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please log in</div>
  return (
    <div>
      <img src={user.picture} alt="profile" width="50" />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}
