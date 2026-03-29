'use client';

// ============================================
// ADMIN CONTACTS PAGE - /admin/contacts
// ============================================

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiChevronLeft, FiSearch, FiFilter, FiPhone, FiMail,
  FiCheckCircle, FiClock, FiMessageSquare, FiX, FiUser
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  createdAt: string;
  responses?: { message: string; respondedAt: string }[];
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    loadContacts();
  }, [statusFilter]);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(statusFilter !== 'all' && { status: statusFilter })
      });
      
      const res = await fetch(`${API_URL}/admin/contacts?${params}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
      }
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (contactId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/contact/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        toast.success('Status updated');
        loadContacts();
        if (selectedContact?._id === contactId) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const sendReply = async () => {
    if (!selectedContact || !replyMessage.trim()) return;

    try {
      const res = await fetch(`${API_URL}/contact/${selectedContact._id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage })
      });

      if (res.ok) {
        toast.success('Reply sent');
        setReplyMessage('');
        loadContacts();
      }
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-purple-100 text-purple-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'responded': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const filteredContacts = contacts.filter(c => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.phone.includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/admin" className="text-gray-400 hover:text-gray-600 mr-4">
                <FiChevronLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-brand-black">Contacts</h1>
                <p className="text-gray-500 text-sm">Manage customer inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contacts List */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-bold text-brand-black">
                {filteredContacts.length} Contact{filteredContacts.length !== 1 ? 's' : ''}
              </h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-gray-400">Loading...</div>
              ) : filteredContacts.length === 0 ? (
                <div className="p-6 text-center text-gray-400">No contacts found</div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedContact?._id === contact._id ? 'bg-blue-50 border-l-4 border-brand-blue' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-brand-black truncate">{contact.name}</p>
                          {contact.status === 'new' && (
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{contact.service || 'General Inquiry'}</p>
                        <p className="text-xs text-gray-400 mt-1">{timeAgo(contact.createdAt)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Contact Detail */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm">
            {selectedContact ? (
              <div className="h-full flex flex-col">
                {/* Contact Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-brand-black">{selectedContact.name}</h2>
                      <div className="flex items-center gap-4 mt-2">
                        <a href={`tel:${selectedContact.phone}`} className="text-sm text-brand-blue flex items-center">
                          <FiPhone className="w-4 h-4 mr-1" /> {selectedContact.phone}
                        </a>
                        <a href={`mailto:${selectedContact.email}`} className="text-sm text-brand-blue flex items-center">
                          <FiMail className="w-4 h-4 mr-1" /> {selectedContact.email}
                        </a>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  {/* Status Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => updateStatus(selectedContact._id, 'in-progress')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedContact.status === 'in-progress'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateStatus(selectedContact._id, 'responded')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedContact.status === 'responded'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      Responded
                    </button>
                    <button
                      onClick={() => updateStatus(selectedContact._id, 'closed')}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedContact.status === 'closed'
                          ? 'bg-gray-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Closed
                    </button>
                  </div>
                </div>

                {/* Message */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Original Message */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiUser className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{selectedContact.name}</span>
                        <span className="text-xs text-gray-400">{formatDate(selectedContact.createdAt)}</span>
                      </div>
                      <p className="text-brand-black whitespace-pre-wrap">{selectedContact.message}</p>
                      {selectedContact.service && (
                        <p className="text-sm text-gray-500 mt-2">
                          Service: {selectedContact.service}
                        </p>
                      )}
                    </div>

                    {/* Responses */}
                    {selectedContact.responses?.map((response, i) => (
                      <div key={i} className="bg-blue-50 rounded-xl p-4 ml-8">
                        <div className="flex items-center gap-2 mb-2">
                          <FiMessageSquare className="text-brand-blue" />
                          <span className="text-sm font-medium text-brand-blue">You</span>
                          <span className="text-xs text-gray-400">{formatDate(response.respondedAt)}</span>
                        </div>
                        <p className="text-brand-black whitespace-pre-wrap">{response.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Box */}
                <div className="p-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply..."
                      rows={2}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent resize-none"
                    />
                    <button
                      onClick={sendReply}
                      disabled={!replyMessage.trim()}
                      className="px-6 py-2 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    This will be logged in the system. To email the customer, use the email link above.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FiMessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a contact to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
