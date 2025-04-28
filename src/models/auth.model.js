import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"

export async function signIn(email, password) {
  try {
    const auth = getAuth()
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Error signing in:", error)
    throw error
  }
}

export async function signUp(email, password) {
  try {
    const auth = getAuth()
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  }
}

export async function logout() {
  try {
    const auth = getAuth()
    await signOut(auth)
    return true
  } catch (error) {
    console.error("Error logging out:", error)
    throw error
  }
}
