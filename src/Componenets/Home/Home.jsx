import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faArrowLeft, faClose, faEdit, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { ToastContainer ,toast } from 'react-toastify'
import axios from 'axios'
import { getSender, getSenderImg } from '../../config/getUser'
import io from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
const Endpoint="http://localhost:4000"
var socket, selectedChatCompare 


export default function Home() {
  const navigate=useNavigate()
  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [search,setSearch]=useState('')
  const [searchUsers,setSearchUsers]=useState([])
  const [selectedChat,setselectedChat]=useState()
  const [mychats,setMyChats]=useState([])
  const [loggeduser,setLoggedUser]=useState()
  const [modalOpen,setModalOpen] = useState(false)
  const [modalSearch,setModalSearch]=useState([])  
  const [modalEditSearch,setmodalEditSearch]=useState([])  
  const [groupChatName,SetgroupChatName]=useState('')
  const [groupMembers,setgroupMembers]=useState([])  
  const [openChat,setOpenChat]=useState()
  const [fetchAgain, setfetchAgain] = useState()

  const [editgroupChatName,SetEditgroupChatName]=useState('')

  const [newuser,setNewUser]= useState()
  const [newmessage,setNewMessage]=useState('')
  const [chatMessages,setchatMessages]=useState([])
  const [socketConnected, setsocketConnected] = useState(false)

  const chatContainerRef = useRef(null);


  const accessChat=async(userId)=>{
    try {
      let user = localStorage.getItem('userInfo')
      user = JSON.parse(user)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const {data} =await axios.post(`${process.env.REACT_APP_BaseUrl}/chat`,{userId},config)
      if(mychats.find((c)=>c._id===data._id)) setMyChats([...mychats])
      else setMyChats([...mychats,data.FullChat])
      
      setselectedChat(data)
    } catch (error) {
      
    }
  }

  const fetchChat= async()=>{
    try {
      let user=localStorage.getItem('userInfo')
      user=JSON.parse(user)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data} = await axios.get(`${process.env.REACT_APP_BaseUrl}/chat`,config)
      setMyChats(data)
    } catch (error) {
      
    }
  }

  const handleCreateGroup=async()=>{
    if(groupChatName.trim().length===0) toast.error("enter a valid group name")
    else if(groupMembers.length<2) toast.error("Add atleast two members")
    else {
      try {
        let user = localStorage.getItem('userInfo')
        user = JSON.parse(user)
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
        const {data} = await axios.post(`${process.env.REACT_APP_BaseUrl}/chat/group`,{
          name:groupChatName,
          users:JSON.stringify(groupMembers.map(u=>u._id))
        },config)
  
        fetchChat()
        

        
      } catch (error) {
        
      }
    }
    
  }
  useEffect(()=>{
    if(!localStorage.getItem("userInfo")) navigate('/login')
  },[])
  useEffect(()=>{
      setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
      fetchChat()
      fetchMessages()
      selectedChatCompare=openChat
  },[openChat,newmessage])


  useEffect(()=>{
    let user = localStorage.getItem('userInfo')
    user = JSON.parse(user)
    socket= io(Endpoint)
    socket.emit("setup",user)
    socket.on('connection',()=>setsocketConnected(true))
  },[])

  useEffect(()=>{
     socket.on('message recieved',(newMessageRecieved)=>{
      if(!selectedChatCompare || selectedChatCompare._id !==newMessageRecieved.chat._id){
        //give notification
        console.log("aa",newMessageRecieved);
      }else{
        
        setchatMessages([...chatMessages,newMessageRecieved])
        
      }
      

     });

  })
  useEffect(() => {
    // Scroll to the bottom of the chat container on every render
    // fetchMessages()
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  });

  


  const handleRenameGroup=async(chat)=>{
    if(editgroupChatName.trim().length===0){
      toast.error(`Name filed empty`)
    }else{
      try {
        let user = localStorage.getItem('userInfo')
        user = JSON.parse(user)
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      const {data} = await axios.put(`${process.env.REACT_APP_BaseUrl}/chat/grouprename`,{chatId:chat._id,chatName:editgroupChatName},config)
      fetchChat()
      setOpenChat(data)
      setOpenEdit(false)
      } catch (error) {
        
      }
      
    }
    
  }
 

  const handleSearch=async()=>{
    
    if(search.trim().length===0){
      toast.warning("Search filed is empty")
      return
    }
    let user=localStorage.getItem('userInfo')
    user=JSON.parse(user)
     try { 
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}= await axios.get(`${process.env.REACT_APP_BaseUrl}/users?search=${search}`,config)
      if(Object.keys(data).length>0){
        setSearchUsers(Object.keys(data).map(key => data[key]))
        
        
      }else{
        toast.error(`User ${search} is not exist`)
      }
      
    } catch (error) {
      
    }
  }


  const addGroupMember =(user)=>{
    if(!groupMembers.includes(user)) setgroupMembers([...groupMembers,user])
    else toast(`${user.name} already added.`)
    
  }

  const removeFromList = (user)=>{
    const newArr=groupMembers.filter(obj=>obj!==user)
    setgroupMembers(newArr)
  }

  const handleModalSearch=async(keyword)=>{
    try { 
      if(keyword.trim().length===0){
        setModalSearch([])
      }else{
      let user=localStorage.getItem('userInfo')
       user=JSON.parse(user)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}= await axios.get(`${process.env.REACT_APP_BaseUrl}/users?search=${keyword}`,config)
     
      if(Object.keys(data).length>0){
        setModalSearch(Object.keys(data).map(key => data[key]))
      }else{
        setModalSearch([])
      }
    }
      
    } catch (error) {
      
    }
  }

  const addGroupMemberSearch=async(keyword)=>{
    try { 
      if(keyword.trim().length===0){
        setmodalEditSearch([])
      }else{
      let user=localStorage.getItem('userInfo')
       user=JSON.parse(user)
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data}= await axios.get(`${process.env.REACT_APP_BaseUrl}/users?search=${keyword}`,config)
     
      if(Object.keys(data).length>0){
        setmodalEditSearch(Object.keys(data).map(key => data[key]))
      }else{
        setmodalEditSearch([])
      }
    }
      
    } catch (error) {
      
    }
  }

  const addNewMember =async (userObj)=>{
  
      if(openChat.users.find(u=>u._id === userObj._id)){
        toast("User already exist")
      }else{
        let user=localStorage.getItem('userInfo')
        user=JSON.parse(user)
        try{
          const config={
            headers:{
              Authorization:`Bearer ${user.token}`
            }
          }
         const {data}=await axios.put(`${process.env.REACT_APP_BaseUrl}/chat/groupadd`,{userId:userObj._id,chatId:openChat._id},config)
      
         setOpenChat(data)
        }catch(err){

        }
      }

    
  }

  const removeMember =async (userObj)=>{
  
   
      let user=localStorage.getItem('userInfo')
      user=JSON.parse(user)
      try{
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }
       const {data}=await axios.put(`${process.env.REACT_APP_BaseUrl}/chat/groupremove`,{userId:userObj._id,chatId:openChat._id},config)
      
       setOpenChat(data)
       if(loggeduser===userObj){
        fetchChat()
        setOpenEdit(false)
        setOpenChat(null)
       }
      }catch(err){

      }
  
}

