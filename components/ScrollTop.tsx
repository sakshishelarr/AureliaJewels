'use client'
import { useEffect, useState } from 'react'

export default function ScrollTop(){
  const [show,setShow]=useState(false)
  useEffect(()=>{
    const fn=()=>setShow(window.scrollY>600)
    fn(); window.addEventListener('scroll',fn,{passive:true})
    return ()=>window.removeEventListener('scroll',fn)
  },[])
  if(!show) return null
  return (
    <button
      onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
      className="fixed bottom-6 right-6 z-40 rounded-full bg-black text-white px-4 py-3 shadow-lg hover:bg-black/90"
      aria-label="Back to top"
    >
      ↑
    </button>
  )
}
