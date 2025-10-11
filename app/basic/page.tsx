"use client"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import React, { useState } from 'react'

const basicExample = () => {
    const [generatedText, setGeneratedText]=useState<string>("")
    const [text, setText]=useState<string>("")
    const [isPending, setIspending]=useState(false)

    const generateTextFunc=async(e:any)=>{
      e.preventDefault()
        
      if(!text.trim()) return

      setIspending(true)
      try {
         const response=await fetch("/api/generate", {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({prompt:text})
         })
         const data=await response.json()
         if(data.text){
            setGeneratedText(data.text)
         }else{
              setGeneratedText("Somthing went wrong")
         }

         setIspending(false)
      } catch (error) {
        console.error(error)
      }finally{
        setIspending(false)
      }

    }
  return (
    <div>
        <div className="max-w-2xl mx-auto p-10">
            <div className="flex flex-col space-y-2">
                <h1 className='text-3xl font-bold text-foreground'>Basic Text Generation</h1>
                 <p className='text-muted-foreground text-sm mb-5'>Notaice how you wait for the complete response</p>

                 <div className="border p-3 rounded-md border-gray-400">
                    <form onSubmit={generateTextFunc} className="flex flex-col space-y-4" >
                        <Label id='prompt'>Enter your prompt:</Label>
                        <Textarea onChange={(e)=>setText(e.target.value)} rows={6} id='prompt' placeholder='e.g. Explain quantum computing in simple terms..'/>
                        <Button type='submit' disabled={isPending || !text.trim()} variant={"default"}>{isPending? <><Spinner/> Generating Text...</>:"Generate Text"}</Button>
                    </form>
                    {
                        generatedText&&(
                            <div className="flex flex-col py-6 space-y-3">
                                <Label id='prompt'>Response:</Label> 
                                  <p className='text-muted-foreground '>{generatedText}</p>
                            </div>
                        )
                    }
                 </div>
            </div>
           
        </div>
    </div>
  )
}

export default basicExample