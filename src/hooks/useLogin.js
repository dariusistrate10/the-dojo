import { useEffect, useState } from 'react'
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from '../hooks/useAuthContext'

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const { dispatch, user } = useAuthContext()
    
    const login = async (email, password) => {

        setIsPending(true)
        setError(null)

        try {

            const response = await projectAuth.signInWithEmailAndPassword(email,password)

            // update online status
            await projectFirestore.collection('users').doc(response.user.uid).update({online: true})

            dispatch({ type: 'LOGIN', payload: response.user })

            // change the states
            if(!isCancelled) {
                setIsPending(false)
                setError(null)
            }

        } catch(err) {
            if(!isCancelled) {
                console.log(err.message)
                setError(err.message)
                setIsPending(false)
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(false)
    }, [])

    return { login, error, isPending }
}