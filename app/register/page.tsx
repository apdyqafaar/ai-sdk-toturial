"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import React, { useState } from "react"

const registerUser = () => {
    const [name, setName]=useState<string>("")
    const [email, setEmail]=useState<string>("")
    const [age, setAge]=useState<number>(0)
    const [Ispending, setIspending]=useState(false)

    const handleForm=async(e:React.FocusEvent)=>{
    e.preventDefault()
   

     if(!name.trim() || !email.trim() || age <1){
        alert("missing details")
        return
     }

    try {
         setIspending(true)
        const response=await fetch("/api/users", {
            method:"POST",
            headers:{ "Content-Type":"application/json"},
            body:JSON.stringify({name, email, age})
        })

        if(!response.ok){
            const {error}=await response.json()
            console.log(error)
            // throw new Error(error || " Request Failed")
        }

        setEmail("")
        setName("")
        
    } catch (error:any) {
        console.log(error)
        alert(error.message)
        setIspending(false)
    }finally{
        setIspending(false)
    }
    }
  return (
    <div className='max-w-2xl p-10'>

        <form onSubmit={handleForm} className=" flex flex-col gap-4">
            <Input type="text" value={name} onChange={(e)=> setName(e.target.value)} required name="name" placeholder="Name"/>
            <Input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required name="email" placeholder="Email"/>
            <Input type="number"  value={age} onChange={(e)=> setAge(Number(e.target.value))} required name="age" placeholder="age"/>
            <Button>{Ispending?<Spinner/> :"Register"}</Button>
        </form>
    </div>
  )
}

export default registerUser