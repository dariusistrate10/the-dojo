// styles
import './ProjectSummary.css'

import React from 'react'
import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'

const ProjectSummary = ({ project }) => {
    const { deleteDocument, response } = useFirestore('projects')
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const handleClick = (e) => {
        deleteDocument(project.id)
        if(!response.error) {
            navigate('/')
        }
    }

  return (
    <div>
        <div className="project-summary">
            <h2 className='page-title'>{project.name}</h2>
            <p>By {project.createdBy.displayName}</p>
            <p className='due-date'>Project due by {project.dueDate.toDate().toDateString()}</p>
            <p className="details">{project.details}</p>
            <h4>Project is assigned to:</h4>
            <div className="assigned-users">
                {project.assignedUsersList.map((user) => (
                    <div key={user.id}>
                        {user.displayName}
                    </div>
                ))}
            </div>
        </div>
        { user.uid === project.createdBy.id && <button className="btn" onClick={handleClick}>Mark as Complete</button> }
    </div>
  )
}

export default ProjectSummary