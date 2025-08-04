import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/loginpage'
import AdminPage from './pages/adminPage'
import Testing from './pages/testing'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'




function App() {
  return (
   <BrowserRouter>
   <Toaster position="top-center"/>
 
   <Routes path="/*">
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/admin/*" element={<AdminPage/>}/>
        <Route path="/" element={<hi>Home Page</hi>}/>
        <Route path="/*" element={<h1>404 Not Found</h1>}/>
        <Route path="/testing" element={<Testing/>}/>
   </Routes>
   </BrowserRouter>
    
  )
}

export default App




  

/*return (
    <>
    < div className='w-full h-screen bg-pink-200'>
    <div className=' flex flex-col
                    justify-center 
                   items-center
                   w-[500px]
                   h-[500px]
                   bg-slate-400
                   relative  '
>
      <div className='w-[90px] h-[90px] bg-red-400'></div>
      <div className='w-[90px] h-[90px] bg-yellow-400 absolute right-[50px] top-[50px]'></div>
      <div className='w-[90px] h-[90px] bg-blue-400 fixed right-[50px] bottom-[50px]'></div>
      <div className='w-[90px] h-[90px] bg-green-400'></div> 
 </div>
</div>
     
    
    </>
  )
}*/