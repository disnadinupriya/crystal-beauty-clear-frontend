import { Link } from "react-router-dom";

export default function PrductCard(props) {
    
const product = props.product;
    return (
        <Link className="w-[250px] h-[300px] bg-amber-20 m-4 flex flex-col justify-between shadow-2xl rounded-lg">
            <img
                  src={product.Image?.[0]} // ✅ Use correct case + first array item
                  alt={product.name}
                  className="w-full h-[220px] object-cover"
            />
            <div className=" h-[110px] w-full">
                <span className="text-lg font-semibold">{product.name}</span>
                <p>${product.price.toFixed(2)}<span>{product.price < product.lableprice &&product.lableprice.toFixed(2)}</span></p>
            </div>
        </Link>
        
        
    ); 
}