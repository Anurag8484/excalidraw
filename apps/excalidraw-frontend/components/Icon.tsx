import { ReactNode } from "react";



export default function Icon({
    icon, onClick, activated
}:{icon:ReactNode, onClick: () => void, activated: boolean}){
return <div className={`cursor-pointer rounded-full border p-2 bg-black hover:bg-neutral-800 ${activated?"text-red-700":"text-white"}`} onClick={onClick}>
    {icon}
</div>
}