import { Button } from "@/components/ui/button";
import Link from "next/link"


export default function Home() {
  return (

   <div className="min-h-screen  flex-col bg-white">
     <main className="flex-1">
       <section className="container mx-auto px-4 py-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-black font-bold text-6xl mb-6">
            A better way to track job applications
          </h1>
          <p className="text-muted-foreground text-xl mb-10">
            Capture, manage, and track your job applications in one place. 
          </p>
          <div className="flex flex-col items-center gap-4">
           <Link href="/about">
               <Button>Strat for free</Button>
           </Link>
            <p>Free forever. No credit card required</p>
          </div>
        </div>

       </section>
     </main>
   </div>
 
  );
}
