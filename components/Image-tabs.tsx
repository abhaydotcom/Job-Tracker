"use client"
import Image from "next/image";
import { Button } from "./ui/button"
import { useState } from "react";


function ImageTabs() {
      const [active,setActive]=useState("organize")
  return (
    <>
    
       <section className="border-t bg-white py-16"> 
        <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <div className="flex gap-2 justify-center mb-8">
                <Button
                className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${active=='organize'?"bg-primary text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={()=>setActive("organize")}
                > Organize Application</Button>
                <Button
                 className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${active=='hired'?"bg-primary text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={()=>setActive("hired")}
                >Get Hired</Button>
                <Button 
                className={`rounded-lg px-6 py-3 text-sm font-medium transition-colors ${active=='boards'?"bg-primary text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={()=>setActive("boards")}
                >Manage Boards</Button>
              </div>
              <div className="border overflow-hidden relative mx-auto max-w-5xl rounded-lg border-gray-200 shadow-xl ">
               { active=="organize"&&(
                <Image
                src="/hero-image/hero1.png"
                alt="Organize application"
                width={1200}
                height={800}
                />)}

                  { active=="hired"&&(<Image
                src="/hero-image/hero2.png"
                alt="Get hired"
                width={1200}
                height={800}
                />)}

                 { active=="boards"&&(<Image
                src="/hero-image/hero3.png"
                alt="Manage Boards"
                width={1200}
                height={800}
                />)}
              </div>
            </div>
        </div>
       </section>
    
    
    </>
  )
}

export default ImageTabs