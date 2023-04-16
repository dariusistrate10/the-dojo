import React from 'react'
import { useCollection } from '../hooks/useCollection.js'

// styles
import './OnlineUsers.css'
// import Avatar from './Avatar'

const OnlineUsers = () => {
    const { error, documents } = useCollection('users')

  return (
    <div className='user-list'>
        <h2>All Users</h2>
        {error && <div>{error}</div>}
        {documents && documents.map((user) => (
            <div className='user-list-item' key={user.id}>
                {user.online && <span className='online-user'></span>}
                <span>{user.displayName}</span>
                {/* <Avatar /> */}
            </div>
        ))}
    </div>
  )
}

export default OnlineUsers