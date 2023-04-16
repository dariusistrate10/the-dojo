// styles
import './Create.css'

import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useCollection } from '../../hooks/useCollection'
import { timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'
import { useNavigate } from 'react-router-dom'

const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
]

const Create = () => {  
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])
  const [formError, setFormError] = useState(null)
  const { user } = useAuthContext()
  const { addDocument, response } = useFirestore('projects')
  const navigate = useNavigate()

  useEffect(() => {
    if(documents) {
      const options = documents.map(user => {
        return { value: user, label: user.displayName }
      })
      setUsers(options)
    }
  }, [documents])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if(!category) {
      setFormError('Please select a project category')
      return
    }

    if(assignedUsers.length < 1) {
      setFormError('Please assign an user to this project')
      return
    }
    
    const createdBy = {
      displayName: user.displayName,
      id: user.uid
    }

    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        id: u.value.id
      }
    })

    const project = {
      name: name,
      details: details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy: createdBy,
      assignedUsersList: assignedUsersList
    }

    await addDocument(project)
    if(!response.error) {
      navigate('/')
    }
  }

  return (
    <div className='create-form'>
      <h2 className='page-title'>Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>project name:</span>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>details:</span>
          <textarea 
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
            type="text"
          ></textarea>
        </label>
        <label>
          <span>set due date:</span>
          <input
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
            required
          />
        </label>
        <label>
          <span>project category:</span>
          <Select
            onChange={(option) => setCategory(option)} 
            options={categories}
          />
        </label>
        <label>
          <span>assign to:</span>
          <Select
            onChange={option => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>
        <button className='btn'>Add project</button>
        {formError && <p className='error'>{formError}</p>}
      </form>
    </div>
  )
}

export default Create