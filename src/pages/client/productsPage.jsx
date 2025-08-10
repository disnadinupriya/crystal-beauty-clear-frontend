import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader.jsx"; // Assuming you have a Loader component
import React from "react";
import PrductCard from "../../components/products-card.jsx";




export default function ProductPage() {

    const [productList, setProductList] = useState([]);
    const [produstSLoaded,setproductsLoaded] =useState(false);
    useEffect (
        ()=>{
           if(!produstSLoaded){
              axios.get(import.meta.env.VITE_BACKEND_URL+ '/api/product')
            .then((res)=>{
                console.log("Products fetched successfully:", res.data);
                setProductList(res.data);
                setproductsLoaded(true);
            })
            .catch((error)=>{
                console.error("Error fetching products:", error);
            })
        }
            
        },[produstSLoaded]
    )

    return (
        <div className="h-full w-full ">
            {
                produstSLoaded?
                <div className="w-full h-full flex flex-wrap justify-center">
                    {
                        productList.map((product,index) => {
                            return(
                                <PrductCard key={product.productid} product={product} />
                            )
})
                    }
                   
                </div>
                 :
                    <Loader/>
            }
            
        </div>
    );
}
