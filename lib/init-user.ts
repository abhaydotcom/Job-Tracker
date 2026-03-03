import { connectDB } from "./db";
import { Board } from "./Models/boards";
import { Column } from "./Models/column";


const DEFAULT_COLUMNS = [
  { name: "Wish List", order: 0},
  { name: "Applied", order: 1 },
  { name: "Interviewing", order: 2 },
  { name: "Offer", order: 3 },
  { name: "Rejected", order: 4 },
];

export async function initUser(userId:string){
    try {
        connectDB();
        const existingBoards=await Board.findOne({userId,name:"Job Hunt"})

        if(existingBoards){
            return existingBoards
        }


      const board = await Board.create({
      name: "Job Hunt",
      userId,
      columns: [],
    });

    const columns=await Promise.all(
        DEFAULT_COLUMNS.map((col)=>
        Column.create({
            name:col.name,
            order:col.order,
            boardId:board._id,  
            jobApplications:[]
        })
        )
    )
    board.columns=columns.map((col)=>col._id);  
    await board.save();
    return board;



    } catch (error) {
        throw error;
    }
}