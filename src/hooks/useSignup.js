import { useEffect, useState } from 'react'
import { projectAuth, projectFirestore, projectStorage } from '../firebase/config'
import { useAuthContext } from '../hooks/useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const { dispatch } = useAuthContext()

    const signup = async (email, password, displayName, thumbnail) => {

        try {
            setIsPending(true)
            const response = await projectAuth.createUserWithEmailAndPassword(email, password)

            if(!response) {
                throw new Error('Could not complete signup')
            }

            // upload user thumbnail
            // const uploadPath = `thumbnails/${response.user.uid}/${thumbnail.name}`
            // const img = await projectStorage.ref(uploadPath).put(thumbnail)
            // const imgUrl = await img.ref.getDownloadURL()

            await response.user.updateProfile({ displayName: displayName })

            // create a user document
            await projectFirestore.collection('users').doc(response.user.uid).set({
                online: true,
                displayName: displayName
                // photoURL: imgUrl
            })
            
            dispatch({ type: 'LOGIN', payload: response.user })

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

    return { signup, error, isPending }
}