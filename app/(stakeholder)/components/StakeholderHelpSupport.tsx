'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  LifeBuoy,
  HelpCircle,
  MessageSquare,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Send,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CivoraUser } from '@/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import {
  STAKEHOLDER_SUPPORT_TICKETS,
  STAKEHOLDER_FAQS,
  StakeholderSupportTicket,
} from '@/lib/mock-data/stakeholder';

interface StakeholderHelpSupportProps {
  user: CivoraUser;
  activeTicketId?: string;
}

export function StakeholderHelpSupport({ user, activeTicketId }: StakeholderHelpSupportProps) {
  const [tickets, setTickets] = useState<StakeholderSupportTicket[]>(STAKEHOLDER_SUPPORT_TICKETS);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New ticket form
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<'Data Access' | 'Report Clarification' | 'Technical' | 'General'>('Report Clarification');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [newMessage, setNewMessage] = useState('');

  // Ticket reply
  const [replyText, setReplyText] = useState('');

  const activeTicket = useMemo(() => {
    if (!activeTicketId) return null;
    return tickets.find((t) => t.id === activeTicketId) || null;
  }, [tickets, activeTicketId]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    const newTicket: StakeholderSupportTicket = {
      id: `tkt_0${tickets.length + 1}`,
      ticketNumber: `TKT-2026-${Math.floor(100 + Math.random() * 900)}`,
      subject: newSubject.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'Open',
      createdAt: 'Just now',
      lastUpdated: 'Just now',
      messages: [
        {
          sender: user.name,
          timestamp: 'Just now',
          text: newMessage.trim(),
          isStaff: false,
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setIsCreating(false);
    setNewSubject('');
    setNewMessage('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    const updated = tickets.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          lastUpdated: 'Just now',
          messages: [
            ...t.messages,
            {
              sender: user.name,
              timestamp: 'Just now',
              text: replyText.trim(),
              isStaff: false,
            },
          ],
        };
      }
      return t;
    });

    setTickets(updated);
    setReplyText('');
  };

  // Detail View
  if (activeTicket) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <Link
            href="/stakeholder/account/support"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Help & Support</span>
          </Link>
        </div>

        <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
            <span className="font-mono text-xs font-bold text-slate-400">
              {activeTicket.ticketNumber}
            </span>
            <Badge
              variant={
                activeTicket.status === 'Resolved'
                  ? 'emerald'
                  : activeTicket.status === 'In Progress'
                  ? 'blue'
                  : 'teal'
              }
              size="sm"
            >
              {activeTicket.status}
            </Badge>
            <Badge variant="slate" size="sm">
              {activeTicket.category}
            </Badge>
            <span className="text-[11px] text-slate-400 font-mono ml-auto">
              Opened: {activeTicket.createdAt}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900 font-condensed tracking-tight">
              {activeTicket.subject}
            </h1>
            <p className="text-xs text-slate-500">
              Support Priority: <strong className="text-slate-700">{activeTicket.priority}</strong> • Last Updated: {activeTicket.lastUpdated}
            </p>
          </div>

          {/* Conversation history */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Communication Thread
            </h3>

            <div className="space-y-3">
              {activeTicket.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl space-y-1.5 text-xs ${
                    msg.isStaff
                      ? 'bg-blue-50/70 border border-blue-200/60 ml-0 sm:ml-4'
                      : 'bg-slate-50 border border-slate-200/70 mr-0 sm:mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      {msg.isStaff ? (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#3B68DE]" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-slate-400" />
                      )}
                      {msg.sender}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-normal">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Reply form */}
          {activeTicket.status !== 'Resolved' && (
            <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 space-y-3">
              <label className="text-xs font-semibold text-slate-700">Add Follow-up Message</label>
              <textarea
                rows={3}
                placeholder="Type your response to the support specialist..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Help & Stakeholder Support"
          description="Find guidance on released reports, governance standards, and track your institutional support inquiries."
        />

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#001237] hover:bg-[#18243D] text-white text-xs font-semibold shadow-2xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isCreating ? 'Cancel Request' : 'New Support Request'}</span>
        </button>
      </div>

      {/* New Ticket Form Modal/Card */}
      {isCreating && (
        <form onSubmit={handleCreateTicket} className="p-6 rounded-2xl bg-white border border-[#3B68DE]/40 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              Create New Stakeholder Support Request
            </h2>
            <p className="text-xs text-slate-500">
              Assigned directly to Civora Client Relations and Technical Advisory staff.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Inquiry Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white font-medium"
              >
                <option value="Report Clarification">Report Clarification & Data Evidence</option>
                <option value="Data Access">Project Access & Seat Provisioning</option>
                <option value="Technical">Portal Technical Assistance</option>
                <option value="General">General Inquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Priority Tier</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white font-medium"
              >
                <option value="Low">Low — General inquiry</option>
                <option value="Medium">Medium — Milestone review preparation</option>
                <option value="High">High — Urgent board briefing requirement</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Subject</label>
            <input
              type="text"
              placeholder="e.g., Query regarding concrete cube strength results in Report REP-2026-M10"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Detailed Message</label>
            <textarea
              rows={4}
              placeholder="Describe your request in detail..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full text-xs py-2.5 px-3 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3B68DE]/20"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs px-5 py-2 bg-[#001237] hover:bg-[#18243D] text-white rounded-lg font-semibold shadow-2xs"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      )}

      {/* Existing Tickets */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#3B68DE]" />
            <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
              My Support Requests ({tickets.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Private & Confidential</span>
        </div>

        <div className="divide-y divide-slate-100">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2.5 rounded-xl transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-slate-400">
                    {ticket.ticketNumber}
                  </span>
                  <Badge
                    variant={
                      ticket.status === 'Resolved'
                        ? 'emerald'
                        : ticket.status === 'In Progress'
                        ? 'blue'
                        : 'teal'
                    }
                    size="sm"
                  >
                    {ticket.status}
                  </Badge>
                  <Badge variant="slate" size="sm">
                    {ticket.category}
                  </Badge>

                </div>
                <h3 className="text-xs font-bold text-slate-900">
                  <Link
                    href={`/stakeholder/account/support/${ticket.id}`}
                    className="hover:text-[#3B68DE] transition-colors"
                  >
                    {ticket.subject}
                  </Link>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Created: {ticket.createdAt} • Last update: {ticket.lastUpdated} ({ticket.messages.length} message{ticket.messages.length > 1 ? 's' : ''})
                </p>
              </div>

              <Link
                href={`/stakeholder/account/support/${ticket.id}`}
                className="inline-flex items-center gap-1 text-xs text-[#3B68DE] font-semibold hover:underline self-end sm:self-auto"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}

          {tickets.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              You have no active support requests.
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-[#3B68DE]" />
          <h2 className="text-base font-bold text-slate-900 font-condensed tracking-tight">
            Frequently Asked Questions & Guidelines
          </h2>
        </div>

        <div className="space-y-3">
          {STAKEHOLDER_FAQS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200/70 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full px-4 py-3 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between text-left gap-3"
                >
                  <span className="text-xs font-bold text-slate-800">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 py-3 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
