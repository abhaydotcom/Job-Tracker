"use client";
import { Columns, JobApplication } from "@/lib/Models/Models.types";
import { Card, CardContent } from "./ui/card";
import { Edit, ExternalLink, MoreVertical, Trash2, MoveRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { deleteJobApplication, updateJobApplication } from "@/lib/actions/job-application-data";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
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
      if (!result.error) setIsEditing(false);
    } catch (err) {
      console.error("Failed to update job application:", err);
    }
  }

  async function handleMove(newColumnId: string) {
    try {
      await updateJobApplication(job._id, { columnId: newColumnId });
    } catch (err) {
      console.error("Failed to move job application:", err);
    }
  }

  async function handleDelete() {
    try {
      const result = await deleteJobApplication(job._id);
      if (result.error) console.error("Failed to delete:", result.error);
    } catch (err) {
      console.error("Failed to delete job application:", err);
    }
  }

  return (
    <>
      {/* ── Card ── */}
      <Card className="group relative cursor-pointer border border-border/60 bg-card hover:bg-muted/40 transition-all duration-200 hover:shadow-md rounded-xl">
        <CardContent className="p-3 sm:p-4 space-y-2.5">

          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex gap-2.5 min-w-0">
              {/* Avatar */}
              <div className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-md bg-primary/10 text-primary font-semibold text-sm">
                {job.company.charAt(0)}
              </div>

              <div className="space-y-0.5 min-w-0">
                <h3 className="text-sm font-semibold leading-none truncate">
                  {job.position}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {job.company}
                  {job.location && (
                    <span className="text-muted-foreground/70"> • {job.location}</span>
                  )}
                </p>
              </div>
            </div>

            {/* Actions — always visible on mobile, hover-only on desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                {columns.filter((c) => c._id !== job.columnId).length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    {columns
                      .filter((c) => c._id !== job.columnId)
                      .map((column) => (
                        <DropdownMenuItem
                          key={column._id}
                          onClick={() => handleMove(column._id)}
                        >
                          <MoveRight className="mr-2 h-4 w-4 text-muted-foreground" />
                          Move to {column.name}
                        </DropdownMenuItem>
                      ))}
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          {job.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          )}

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          {(job.salary || job.jobUrl) && (
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              {job.salary ? (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  {job.salary}
                </span>
              ) : <span />}

              {job.jobUrl && (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-primary transition p-1 -m-1 rounded"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          )}

        </CardContent>
      </Card>

      {/* ── Edit Dialog ── */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl max-h-[90dvh] overflow-y-auto rounded-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Edit Job Application</DialogTitle>
            <DialogDescription>Update the details for this application</DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={handleUpdate}>
            {/* Company + Position */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
            </div>

            {/* Location + Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  placeholder="e.g., $100k – $150k"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>
            </div>

            {/* Job URL */}
            <div className="space-y-1.5">
              <Label htmlFor="jobUrl">Job URL</Label>
              <Input
                id="jobUrl"
                type="url"
                placeholder="https://..."
                value={formData.jobUrl}
                onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags <span className="text-muted-foreground font-normal">(comma-separated)</span></Label>
              <Input
                id="tags"
                placeholder="React, Tailwind, High Pay"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Brief description of the role..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            {/* Footer buttons — stacked on mobile */}
            <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobApplicationCard;