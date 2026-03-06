"use server"

import { getSession } from "../Auth/auth";
import { connectDB } from "../db";
import { Board } from "../Models/boards";
import { Column } from "../Models/column";
import { JobApplication } from "../Models/job-application";


interface JobApplicationProps {
  company: string;
  position: string;
  location?: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  columnId: string;
  boardId:string;
  tags?: string[];
  description?: string;
}


export async function createJobApplication(data: JobApplicationProps) {
    const session=await getSession()
    if(!session?.user) {
        return {error:"Unauthorized"}
    }
    await connectDB()

    const {company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        tags,
        description ,
        columnId,
        boardId
        }=data



      if (!company || !position || !columnId || !boardId) {
        return { error: "Missing required fields" };
        }

     const board = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: "Board not found" };
  }

   const column = await Column.findOne({
    _id: columnId,
    boardId: boardId,
  });
   
  if (!column) {
    return { error: "Column not found" };
  }

  const maxOrder= (await JobApplication.findOne({columnId}).sort({order:-1}).select("order").lean()) as {order:number} | null

  const newJobApplication = await JobApplication.create({
        company,
        position,
        location,
        notes,
        salary,
        jobUrl,
        columnId,
        boardId,
        userId: session.user.id,
        tags:tags || [],
        description,
        status:"applied",
        order: maxOrder ? maxOrder.order + 1 : 0,
  })

    await Column.findByIdAndUpdate(columnId,{$push:{jobApplications:newJobApplication._id}})

    return {data:JSON.parse(JSON.stringify(newJobApplication))}

}