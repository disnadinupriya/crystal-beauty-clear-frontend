import { Link } from "react-router-dom";


export default function PrductCard(props) {
    
const product = props.product;
    return (
        <Link to={"/overview/" + product.productid} className="w-[250px] h-[300px] bg-amber-20 m-4 flex flex-col justify-between shadow-2xl rounded-lg">
            <img
                  src={product.Image?.[0]} // ✅ Use correct case + first array item
                  alt={product.name}
                  className="w-full h-[220px] object-cover"
            />
            <div className=" h-[110px] w-full flex flex-col justify-center px-2 ">
                <p className="text-gray-400">{ product.productid }</p>
                <p className="text-lg font-semibold">{product.name}</p>
                <p className="text-lg font-semibold text-gray-600">
                         ${product.price.toFixed(2)}
                                {product.lablePrice && product.lablePrice > product.price && (
                                <span className="line-through text-sm text-gray-500 text-md ml-2">
                                ${product.lablePrice.toFixed(2)}
                                 </span>
                              )}
                </p>

            </div>
        </Link>
         
        
    ); 
}