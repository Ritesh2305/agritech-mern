import React, { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Calendar, Clock, Sparkles, Send, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';

interface ConsultationsAndForumPageProps {
  consultations: any[];
  forumPosts: any[];
  onRefresh: () => void;
}

export const ConsultationsAndForumPage: React.FC<ConsultationsAndForumPageProps> = ({
  consultations,
  forumPosts,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [activeSection, setActiveSection] = useState<'consultations' | 'forum'>('consultations');
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [showNewTopicModal, setShowNewTopicModal] = useState<boolean>(false);

  // Consultation booking state
  const [expertName, setExpertName] = useState('Dr. Lekshmi Sharma');
  const [expertRole, setExpertRole] = useState('Senior Agronomist & ICAR Scientist');
  const [consultDate, setConsultDate] = useState('2026-10-30');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:30 AM');
  const [cropAffected, setCropAffected] = useState('Bt Cotton');
  const [topic, setTopic] = useState('Square shedding and leaf reddening');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<'Routine' | 'High' | 'Emergency'>('High');

  // Forum state
  const [forumCategory, setForumCategory] = useState<string>('All');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCat, setNewTopicCat] = useState('Organic Farming');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const experts = [
    {
      name: 'Dr. Lekshmi Sharma',
      role: 'Chief Agronomist & Soil Diagnostic Lead',
      specialty: 'Cotton, Pulses, Soil Acidification',
      rating: 4.9,
      experience: '18 Years ICAR Experience',
    },
    {
      name: 'Prof. K. Venkatesh',
      role: 'Organic Farming & Bio-Control Specialist',
      specialty: 'Bio-Fertilizers, Natural Pest Traps, Paddy',
      rating: 4.8,
      experience: '22 Years Organic Research',
    },
    {
      name: 'Dr. Anand Deshmukh',
      role: 'Micro-Irrigation & Water Engineering Lead',
      specialty: 'Drip Automation, Evapotranspiration, Orchards',
      rating: 4.9,
      experience: '14 Years Irrigation Tech',
    },
  ];

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.bookConsultation({
      expertName,
      expertRole,
      date: consultDate,
      timeSlot,
      cropAffected,
      topic,
      description,
      urgency,
    });
    setShowBookingModal(false);
    setDescription('');
    onRefresh();
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.createForumPost({
      title: newTopicTitle,
      content: newTopicContent,
      category: newTopicCat,
      tags: [newTopicCat, 'Farming'],
    });
    setShowNewTopicModal(false);
    setNewTopicTitle('');
    setNewTopicContent('');
    onRefresh();
  };

  const handleSendComment = async (postId: string) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;
    await api.addForumComment(postId, text);
    setReplyTextMap(prev => ({ ...prev, [postId]: '' }));
    onRefresh();
  };

  const handleLikePost = async (postId: string) => {
    await api.likeForumPost(postId);
    onRefresh();
  };

  const filteredPosts =
    forumCategory === 'All'
      ? forumPosts
      : forumPosts.filter(p => p.category === forumCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-900 text-white shadow-md">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/farmer_expert_consultant_1793110538895.jpg"
            alt="Agricultural Expert Consultation"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
            <span>Knowledge Exchange Network</span>
            <span aria-hidden="true">·</span>
            <span>Agricultural Scientists & Peer Forum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
            {t.community.title}
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            {t.community.subtitle}
          </p>
        </div>
      </div>

      {/* Navigation Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
        <button
          onClick={() => setActiveSection('consultations')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSection === 'consultations'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          {t.community.bookConsultation} ({consultations.length})
        </button>

        <button
          onClick={() => setActiveSection('forum')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeSection === 'forum'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          {t.community.communityForum} ({forumPosts.length})
        </button>
      </div>

      {activeSection === 'consultations' ? (
        <div className="space-y-6">
          {/* Agronomists Directory */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Certified Agricultural Scientists
                </h3>
                <p className="text-xs text-stone-500">
                  Select a specialist for field diagnosis or digital prescription.
                </p>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book Instant Consultation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {experts.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <span>⭐ {exp.rating} Rating</span>
                      <span>{exp.experience}</span>
                    </div>
                    <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-0.5">
                      {exp.name}
                    </h4>
                    <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium block mb-2">
                      {exp.role}
                    </span>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
                      Focus: {exp.specialty}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setExpertName(exp.name);
                      setExpertRole(exp.role);
                      setShowBookingModal(true);
                    }}
                    className="w-full py-2 px-3 rounded-lg border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold transition-colors"
                  >
                    Select & Schedule Slot
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Booked Consultations */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3">
              Your Scheduled & Past Consultations
            </h3>
            <div className="space-y-3">
              {consultations.map(cons => (
                <div
                  key={cons.id || cons._id}
                  className="p-5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {cons.topic}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                        <span>Expert: {cons.expertName}</span>
                        <span aria-hidden="true">·</span>
                        <span>Crop: {cons.cropAffected}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono tabular-nums text-xs text-stone-600 dark:text-stone-300">
                        📅 {cons.date} ({cons.timeSlot})
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase ${
                          cons.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {cons.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    "{cons.description}"
                  </p>

                  {cons.expertPrescription && (
                    <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs">
                      <span className="font-semibold text-emerald-900 dark:text-emerald-200 block mb-0.5">
                        Official Scientist Prescription:
                      </span>
                      <p className="text-stone-700 dark:text-stone-300">
                        {cons.expertPrescription}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Community Forum View */
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex overflow-x-auto gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl scrollbar-none">
              {['All', 'Organic Farming', 'Irrigation Tech', 'Crop Disease', 'Market Prices', 'Govt Schemes'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setForumCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    forumCategory === cat
                      ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewTopicModal(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.community.askQuestion}</span>
            </button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <div
                key={post.id || post._id}
                className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm space-y-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                    <span className="font-semibold text-stone-800 dark:text-stone-200">{post.authorName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 capitalize">
                      {post.authorRole}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{post.category}</span>
                  </div>

                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-2">
                    {post.title}
                  </h4>

                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Like & Reply Action bar */}
                <div className="flex items-center gap-4 text-xs pt-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={() => handleLikePost(post.id || post._id)}
                    className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 hover:text-emerald-600 font-medium transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likes || 0} Upvotes</span>
                  </button>

                  <span className="text-stone-400 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments?.length || 0} Replies</span>
                  </span>
                </div>

                {/* Comment Thread */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2.5 pt-2 pl-4 border-l-2 border-stone-100 dark:border-stone-800">
                    {post.comments.map((cm: any, i: number) => (
                      <div key={i} className="text-xs">
                        <span className="font-semibold text-stone-800 dark:text-stone-200">
                          {cm.authorName}:{' '}
                        </span>
                        <span className="text-stone-600 dark:text-stone-400">{cm.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Reply Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={replyTextMap[post.id || post._id] || ''}
                    onChange={e =>
                      setReplyTextMap({ ...replyTextMap, [post.id || post._id]: e.target.value })
                    }
                    placeholder="Write farmer advice or response..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100"
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSendComment(post.id || post._id);
                    }}
                  />
                  <button
                    onClick={() => handleSendComment(post.id || post._id)}
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Book Consultation */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
              {t.community.bookConsultation}
            </h3>
            <form onSubmit={handleBookConsultation} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Selected Agricultural Scientist
                </label>
                <input
                  type="text"
                  disabled
                  value={`${expertName} (${expertRole})`}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-200 bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {t.community.preferredDate}
                  </label>
                  <input
                    type="date"
                    required
                    value={consultDate}
                    onChange={e => setConsultDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {t.community.timeSlot}
                  </label>
                  <select
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                    <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                    <option value="03:00 PM - 03:30 PM">03:00 PM - 03:30 PM</option>
                    <option value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Affected Crop
                  </label>
                  <input
                    type="text"
                    required
                    value={cropAffected}
                    onChange={e => setCropAffected(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={e => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="Routine">Routine Check</option>
                    <option value="High">High Urgency</option>
                    <option value="Emergency">Emergency Outbreak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Topic / Summary
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Leaf curl and yellowing"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Detailed Symptoms & Observations
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe leaf symptoms, pest observations, previous sprays..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Topic */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
              {t.community.askQuestion}
            </h3>
            <form onSubmit={handleCreateTopic} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Category
                </label>
                <select
                  value={newTopicCat}
                  onChange={e => setNewTopicCat(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="Organic Farming">Organic Farming</option>
                  <option value="Irrigation Tech">Irrigation Tech</option>
                  <option value="Crop Disease">Crop Disease</option>
                  <option value="Market Prices">Market Prices</option>
                  <option value="Govt Schemes">Govt Schemes</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Question Title
                </label>
                <input
                  type="text"
                  required
                  value={newTopicTitle}
                  onChange={e => setNewTopicTitle(e.target.value)}
                  placeholder="e.g. Best organic bio-agent for stem borer in maize?"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Details / Field Experience
                </label>
                <textarea
                  rows={3}
                  required
                  value={newTopicContent}
                  onChange={e => setNewTopicContent(e.target.value)}
                  placeholder="Share details of your crop stage, acreage, and questions..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  {t.community.postQuery}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
