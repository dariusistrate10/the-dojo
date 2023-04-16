import { useEffect, useState } from 'react'
import { projectAuth, projectFirestore } from '../firebase/config'
import { useAuthContext } from '../hooks/useAuthContext'

export const useLogout = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const { dispatch, user } = useAuthContext()

    const logout = async () => {

        setIsPending(true)
        setError(null)

        try {

            // update online status
            const { uid } = user
            await projectFirestore.collection('users').doc(uid).update({ online: false })

            await projectAuth.signOut()
            dispatch({ type: 'LOGOUT' })

            // change states
            if(!isCancelled) {
                setError(null)
                setIsPending(false)
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

    return { logout, error, isPending }
}