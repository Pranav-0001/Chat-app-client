import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer ,toast } from 'react-toastify'

function Login() {
  const navigate = useNavigate()
  const [email,setEmail]=useState()
  const [password,setPassword]=useState()

  const handleLogin=async(e)=>{
    e.preventDefault()
    if(email.trim().length===0 || password.trim().length===0){
      toast.error("Email or Password Field is empty")
    }else{
      const {data}= await axios.post("http://localhost:4000/login",{email,password})
      console.log(data);
      if(data.err){
        toast.error(data.err)
      }else{
        localStorage.setItem("userInfo", JSON.stringify(data))
        navigate("/")
      }
    }
  }
  return (
    
    <>
    <div className='w-full flex lg:mt-40  items-center justify-center '>
      <div className='border-2 w-1/4 bg-transparent border-white  text-white rounded-md'>
        <form onSubmit={handleLogin}>
          <h1 className='text-center mb-4 text-2xl pt-5'>Login</h1>

          <div className='px-8 pb-4'>
            <p>Email</p>
            <input type="email" onChange={e=>setEmail(e.target.value)} className='border w-full rounded-lg h-10 outline-blue-100 text-white bg-transparent' required />
          </div>

          <div className='px-8 pb-4'>
            <p>Password</p>
            <input type="password" onChange={e=>setPassword(e.target.value)} className='border w-full rounded-lg h-10 text-white bg-transparent outline-blue-100' required  />
          </div>

          <div className='flex justify-center pb-6'>
            <button className='border px-4 py-2 rounded-lg bg-transparent    text-white'>Login</button>
          </div>
          <p className='text-white text-center pb-4'>Don't have an account ?  <u onClick={()=>navigate('/signup')} className='font-bold cursor-pointer '>Sign Up</u> </p>

        </form>
      </div> 
      <ToastContainer/>
    </div>
    </>
  )
}

export default Login
