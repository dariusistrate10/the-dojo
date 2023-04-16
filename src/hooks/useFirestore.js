import { useEffect, useReducer, useState } from 'react'
import { projectFirestore, timestamp } from '../firebase/config'

const initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreReducer = (state, action) => {
    switch(action.type) {
        case 'IS_PENDING':
            return { document: null, isPending: true, error: null, success: false}
        case 'ADDED_DOCUMENT':
            return { document: action.payload, isPending: false, error: null, success: true }
        case 'ERROR':
            return { document: null, isPending: false, error: action.payload, success: false }
        case 'DELETED_DOCUMENT':
            return { document: action.payload, isPending: false, error: null, success: true }
        case 'UPDATED_DOCUMENT':
            return { document: action.payload, isPending: false, error: null, success: true }
        default:
            return state
    }
}

export const useFirestore = (collection) => {
    const [response, dispatch] = useReducer(firestoreReducer, initialState)
    const [isCancelled, setIsCancelled] = useState(false)

    // collection refference
    const ref = projectFirestore.collection(collection)

    // adding documents function
    const addDocument = async (doc) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            const createdAt = timestamp.fromDate(new Date())
            const addedDocument = await ref.add({ ...doc, createdAt: createdAt })

            if(!isCancelled) {
                dispatch({ type: 'ADDED_DOCUMENT', payload: addedDocument })
            }

        } catch(err) {
            if(!isCancelled) {
                console.log(err.message)
                dispatch({ type: 'ERROR', payload: err.message })
            }
        }
    }

    // deleting document function
    const deleteDocument = async (id) => {
        dispatch({ type: 'IS_PENDING '})

        try {
            const deletedDocument = await ref.doc(id).delete()
            if(!isCancelled) {
                dispatch({ type: 'DELETED_DOCUMENT', payload: deletedDocument })
            }
        } catch(err) {
            if(!isCancelled) {
                dispatch({ type: 'ERROR', payload: err.message })
            }
        }
    }

    // update document function
    const updateDocument = async (id, updates) => {
        dispatch({ type: 'IS_PENDING' })

        try {
            const updatedDocument = await ref.doc(id).update({updates})
            if(!isCancelled) {
                dispatch({ type: 'UPDATED_DOCUMENT', payload: updateDocument })
            }
            return updateDocument
        } catch(err) {
            if(!isCancelled) {
                dispatch({ type: 'ERROR', payload: err.message })
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    }, [])

    return { addDocument, deleteDocument, updateDocument, response }
}