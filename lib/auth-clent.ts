import {createAuthClient} from "better-auth/react"
export const authCLient=createAuthClient({
    baseURL:"http://localhost:3000"
})
export const {signIn, signOut, signUp, useSession}=authCLient
