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