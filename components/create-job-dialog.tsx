"use client"

import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { createJobApplication } from "@/lib/actions/job-application-data"

interface CreateJobDialogProps{
    columnId:string,
    boardId:string
}

const INITIAL_FORM_DATA = {
  company: "",
  position: "",
  location: "",
  notes: "",
  salary: "",
  jobUrl: "",
  tags: "",
  description: "",
};

function CreateJobDialog({columnId,boardId}:CreateJobDialogProps) {

    const[open ,setOpen]=useState<boolean>(false)
    const[form,setForm]=useState(INITIAL_FORM_DATA)

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        try {
            const res=await createJobApplication({...form,columnId,boardId,tags:form.tags.split(",").map((tag)=>tag.trim()).filter((tag)=>tag.length>0) })

        if (!res.error) {
        setForm(INITIAL_FORM_DATA);
        setOpen(false);
      } else {
        console.error("Failed to create job: ", res.error);
      }
        } catch (error) {
            console.error("Failed to add job application:", error);
        }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            <Button
                variant="outline"
          className="w-full mb-4 justify-start text-muted-foreground border-dashed border-2 hover:border-solid hover:bg-muted/50"
     
            >
               <Plus className="mr-2 h-4 w-4" /> Add Job</Button>
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Job Application</DialogTitle>
                <DialogDescription>Track a new job application</DialogDescription>
            </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company *</Label>
                                <Input
                                id="company"
                                required
                                value={form.company}
                                onChange={(e)=>setForm({...form,company:e.target.value})}
                                />
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="position">Position *</Label>
                                <Input
                                id="position"
                                required
                                value={form.position}
                                onChange={(e)=>setForm({...form,position:e.target.value})}
                                />
                            </div>
                            </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                id="location"
                                value={form.location}
                                onChange={(e)=>setForm({...form,location:e.target.value})}
                                />
                            </div>

                             <div className="space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input
                                id="salary"
                                placeholder="e.g. $80,000 or $80k"
                                value={form.salary}
                                onChange={(e)=>setForm({...form,salary:e.target.value})}
                                />
                            </div>
                        </div>
                    <div className="space-y-2">
                        <Label htmlFor="joburl">Job URL  </Label>
                        <Input
                        id="joburl"
                        type='url'
                        placeholder="https://..."
                        value={form.jobUrl}
                        onChange={(e)=>setForm({...form,jobUrl:e.target.value})}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor="tags"> Tags (comma-separated)</Label>
                        <Input 
                        id="tags"
                        placeholder="React, tailwind, High Pay"
                        value={form.tags}
                        onChange={(e)=>setForm({...form,tags:e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                           id="description"
                           rows={3}
                           placeholder="Brief description of the role..."
                           value={form.description}
                           onChange={(e)=>setForm({...form,description:e.target.value})}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes"> Notes</Label>
                        <Textarea  
                        id="notes"
                        rows={4}
                        placeholder="Additional notes or thoughts about this application..."
                        value={form.notes}
                        onChange={(e)=>setForm({...form,notes:e.target.value})}
                        />
                    </div>


                    </div>
                <DialogFooter>
                    <Button 
                     type="button"
                     variant="outline"
                     onClick={()=>setOpen(!true)}
                    >Cancel</Button>
                    <Button type='submit'>Add Application</Button>
                </DialogFooter>

                </form>

        </DialogContent>

    </Dialog>
  )
}

export default CreateJobDialog