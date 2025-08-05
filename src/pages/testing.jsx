import { createClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { useState } from "react";
import React from "react";
import mediaUpload from "../../utils/mediaUpload";

// ✅ Initialize once globally
const supabase = createClient(
  "https://guaxykwlwvybejqayzfg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1YXh5a3dsd3Z5YmVqcWF5emZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3OTMsImV4cCI6MjA2OTk5Mjc5M30.29sck266mcjaHW8OeJeGgbWcOVl88yu6CiF687Odi3k"
);

export default function Testing() {
  const [file, setFile] = useState(null);

  function handleFileUpload() {
   mediaUpload(file)
      .then((imageUrl) => {
        console.log("Image URL:", imageUrl);
        toast.success("File uploaded successfully!");
      })
      .catch((error) => {
         console.error("Error uploading file:", error);
         toast.error("Failed to upload file. Please try again.");
      })
   

      }

  return (
    <div className="w-full h-screen bg-red-600 flex flex-col justify-center items-center">
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />

      <button
        onClick={handleFileUpload}
        className="w-[200px] h-[50px] bg-green-400 p-2 m-2"
      >
        Upload
      </button>
    </div>
  );

   }




//https://guaxykwlwvybejqayzfg.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1YXh5a3dsd3Z5YmVqcWF5emZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3OTMsImV4cCI6MjA2OTk5Mjc5M30.29sck266mcjaHW8OeJeGgbWcOVl88yu6CiF687Odi3k
 










/*
import { use, useState } from "react";

export default function Testing() {

   //hooks,
   const [number, setNumber] = useState(0);
   const[status, setStatus] = useState("pending...");


    function increment() {
       let newValue = number + 1;
       setNumber(newValue);
       console.log(number);
    }

    function decrement() {
       let newValue = number - 1;
       setNumber(newValue);
       console.log(number);
    }

    return (
        <div className="w-full h-screen  bg-red-600 flex flex-col justify-center items-center">

            <span className="text-white font-bold">{number}</span>
            <div className="w-full flex justify-center">
                 <button onClick={increment} className="w-[200px] h-[50px] bg-green-400 p-2 m-2" >+</button>
                 <button onClick={decrement} className="w-[200px] h-[50px] bg-green-400 p-2 m-2">-</button>
            </div>


            <span className="text-white font-bold">{status}</span>
            <div className="w-full flex justify-center">
                 <button onClick={
                    () => {
                       setStatus("pass");
                    }
                 } className="w-[200px] h-[50px] bg-green-400 p-2 m-2" >pass</button>
                 <button onClick={
                    () => {
                       setStatus("fail");
                    }
                 } className="w-[200px] h-[50px] bg-green-400 p-2 m-2">fail</button>
            </div>
        </div>
    );
}

*/