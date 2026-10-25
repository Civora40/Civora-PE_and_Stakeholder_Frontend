'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  FileText,
  Check,
  Search,
} from 'lucide-react';
import { ProjectTask, ActivityRecord, CivoraUser } from '@/types';
import { can } from '@/lib/permissions/rbac';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ActivityTasksProps {
  user: CivoraUser;
  initialTasks: ProjectTask[];
  initialActivities: ActivityRecord[];
}

export function ActivityTasks({
  user,
  initialTasks,
  initialActivities,
}: ActivityTasksProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
  const [activities] = useState<ActivityRecord[]>(initialActivities);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [acceptanceNote, setAcceptanceNote] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const canReview = can(user, 'submissions:review');

  const filteredTasks = tasks.filter((task) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      task.code.toLowerCase().includes(q) ||
      task.title.toLowerCase().includes(q) ||
      task.assignedPersonnelName.toLowerCase().includes(q) ||
      task.projectName.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' ? true : task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAcceptTask = (task: ProjectTask) => {
    if (!canReview) return;

    const updated = tasks.map((t) => {
      if (t.id === task.id) {
        return {
          ...t,
          status: 'completed' as const,
          acceptedBy: user.name,
          acceptedAt: new Date().toISOString(),
          acceptanceNotes: acceptanceNote || 'Engineering sign-off confirmed based on field evidence.',
        };
      }
      return t;
    });

    setTasks(updated);
    setSelectedTask(null);
    setAcceptanceNote('');
    setFeedbackMessage(`Task ${task.code} accepted as complete with engineering sign-off.`);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Activity & Task Progress
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#001237] text-[#4FAAA7]">
              {activities.length} Linked Logs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track civil engineering assignments, verify field communication evidence, and approve completed tasks.
          </p>
        </div>

        {feedbackMessage && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* Critical Principle Notice */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <Clock className="w-4 h-4 text-[#4FAAA7] shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 font-semibold block">Specification Governance Principle:</strong>
          <span className="text-[11px] text-slate-600">
            A WhatsApp or Telegram message represents communication evidence, NOT automatic proof of task completion. Tasks must have valid assignment history and require explicit engineering review and acceptance.
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute inset-y-0 left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, codes, engineers..."
            className="w-full rounded-xl bg-white border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#4FAAA7]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {[
            { label: 'All Tasks', value: 'all' },
            { label: 'Submitted for Review', value: 'submitted_for_review' },
            { label: 'In Progress', value: 'in_progress' },
            { label: 'Blocked', value: 'blocked' },
            { label: 'Completed', value: 'completed' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setStatusFilter(item.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                statusFilter === item.value
                  ? 'bg-[#001237] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="rounded-2xl bg-white border border-slate-200/80 p-5 space-y-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#001237]">
                  {task.code}
                </span>
                <Badge
                  variant={
                    task.status === 'completed'
                      ? 'emerald'
                      : task.status === 'submitted_for_review'
                      ? 'blue'
                      : task.status === 'blocked'
                      ? 'rose'
                      : 'blue'
                  }
                  size="sm"
                >
                  {task.status.replace('_', ' ')}
                </Badge>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {task.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {task.description}
              </p>

              <div className="text-[11px] text-slate-600 space-y-1 pt-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Project:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[180px]">{task.projectName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned To:</span>
                  <span className="font-medium text-slate-800">{task.assignedPersonnelName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Due Date:</span>
                  <span className="font-mono text-slate-700">{task.dueDate}</span>
                </div>
              </div>

              {/* Linked Evidence Count */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#4FAAA7]" />
                  Linked Evidence:
                </span>
                <span className="font-bold text-slate-900">
                  {task.linkedSubmissions.length > 0 ? (
                    <span className="text-emerald-700">{task.linkedSubmissions.length} Submission(s)</span>
                  ) : (
                    <span className="text-slate-400">None linked</span>
                  )}
                </span>
              </div>

              {task.acceptanceNotes && (
                <div className="p-2 rounded-lg bg-emerald-50 text-[11px] text-emerald-800 border border-emerald-200">
                  <strong>Accepted:</strong> {task.acceptanceNotes}
                </div>
              )}
            </div>

            {/* Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                Cat: {task.category}
              </span>
              {task.status === 'submitted_for_review' && canReview ? (
                <Button
                  onClick={() => setSelectedTask(task)}
                  variant="teal"
                  size="sm"
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                >
                  Accept Task
                </Button>
              ) : (
                <Button
                  onClick={() => setSelectedTask(task)}
                  variant="outline"
                  size="sm"
                >
                  Inspect
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Inspection / Acceptance Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="rounded-2xl bg-white border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-900">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#4FAAA7]">{selectedTask.code}</span>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <h3 className="text-base font-bold text-slate-900">{selectedTask.title}</h3>
            <p className="text-xs text-slate-600">{selectedTask.description}</p>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div>Assigned: <strong>{selectedTask.assignedPersonnelName}</strong></div>
              <div>Due Date: <strong>{selectedTask.dueDate}</strong></div>
              <div>Status: <Badge variant="blue" size="sm">{selectedTask.status.replace('_', ' ')}</Badge></div>
            </div>

            {canReview && selectedTask.status !== 'completed' && (
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-slate-700 block">Engineering Acceptance Note:</label>
                <textarea
                  rows={2}
                  value={acceptanceNote}
                  onChange={(e) => setAcceptanceNote(e.target.value)}
                  placeholder="Record formal acceptance note confirming field evidence was verified..."
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#4FAAA7]"
                />
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button onClick={() => setSelectedTask(null)} variant="outline" size="sm">
                Close
              </Button>
              {canReview && selectedTask.status !== 'completed' && (
                <Button
                  onClick={() => handleAcceptTask(selectedTask)}
                  variant="teal"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Accept & Complete
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
