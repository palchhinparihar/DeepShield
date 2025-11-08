import React from 'react'
import LogoutButton from './LogoutButton'
export default function Dashboard() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Dashboard</h1>
      <p>You are logged in successfully ✅</p>
      <LogoutButton />
    </div>
  )
}
