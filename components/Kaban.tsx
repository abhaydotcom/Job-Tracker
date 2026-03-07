"use client"

import { useState } from "react"
import { Board, Columns, JobApplication } from "@/lib/Models/Models.types"
import { Award, Calendar, CheckCircle2, Mic, MoreVertical, Plus, Trash2, XCircle, Briefcase, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import CreateJobDialog from "./create-job-dialog"
import JobApplicationCard from "./Job-applicatoin-card"

interface KabanProps {
  board: Board
  userId: string
}

interface ColorConfig {
  gradient: string
  lightBg: string
  accent: string
  glow: string
  icon: React.ReactNode
  label: string
}

const COLUMN_CONFIG: Array<ColorConfig> = [
  {
    gradient: "from-sky-400 via-cyan-400 to-teal-400",
    lightBg: "bg-sky-50",
    accent: "text-sky-600",
    glow: "shadow-sky-200",
    icon: <Calendar className="h-4 w-4" />,
    label: "Applied"
  },
  {
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    lightBg: "bg-violet-50",
    accent: "text-violet-600",
    glow: "shadow-violet-200",
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: "Screening"
  },
  {
    gradient: "from-emerald-400 via-green-400 to-lime-400",
    lightBg: "bg-emerald-50",
    accent: "text-emerald-600",
    glow: "shadow-emerald-200",
    icon: <Mic className="h-4 w-4" />,
    label: "Interview"
  },
  {
    gradient: "from-amber-400 via-orange-400 to-yellow-400",
    lightBg: "bg-amber-50",
    accent: "text-amber-600",
    glow: "shadow-amber-200",
    icon: <Award className="h-4 w-4" />,
    label: "Offer"
  },
  {
    gradient: "from-rose-400 via-red-400 to-pink-500",
    lightBg: "bg-rose-50",
    accent: "text-rose-600",
    glow: "shadow-rose-200",
    icon: <XCircle className="h-4 w-4" />,
    label: "Rejected"
  }
]


function ColumnCard({
  column,
  config,
  boardId,
  sortedColumns,
  index
}: {
  column: Columns
  config: ColorConfig
  boardId: string
  sortedColumns: Columns[]
  index: number
}) {
  const sortedJobs = [...(column.jobApplications || [])].sort((a, b) => a.order - b.order)

  return (
    <div className="flex flex-col h-full" style={{ animationDelay: `${index * 80}ms` }}>
      {/* Gradient top bar */}
      <div className={`h-1.5 w-full rounded-t-2xl bg-gradient-to-r ${config.gradient} flex-shrink-0`} />

      <div className="flex flex-col flex-1 rounded-b-2xl rounded-tr-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className={`px-4 pt-4 pb-3 ${config.lightBg} border-b border-gray-100 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br ${config.gradient} text-white shadow-md flex-shrink-0`}>
                {config.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-gray-800 leading-none mb-1 truncate">
                  {column.name}
                </h3>
                <span className="text-xs text-gray-400 font-medium">
                  {sortedJobs.length} {sortedJobs.length === 1 ? "job" : "jobs"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${config.gradient} text-white shadow-sm`}>
                {sortedJobs.length}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700 hover:bg-white/80">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-gray-100">
                  <DropdownMenuItem className="text-red-500 hover:text-red-600 focus:text-red-600 rounded-lg">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Column
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

      
        <div className="flex-1 px-3 py-3 space-y-2.5 bg-gray-50/40 overflow-y-auto">
          {sortedJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 opacity-40 select-none">
              <Briefcase className={`h-8 w-8 mb-2 ${config.accent}`} />
              <p className="text-xs text-gray-400 font-medium">No jobs here yet</p>
            </div>
          )}

          {sortedJobs.map((job) => (
            <div key={job._id} className="transition-all duration-200 hover:-translate-y-0.5">
              <JobApplicationCard
                job={{ ...job, columnId: job.columnId || column._id }}
                columns={sortedColumns}
              />
            </div>
          ))}

          <div className="pt-1">
            <CreateJobDialog columnId={column._id} boardId={boardId} />
          </div>
        </div>
      </div>
    </div>
  )
}


function MobileTabBar({
  columns,
  activeIndex,
  onSelect
}: {
  columns: Columns[]
  activeIndex: number
  onSelect: (i: number) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-1 snap-x snap-mandatory"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
      {columns.map((col, i) => {
        const cfg = COLUMN_CONFIG[i] || COLUMN_CONFIG[0]
        const jobs = col.jobApplications?.length || 0
        const isActive = i === activeIndex

        return (
          <button
            key={col._id}
            onClick={() => onSelect(i)}
            className={`
              snap-start flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold
              transition-all duration-200 border
              ${isActive
                ? `bg-gradient-to-r ${cfg.gradient} text-white border-transparent shadow-md`
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }
            `}
          >
            <span className={isActive ? "text-white" : cfg.accent}>{cfg.icon}</span>
            <span className="whitespace-nowrap">{col.name}</span>
            <span className={`
              text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
              ${isActive ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"}
            `}>
              {jobs}
            </span>
          </button>
        )
      })}
    </div>
  )
}


function MobileNavArrows({
  activeIndex,
  total,
  onPrev,
  onNext
}: {
  activeIndex: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex items-center justify-between mt-3 px-1">
      <button
        onClick={onPrev}
        disabled={activeIndex === 0}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 disabled:opacity-30 hover:text-gray-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-gray-100 active:scale-95"
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>

  
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const c = COLUMN_CONFIG[i] || COLUMN_CONFIG[0]
          return (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 bg-gradient-to-r ${c.gradient}
                ${i === activeIndex ? "w-5 h-2 opacity-100" : "w-2 h-2 opacity-25"}`}
            />
          )
        })}
      </div>

      <button
        onClick={onNext}
        disabled={activeIndex === total - 1}
        className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 disabled:opacity-30 hover:text-gray-600 transition-colors py-1.5 px-3 rounded-lg hover:bg-gray-100 active:scale-95"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}


function KanbanHeader({ board }: { board: Board }) {
  const totalJobs = board?.columns?.reduce(
    (acc, col) => acc + (col.jobApplications?.length || 0), 0
  ) || 0

  return (
    <div className="flex items-center justify-between mb-5 sm:mb-8 px-1">
      <div className="flex items-center gap-3 min-w-0">
        
        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight truncate">
            {board?.name || "Job Board"}
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            {totalJobs} total applications
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0 ml-4">
        {COLUMN_CONFIG.map((cfg, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full bg-gradient-to-r ${cfg.gradient}`}
            title={cfg.label}
          />
        ))}
      </div>
    </div>
  )
}


function Kaban({ board, userId }: KabanProps) {
  const [activeCol, setActiveCol] = useState(0)

  const sortedColumns = [...(board?.columns || [])].sort((a, b) => a.order - b.order)

  const getConfig = (index: number): ColorConfig =>
    COLUMN_CONFIG[index] ?? {
      gradient: "from-gray-400 to-gray-500",
      lightBg: "bg-gray-50",
      accent: "text-gray-500",
      glow: "shadow-gray-200",
      icon: <Calendar className="h-4 w-4" />,
      label: "Other"
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 font-sans">

      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 pt-5 sm:pt-6 pb-8">
        <KanbanHeader board={board} />

       
        <div className="md:hidden flex flex-col gap-3">
          <MobileTabBar
            columns={sortedColumns}
            activeIndex={activeCol}
            onSelect={setActiveCol}
          />

          {sortedColumns[activeCol] && (
            <div style={{ minHeight: "60vh" }}>
              <ColumnCard
                column={sortedColumns[activeCol]}
                config={getConfig(activeCol)}
                boardId={board._id}
                sortedColumns={sortedColumns}
                index={activeCol}
              />
            </div>
          )}

          <MobileNavArrows
            activeIndex={activeCol}
            total={sortedColumns.length}
            onPrev={() => setActiveCol(i => Math.max(0, i - 1))}
            onNext={() => setActiveCol(i => Math.min(sortedColumns.length - 1, i + 1))}
          />
        </div>

        <div className="hidden md:block w-full overflow-x-auto pb-6 -mx-1 px-1">
          <div className="flex gap-4 min-w-max items-start">
            {sortedColumns.map((col, key) => (
              <div
                key={col._id}
                className="w-[300px] flex-shrink-0 flex flex-col"
                style={{ minHeight: "520px" }}
              >
                <ColumnCard
                  column={col}
                  config={getConfig(key)}
                  boardId={board._id}
                  sortedColumns={sortedColumns}
                  index={key}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Kaban