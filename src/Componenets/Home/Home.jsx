import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'


export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <>
    
    <div className='w-full h-16 bg-black flex items-center justify-between'>
        <div className='flex'>
            <h1 className='text-white text-3xl font-hw ps-4'>Let's Chat</h1>
            
        </div>
        <div className='cursor-pointer' onClick={(e)=>setOpen(true)}>
            <h1 className='text-white pe-4 text-md'>Search</h1>
        </div>

    </div> 
    <div className='w-full ' style={{height:"100vh"}}>
      <div className='grid grid-cols-4 '> 
      <div className='h-full hidden lg:block px-2 py-3'>
        <div className='w-full bg-gray-800 h-full  rounded-md'>

        </div>
      </div>
      <div className='lg:col-span-3 col-span-4  h-max  px-2 py-3'> 
      <div className='w-full bg-gray-800 h-full  rounded-md'>

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
                        <input type="text" className='w-full h-10 rounded-lg outline-blue-300'/>
                        <button className='bg-black text-white px-3 h-10 rounded-lg'>Search</button>
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

    </>

  )
}
