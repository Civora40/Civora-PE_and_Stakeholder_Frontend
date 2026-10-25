'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarRange,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
} from 'lucide-react';
import { CivoraUser, Project } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { STAKEHOLDER_MEETINGS, StakeholderMeeting } from '@/lib/mock-data/stakeholder';

interface StakeholderMeetingScheduleProps {
  user: CivoraUser;
  projects: Project[];
  activeMeetingId?: string;
}

export function StakeholderMeetingSchedule({
  user,
  projects,
  activeMeetingId,
}: StakeholderMeetingScheduleProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [rsvpState, setRsvpState] = useState<Record<string, 'attending' | 'declined' | null>>({});

  // Authorize projects
  const authorizedProjectIds = useMemo(() => {
    if (!user.assignedProjects || user.assignedProjects.length === 0) return new Set<string>();
    if (user.assignedProjects.includes('*')) return new Set(projects.map((p) => p.id));
    return new Set(user.assignedProjects);
  }, [user.assignedProjects, projects]);

  const assignedProjectsList = useMemo(() => {
    return projects.filter((p) => authorizedProjectIds.has(p.id));
  }, [projects, authorizedProjectIds]);

  const authorizedMeetings = useMemo(() => {
    return STAKEHOLDER_MEETINGS.filter((m) => authorizedProjectIds.has(m.projectId));
  }, [authorizedProjectIds]);

  const activeMeeting = useMemo(() => {
    if (!activeMeetingId) return null;
    return authorizedMeetings.find((m) => m.id === activeMeetingId) || null;
  }, [authorizedMeetings, activeMeetingId]);

  const filteredMeetings = useMemo(() => {
    return authorizedMeetings.filter((m) => {
      const matchTab =
        activeTab === 'all' ||
        (activeTab === 'upcoming' && m.status === 'upcoming') ||
        (activeTab === 'completed' && m.status === 'completed');
      const matchProj = selectedProject === 'all' || m.projectId === selectedProject;
      const matchSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.agenda.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTab && matchProj && matchSearch;
    });
  }, [authorizedMeetings, activeTab, selectedProject, searchQuery]);

  const handleRsvp = (meetingId: string, status: 'attending' | 'declined') => {
    setRsvpState((prev) => ({ ...prev, [meetingId]: status }));
  };

  // Detail View
  if (activeMeeting) {
    const isAttending = rsvpState[activeMeeting.id] === 'attending';
    const isDeclined = rsvpState[activeMeeting.id] === 'declined';

    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <Link
            href="/stakeholder/communications/meetings"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Meetings Schedule</span>
          </Link>
        </div>

        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
            <span className="font-mono text-xs font-bold text-[#001237]">
              {activeMeeting.projectName}
            </span>
            <Badge
              variant={
                activeMeeting.status === 'upcoming'
                  ? 'blue'
                  : activeMeeting.status === 'completed'
                  ? 'emerald'
                  : 'rose'
              }
              size="sm"
            >
              {activeMeeting.status.toUpperCase()}
            </Badge>
            <Badge variant="slate" size="sm">
              {activeMeeting.type === 'virtual' ? 'Virtual Conference' : activeMeeting.type === 'hybrid' ? 'Hybrid Session' : 'On-Site Session'}
            </Badge>
          </div>


          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 font-condensed tracking-tight">
              {activeMeeting.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-[#3B68DE]" />
                {activeMeeting.date}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-[#3B68DE]" />
                {activeMeeting.time} ({activeMeeting.timezone})
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                {activeMeeting.type === 'virtual' ? (
                  <Video className="w-4 h-4 text-emerald-600" />
                ) : (
                  <MapPin className="w-4 h-4 text-slate-500" />
                )}
                {activeMeeting.location}
              </span>
            </div>
          </div>

          {activeMeeting.status === 'upcoming' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800">Stakeholder Attendance RSVP</p>
                <p className="text-[11px] text-slate-500">
                  {isAttending
                    ? 'Confirmed: You are marked as attending this session.'
                    : isDeclined
                    ? 'Declined: You will receive the post-meeting executive briefing notes.'
                    : 'Please confirm your attendance for quorum and briefing pack distribution.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRsvp(activeMeeting.id, 'attending')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    isAttending
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {isAttending && <Check className="w-3.5 h-3.5" />}
                    Attending
                  </span>
                </button>
                <button
                  onClick={() => handleRsvp(activeMeeting.id, 'declined')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    isDeclined
                      ? 'bg-slate-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Meeting Agenda
            </h3>
            <ol className="space-y-2 list-decimal list-inside text-xs text-slate-700 font-medium">
              {activeMeeting.agenda.map((item, idx) => (
                <li key={idx} className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-100">
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Invited Stakeholders & Engineering Representatives</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeMeeting.attendees.map((attendee, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/80 text-slate-700 font-medium"
                >
                  {attendee}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meeting Schedule"
        description="Authorized milestone review sessions, site inspection gates, and quarterly stakeholder briefings."
      />


      {/* Tabs and Filters */}
      <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming Meetings
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'completed'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past Sessions
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`text-xs px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none"
            >
              <option value="all">All Projects</option>
              {assignedProjectsList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeetings.map((mtg) => (
          <div
            key={mtg.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:border-[#3B68DE]/40 transition-all space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-semibold text-[#001237] truncate">
                  {mtg.projectName}
                </span>
                <Badge
                  variant={
                    mtg.status === 'upcoming'
                      ? 'blue'
                      : mtg.status === 'completed'
                      ? 'emerald'
                      : 'rose'
                  }
                  size="sm"
                >
                  {mtg.status}
                </Badge>
              </div>

              <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
                <Link
                  href={`/stakeholder/communications/meetings/${mtg.id}`}
                  className="hover:text-[#3B68DE] transition-colors"
                >
                  {mtg.title}
                </Link>
              </h2>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mtg.date}</span>
                  <span className="text-slate-300">•</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{mtg.time} ({mtg.timezone})</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 truncate">
                  {mtg.type === 'virtual' ? (
                    <Video className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  )}
                  <span className="truncate">{mtg.location}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                {mtg.agenda.length} agenda items
              </span>
              <Link
                href={`/stakeholder/communications/meetings/${mtg.id}`}
                className="inline-flex items-center gap-1 text-[#3B68DE] font-semibold hover:underline"
              >
                <span>View Details & Agenda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}

        {filteredMeetings.length === 0 && (
          <div className="col-span-full p-12 text-center rounded-2xl bg-white border border-slate-200/80">
            <CalendarRange className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No Meetings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              There are no scheduled sessions matching your selected filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
