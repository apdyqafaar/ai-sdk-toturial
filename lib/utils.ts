import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const normalizeName=(name:string)=>{
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\bw/g, (char)=> char.toLocaleUpperCase())
}