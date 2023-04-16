import React from 'react'

// styles
import './Avatar.css'

const Avatar = ({ src }) => {
  return (
    <div className='avatar'>
        <img src={src} alt="avatar-image" />
    </div>
  )
}

export default Avatar