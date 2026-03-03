import { getSession } from "@/lib/Auth/auth";
import { connectDB } from "@/lib/db";
import { Board } from "@/lib/Models/boards";
import { redirect } from "next/navigation";



async function getBoard(userId:string){


  await connectDB();

  const boardDoc=await Board.findOne({
    userId:userId,
    name:"Job Hunt",
  }).populate({
    path:"columns",
    populate:{
      path:"jobApplications"
    }
  })

  // console.log(boardDoc)

}

async function Dashboard() {
  const session=await getSession();
  const board=await getBoard(session?.user.id ?? "")
    if(!session?.user){
      redirect("/sign-in")
    }

 
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard