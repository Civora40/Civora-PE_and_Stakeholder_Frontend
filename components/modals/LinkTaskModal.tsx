'use client';

import React, { useState } from 'react';
import { X, Link2, CheckCircle2, AlertTriangle, Briefcase } from 'lucide-react';
import { Submission, ProjectTask, CivoraUser } from '@/types';
import { Button } from '@/components/ui/Button';

interface LinkTaskModalProps {
  submission: Submission;
  tasks: ProjectTask[];
  currentUser: CivoraUser;
  onClose: () => void;
  onSuccess: (updatedSub: Submission) => void;
}

export function LinkTaskModal({
  submission,
  tasks,
  currentUser,
  onClose,
  onSuccess,
}: LinkTaskModalProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(submission.linkedTaskId || '');
  const [activityNote, setActivityNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter tasks to eligible tasks in the submission's project
  const eligibleTasks = tasks.filter((t) => t.projectId === submission.projectId);
  const selectedTask = eligibleTasks.find((t) => t.id === selectedTaskId);

  const handleLink = async () => {
    if (!selectedTaskId) {
      setError('Please select an authorized project task.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/submissions/${submission.id}/link-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: selectedTaskId,
          note: activityNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to link task.');
      }

      onSuccess(data.submission);
      onClose();
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Error linking submission to task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="rounded-2xl bg-white border border-slate-200 max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-slate-900 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#001237] text-[#4FAAA7]">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Encode_Sans_Condensed',sans-serif] uppercase tracking-wide">
              Link Submission to Project Task
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Link <strong className="font-mono text-[#001237]">{submission.identifier}</strong> as supporting field evidence for an assigned activity.
            </p>
          </div>
        </div>

        {/* Project Scope Context */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Briefcase className="w-3.5 h-3.5 text-[#4FAAA7]" />
            Project Scope:
          </span>
          <span className="font-bold text-slate-800">{submission.projectName}</span>
        </div>

        {/* Task Selection */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">
            Select Eligible Assignment / Task:
          </label>
          {eligibleTasks.length === 0 ? (
            <p className="p-3 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs">
              No active tasks found in this project scope.
            </p>
          ) : (
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
            >
              <option value="">-- Choose task to link --</option>
              {eligibleTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  [{t.code}] {t.title} ({t.status.replace('_', ' ')})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selected Task Details */}
        {selectedTask && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-[#4FAAA7]">{selectedTask.code}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 uppercase">
                {selectedTask.status.replace('_', ' ')}
              </span>
            </div>
            <div className="font-semibold text-slate-900">{selectedTask.title}</div>
            <div className="text-[11px] text-slate-500">
              Assigned to: <strong>{selectedTask.assignedPersonnelName}</strong> &bull; Due: {selectedTask.dueDate}
            </div>
          </div>
        )}

        {/* Optional Reviewer Note */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700 block">
            Activity Record / Technical Notes:
          </label>
          <textarea
            rows={2}
            value={activityNote}
            onChange={(e) => setActivityNote(e.target.value)}
            placeholder="Add context on how this submission satisfies or relates to the task..."
            className="w-full rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#4FAAA7] focus:outline-none"
          />
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">
            Engineer: <strong>{currentUser.name}</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={onClose} variant="outline" size="sm" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleLink}
              variant="teal"
              size="sm"
              disabled={isSubmitting || !selectedTaskId}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {isSubmitting ? 'Linking...' : 'Confirm Link'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
