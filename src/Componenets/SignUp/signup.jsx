import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ToastContainer ,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
    const navigate=useNavigate()
    const [name,setName]=useState()
    const [email,setEmail]=useState()
    const [password,setpassword]=useState()
    const [pic,setPic]=useState()
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
      if(localStorage.getItem("userInfo")) navigate('/')
    },[])
    const generateUrl=(img)=>{
        
        setLoading(true)
        
        if(img===undefined){
        
            setLoading(false)
        }else{
            const data=new FormData()
            data.append("file",img)
            data.append("upload_preset","chat-app")
            data.append("cloud_name","pranav123")
            fetch("https://api.cloudinary.com/v1_1/pranav123/image/upload",{
                method:"POST",
                body:data
            }).then((res)=> res.json())
            .then((data)=>{
               
                setPic(data.url.toString())
                setLoading(false)
            }).catch(err=>{
               
                setLoading(false)
            })
        }

    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        try{
            if(name && email && password){
              const config = {
                headers: {
                  "Content-type": "application/json"
                }
              }
              const { data } = await axios.post(`${process.env.REACT_APP_BaseUrl}/register`, {
                name: name,
                email: email,
                password: password,
                pic: pic
              }, config);
              
              if(data.message){
                toast.error(data.message)
              }else{
              localStorage.setItem("userInfo", JSON.stringify(data))
              navigate('/')
              }
              
          }else{
            
          }
        }catch(err){
            console.log(err);
        }
    }
  return (
    <>
    <div className='w-full flex lg:mt-40  items-center justify-center px-4 mt-16 md:mt-0'>
      <div className='border-2 lg:w-1/4 bg-transparent border-white  text-white rounded-md'>
        <form onSubmit={handleSubmit}>
          <h1 className='text-center mb-4 text-2xl pt-5'>SignUp</h1>

          <div className='px-8 pb-4'>
            <p>Email</p>
            <input type="email" onChange={e=>setEmail(e.target.value)} className='border w-full rounded-lg h-10 outline-blue-100 text-white bg-transparent' required />
          </div>

          <div className='px-8 pb-4'>
            <p>Username</p>
            <input type="text" onChange={e=>setName(e.target.value)} className='border w-full rounded-lg h-10 outline-blue-100 text-white bg-transparent' required />
          </div>

          <div className='px-8 pb-4'>
            <p>Profile Pic</p>
            <input type="file" onChange={e=>generateUrl(e.target.files[0])} className='border w-full rounded-lg pt-1 ps-2 h-10 outline-blue-100 text-white bg-transparent'  />
          </div>

          <div className='px-8 pb-4'>
            <p>Password</p>
            <input type="password" onChange={e=>setpassword(e.target.value)} className='border w-full rounded-lg h-10 text-white bg-transparent outline-blue-100' required  />
          </div>

          <div className='flex justify-center pb-2'>
          
            <button className='border px-4 py-2 rounded-lg bg-transparent    text-white'>{loading?<FontAwesomeIcon icon={faSpinner} spinPulse /> :"Signup"}</button>
            
          </div>
          <p className='text-white text-center pb-4'>already have an account ?  <u onClick={()=>navigate('/login')} className='font-bold cursor-pointer '>Login</u> </p>
        </form>
      </div>
<ToastContainer/> 
    </div>
    
    </>
  )
}

export default Signup
