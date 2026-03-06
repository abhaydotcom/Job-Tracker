"use client"

import { Board, Columns, JobApplication } from "@/lib/Models/Models.types"
import { Award, Calendar, CheckCircle2, Mic, MoreVertical, Trash2, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import CreateJobDialog from "./create-job-dialog"
import JobApplicationCard from "./Job-applicatoin-card"

 

interface KabanProps {
    board:Board,
    userId:string
}

interface colorConfig{
    color:string,
    icon:React.ReactNode
}

const COLUMN_CONFIG:Array<colorConfig>=[
    {
        color:"bg-cyan-500",
        icon:<Calendar className="h-4 w-4" />
    },
    {
        color:"bg-purple-500",
        icon:<CheckCircle2 className="h-4 w-4"/>
    },
    {
        color:"bg-green-500",
        icon:<Mic className="h-4 w-4"/>
    },
    {
        color:"bg-yellow-500",
        icon:<Award className="h-4 w-4"/>
    },
    {
        color:"bg-red-500",
        icon:<XCircle className="h-4 w-4"/>
    }
]

function DroppableColums({
    column,
    config,
    boardId,
    sortedColumns
}:{
    column:Columns,
    config:colorConfig,
    boardId:string,
    sortedColumns:Columns[]
}){  const sortedJobs = column.jobApplications?.sort((a, b) => a.order - b.order) || [];
    return(
       <Card className="min-w-[300px] flex-shrink-0 shadow-md p-0" >
        <CardHeader className={`${config.color} text-white rounded-t-lg pb-3 pt-3 `} >
            <div className="flex items-center justify-between">
                <div className=" flex items-center gap-2">
                    {config.icon}
                   
                    <CardTitle className="text-white text-base font-semibold">{column.name}</CardTitle>
                </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                             variant="ghost"
                             size="icon"
                             className="h-6 w-6 text-white hover:bg-white/20"
                                >
                                <MoreVertical className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Trash2 className="mr-2 w-4 h-4" />
                                Delete Column   
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
            </div>
        </CardHeader>
        <CardContent className={`space-y-2 pt-4 bg-gray-50/50 min-h[400px] rounded-b-lg  `} >
        {
            sortedJobs.map((job,key)=>(
                <SortableJobCard key={key} job={{...job,columnId:job.columnId  || column._id} } columns={sortedColumns} />
            ))
        }
        <CreateJobDialog columnId={column._id} boardId={boardId} />

        </CardContent>

       </Card>
    )
}

function SortableJobCard({job,columns}:{job:JobApplication,columns:Columns[]}){
    return <div>
        <JobApplicationCard job={job} columns={columns} />
    </div>

}


function Kaban({board,userId}:KabanProps) {
    const columns=board?.columns
    const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];

  return (

   <div className="space-y-4">
    <div className="flex gap-4 overflow-x-auto pb-4">
        {
            columns?.map((col,key)=>{
                const config=COLUMN_CONFIG[key] || {
                    color:"bg-gray-500",
                    icon:<Calendar className="h-4 w-4" />
                }
                return (
                    <DroppableColums  
                    key={key}
                    column={col}
                    config={config}
                    boardId={board._id}
                    sortedColumns={sortedColumns}
                    />
                )
            })
        }
    </div>
   </div>

  )
}

export default Kaban