const addMessage=(e)=>{
  setNewMessage(e.target.value)

}

const sendMessage=async(e)=>{
  if(e.key==="Enter"&&newmessage.trim().length!==0){
    try{
      fetchChat()
      let user=localStorage.getItem('userInfo')
      user=JSON.parse(user)
      const config={
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      }

      const {data} = await axios.post(`${process.env.REACT_APP_BaseUrl}/message`,{content:newmessage.trim(),chatId:openChat._id},config)
      setNewMessage("")
      console.log(data);
      socket.emit('new message',data)
      
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

    }catch(err){

    }
  }
}

  const fetchMessages=async()=>{
    if(!openChat) return 
    try{
      let user=localStorage.getItem('userInfo')
      user=JSON.parse(user)
      const config={
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${user.token}`
        }
      }
      const {data} = await axios.get(`${process.env.REACT_APP_BaseUrl}/message/${openChat._id}`,config)
      console.log(data,"messages");
      setchatMessages(data)
      socket.emit('join chat',openChat._id)
    }catch(err){

    }
  }

  return (
    <>


    



      <div className='w-full h-16 bg-black flex items-center justify-between'>
        <div className='flex'>
          <h1 className='text-white text-3xl font-hw ps-4'>Let's Chat</h1>

        </div>
        <div className='cursor-pointer' onClick={(e) => setOpen(true)}>
          <h1 className='text-white pe-4 text-md '>Search</h1>
        </div>

      </div>

     {/* groupEdit */}

      {openEdit &&
      <div className='pb-8 w-96 border bg-primary-100 fixed left-16 lg:left-96 top-36 rounded-lg'>
        <div className='text-white'>
          <div className='flex justify-end pt-3 pe-3'> 
          <FontAwesomeIcon className='border px-2 py-1' onClick={()=>setOpenEdit(false)} icon={faClose}/>
          </div>
          <div className='flex justify-center'>
            <h1 className='text-3xl pb-6'>{openChat.chatName}</h1>
          </div>
          <div className='w-full px-4'>
          <div className='grid grid-cols-4 gap-1 px-1'>
              {openChat.users.map(obj=>
                <h1 className='text-white bg-red-400 text-center rounded-full mb-2' >{loggeduser._id===obj._id ? "You " :obj.name}  {loggeduser._id===obj._id ? " ": <FontAwesomeIcon onClick={()=>removeMember(obj)} className='' icon={faClose} />} </h1> 
                
              )
              }
            </div>
           <div className='flex gap-2'>
            
           <input placeholder='Update Group Name' onChange={(e)=>SetEditgroupChatName(e.target.value)} className='ps-2 w-full h-10 border-white rounded-md outline-primary-200 text-black' type="text" />
           <button onClick={()=>handleRenameGroup(openChat)} className='bg-green-400 rounded-md px-2'>Update</button>
           </div>
            <p>Add userse</p>
            
            <input onChange={(e)=>addGroupMemberSearch(e.target.value)} className='w-full h-10 border-white rounded-md outline-primary-200 text-black' type="text" />
            
            <div>
              {modalEditSearch.map(obj=> <div onClick={()=>addNewMember(obj)} className='cursor-pointer bg-gray-700 py-1 px-2 mt-1 rounded text-black flex gap-2'>
                <img src={obj.pic} className='h-10 rounded-full' alt="" />
                <h1>{obj.name}</h1>
              </div>)}
            </div>
            <div className='flex justify-end mt-3'>
              <button className='border py-2 px-2 rounded text-red-600 border-red-600' onClick={()=>removeMember(loggeduser)}>Leave Group</button>
            </div>
          </div>  
        </div>
      </div>
      }


      {modalOpen&&<div className='pb-8 w-96 border bg-primary-100 fixed left-16 lg:left-96 top-36 rounded-lg'>
        <div className='text-white'>
          <div className='flex justify-end pt-3 pe-3'> 
          <FontAwesomeIcon className='border px-2 py-1' onClick={()=>setModalOpen(false)} icon={faClose}/>
          </div>
          <div className='flex justify-center'>
            <h1 className='text-xl'>Create Group Chat</h1>
          </div>
          <div className='w-full px-4'>
            <p>Group Name</p>
            <input onChange={(e)=>SetgroupChatName(e.target.value)} className='w-full h-10 border-white rounded-md outline-primary-200 text-black' type="text" />
            <p>Add userse</p>
            
            <input onChange={(e)=>handleModalSearch(e.target.value)} className='w-full h-10 border-white rounded-md outline-primary-200 text-black' type="text" />
            <div className='w-full grid grid-cols-4 gap-2 mt-2'>
             
              {groupMembers.map(obj=>
             <h1 className= ' text-center rounded-xl bg-red-400 mt-' >{obj.name} <FontAwesomeIcon icon={faClose} onClick={()=>removeFromList(obj)} /> </h1>
              )}
            </div>
            <div>
              {modalSearch.map(obj=> <div onClick={()=>addGroupMember(obj)} className='cursor-pointer bg-gray-700 py-1 px-2 mt-1 rounded text-black flex gap-2'>
                <img src={obj.pic} className='h-10 rounded-full' alt="" />
                <h1>{obj.name}</h1>
              </div>)}
            </div>
            <div className='flex justify-center mt-3'>
              <button className='border py-2 px-2 rounded' onClick={handleCreateGroup}>Create Group</button>
            </div>
          </div>  
        </div>
      </div>}



      <div className='w-full ' >
        <div className='grid grid-cols-4 '>
          <div className='h-full hidden lg:block px-2 py-3'>
            <div className='w-full bg-primary-200 h-max  rounded-md  overflow-y-scroll scr'>
              <div className='flex justify-between items-center pt-4 px-4 mb-3'>
                <h1 className='text-white text-2xl  '>My Chats</h1>

                <button onClick={(e)=>setModalOpen(true)} className='bg-white px-3 py-2 rounded-md text-primary-100'><FontAwesomeIcon icon={faAdd}/> New Group</button>
              </div>
              {mychats.map(obj=>
              <div className='w-full  px-3 ' onClick={()=>{setOpenChat(obj); setOpenEdit(false)}}>
                <div className={`${openChat===obj? 'bg-black' : ''} border border-white h-14 rounded-md flex items-center px-2 gap-2 mt-1 text-white`}>
                  <img src={!obj.isGroup ? getSenderImg(loggeduser,obj.users):'https://cdn-icons-png.flaticon.com/512/166/166258.png'} alt="" className='w-10 rounded-full' />
                  <h1 className=''>{!obj.isGroup ? getSender(loggeduser,obj.users):obj.chatName}</h1>
                </div>
              </div>
              )}
              
            </div>
          </div>
          <div className='lg:col-span-3 col-span-4  h-max  px-2 py-3'>
            
            <div className={`w-full bg-gray-800 h-full ${openChat ? 'block' : 'hidden lg:block'}  rounded-md overflow-hidden`}>
              {openChat? <div>
                <div className='w-full h-14 bg-black  flex px-8 py-1 items-center text-white justify-between'>
                  <div className="flex items-center gap-2">
                  <FontAwesomeIcon className='pe-2 font-bold lg:hidden' onClick={()=>setOpenChat(null)} icon={faArrowLeft}/>
                  <img className='rounded-full border bg-primary-100 h-10' src={!openChat.isGroup ? getSenderImg(loggeduser,openChat.users):'https://cdn-icons-png.flaticon.com/512/166/166258.png'} alt="" />
                  <h1>{!openChat.isGroup ? getSender(loggeduser,openChat.users):openChat.chatName}</h1>
                  </div>
                  {openChat.isGroup ?<div>
                    <FontAwesomeIcon onClick={()=>setOpenEdit(true)} icon={faEdit} />
                  </div>:null}
                  
                </div>
                
              </div>
              
              :
               <div className='flex h-full justify-center items-center'>
                <h1 className='text-white text-2xl'>Click On a user to start chatting</h1>
              </div> }
              <div ref={chatContainerRef} className=' overflow-y-scroll h-4/5 scr'>
                  {chatMessages.map(obj=>
                    <div className= {` px-2 flex gap-1 w-full  mt-2 items-top ${obj.sender._id===loggeduser._id ? 'justify-end' : 'justify-startt' }  `}> 
                    {obj.sender._id!==loggeduser._id ? <img src={obj.sender.pic}   className='h-8   rounded-full'/> : null }
                    <p className={` rounded-lg ${obj.sender._id===loggeduser._id ? 'bg-blue-300 text-end ps-2 py-2 pe-2' : 'bg-green-200 text-start ps-2 pe-2' } break-words  max-w-sm `}>{obj.content}</p></div>
                    )}
                </div>
               
              <div className='h-full w-full flex items-end '>
                <div className=' h-14  w-full flex gap-4 sticky  mx-2 ' style={{bottom:"1px"}}>
                  <input type="text" className='w-full h-10 rounded-lg   text-xl px-5 ' value={newmessage} onChange={addMessage} onKeyDown={sendMessage}/>
                  
                 

                </div>

              </div>
            </div>
            <div className={`bg-primary-200 h-full overflow-y-scroll scr ${openChat ?  'hidden lg:hidden' :'block lg:hidden'  } rounded-md`}>
            <div className='flex justify-between items-center pt-4 px-4 mb-3 '>
                <h1 className='text-white text-2xl  '>My Chats</h1>

                <button onClick={(e)=>setModalOpen(true)} className='bg-white px-3 py-2 rounded-md text-primary-100'><FontAwesomeIcon icon={faAdd}/> New Group</button>
              </div>
            {mychats.map(obj=>
              <div className='w-full py-0 px-2'>
                <div onClick={()=>setOpenChat(obj)} className='border border-white h-14 rounded-md flex items-center px-2 gap-2 text-white'>
                  <img src={!obj.isGroup ? getSenderImg(loggeduser,obj.users):'https://cdn-icons-png.flaticon.com/512/166/166258.png'} alt="" className='w-10 rounded-full' />
                  <h1 className=''>{!obj.isGroup ? getSender(loggeduser,obj.users):obj.chatName}</h1>
                </div>
                
              </div>
              )}
            </div>
          </div>
        </div>
      </div>




      









      <Transition.Root show={open} as={Fragment}>

        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-primary-100 py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-white">
                          Search User
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className='flex gap-3 items-center'>
                          <input type="text" onChange={(e)=>setSearch(e.target.value)} className='w-full h-10 rounded-lg outline-blue-300' />
                          <button className='bg-black text-white px-3 h-10 rounded-lg' onClick={handleSearch}>Search</button>
                        </div>
                        <div>
                          {searchUsers.map((obj)=> <div onClick={()=>accessChat(obj._id)} key={obj._id} className='border border-white rounded-md flex mt-2 py-2 ps-2'>
                            <div className='flex items-center gap-2 text-white '>
                              <img className='h-10 rounded-full' src={obj.pic} alt="" />
                              <div>
                              <h1 className='font-mono text-md'>{obj.name}</h1>
                              <h1 className='font-hw'>{obj.email}</h1>
                              </div>
                            </div>
                          </div>)}
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <ToastContainer/>
    </>

  )
}
