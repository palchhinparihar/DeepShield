import React from 'react'
import LoginButton from './LoginButton'
import Profile from './Profile'

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Welcome to DeepShield 🔐</h1>
      <LoginButton />
      <Profile />
    </div>
  )
}
