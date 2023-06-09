import React, { useState } from 'react'
import { timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'

const ProjectComments = ({ project }) => {
    const [newComment, setNewComment] = useState('')
    const { user } = useAuthContext()
    const { updateDocument, response } = useFirestore('projects')


    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const commentToAdd = {
            displayName: user.displayName,
            content: newComment,
            createdAt: timestamp.fromDate(new Date()),
            id: Math.random()
        }
        await updateDocument(project.id, {
            comments: [ ...project.comments, commentToAdd ]
        })

        if(!response.error) {
            setNewComment('')
        }
    }

  return (
      <div className="project-comments">
          <h4>Project comments</h4>
          <ul>
              {/* nu merge ceva aici cu firebase ul */}
              {project.comments.length > 0 &&  project.comments.map((comment) => (
                  <li key={comment.id}>
                      <div className="comment-author">
                          <p>{comment.displayName}</p>
                      </div>
                      <div className="comment-date">
                          <p>date here</p>
                      </div>
                      <div className="comment-content">
                          <p>{comment.content}</p>
                      </div>
                  </li>
              ))}
          </ul>

          <form className='add-comment' onSubmit={handleSubmit}>
              <label>
                  <span>Add new comments:</span>
                  <textarea
                    required
                    onChange={(e) => setNewComment(e.target.value)}
                    value={newComment}
                  ></textarea>
              </label>
              <button className='btn'>Add comment</button>
          </form>
      </div>
  )
}

export default ProjectComments