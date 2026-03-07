"use client";

import { Columns, JobApplication } from "@/lib/Models/Models.types";
import { Card, CardContent } from "./ui/card";
import { Edit, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { deleteJobApplication, updateJobApplication } from "@/lib/actions/job-application-data";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface JobApplicationCardProps {
  job: JobApplication;
  columns: Columns[];
}

const JobApplicationCard = ({ job, columns }: JobApplicationCardProps) => {
     const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || "",
    notes: job.notes || "",
    salary: job.salary || "",
    jobUrl: job.jobUrl || "",
    columnId: job.columnId || "",
    tags: job.tags?.join(", ") || "",
    description: job.description || "",
  });

    async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await updateJobApplication(job._id, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });

      if (!result.error) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to move job application: ", err);
    }
  }

   async function handleMove(newColumnId: string) {
    try {
      const result = await updateJobApplication(job._id, {
        columnId: newColumnId,
      });
    } catch (err) {
      console.error("Failed to move job application: ", err);
    }
  }

  async function handleDelete() {
    try {
      const result = await deleteJobApplication(job._id);

      if (result.error) {
        console.error("Failed to delete job application:", result.error);
      }
    } catch (err) {
      console.error("Failed to move job application: ", err);
    }
  }

  return (
    <>
    <Card className="group relative cursor-pointer border bg-white transition-all hover:shadow-md hover:-translate-y-[2px]">
  <CardContent className="p-4 space-y-3">

    {/* Header */}
    <div className="flex items-start justify-between gap-2">

      <div className="space-y-1">
        <h3 className="font-semibold text-sm leading-tight">
          {job.position}
        </h3>

        <p className="text-xs text-muted-foreground">
          {job.company}
          {job.location && (
            <span className="ml-1 text-muted-foreground/70">
              • {job.location}
            </span>
          )}
        </p>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          {columns
            .filter((c) => c._id !== job.columnId)
            .map((column) => (
              <DropdownMenuItem
                key={column._id}
                onClick={() => handleMove(column._id)}
              >
                Move to {column.name}
              </DropdownMenuItem>
            ))}

          <DropdownMenuItem
            className="text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    {/* Description */}
    {job.description && (
      <p className="text-xs text-muted-foreground line-clamp-2">
        {job.description}
      </p>
    )}

    {/* Tags */}
    {job.tags && job.tags.length > 0 && (
      <div className="flex flex-wrap gap-1">
        {job.tags.map((tag, index) => (
          <span
            key={index}
            className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    )}

    {/* Footer */}
    <div className="flex items-center justify-between pt-1">

      {job.salary && (
        <span className="text-xs font-medium text-green-600">
          {job.salary}
        </span>
      )}

      {job.jobUrl && (
        <a
          href={job.jobUrl}
          target="_blank"
          onClick={(e) => e.stopPropagation()}
          className="text-muted-foreground hover:text-primary transition"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}

    </div>

  </CardContent>
</Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Job Application</DialogTitle>
            <DialogDescription>Track a new job application</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    placeholder="e.g., $100k - $150k"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job URL</Label>
                <Input
                  id="jobUrl"
                  type="url"
                  placeholder="https://..."
                  value={formData.jobUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, jobUrl: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="React, Tailwind, High Pay"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Brief description of the role..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default JobApplicationCard;
