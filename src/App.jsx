import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/loginpage'
import AdminPage from './pages/adminPage'
import Testing from './pages/testing'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/client/register'
import HomePage from './pages/client/homePage'
import CheckOutPage from './pages/client/checkOut.jsx'




function App() {
  return (
   <BrowserRouter>
   <Toaster position="top-center"/>
 
   <Routes path="/*">
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/admin/*" element={<AdminPage/>}/>
        
        <Route path="/*" element={<HomePage/>}/>
        <Route path="/testing" element={<Testing/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        
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