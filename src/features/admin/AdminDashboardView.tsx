/**
 * السبع المثاني — Unified Moderation & Administration Workspace (Sprint 1)
 * RBAC-enforced administrative view for reviewing contributions, creating entities, and viewing audit logs.
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  PlusCircle,
  GitMerge,
  History,
  Users,
  Search,
  BookOpen,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import { Contribution, Person, RelationshipType, UserRole } from '../../core/types';

interface AuditLogItem {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: Record<string, unknown>;
  created_at: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  created_at: string;
}

export const AdminDashboardView: React.FC<{ onOpenPerson: (id: string) => void }> = ({ onOpenPerson }) => {
  const { user, token, can, hasRole } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'moderation' | 'add_person' | 'add_relationship' | 'audit' | 'users'>('moderation');
  
  // Data states
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Review modal state
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');

  // Add Person form state
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonBirth, setNewPersonBirth] = useState('');
  const [newPersonDeath, setNewPersonDeath] = useState('');
  const [newPersonEra, setNewPersonEra] = useState('عصر التدوين');
  const [newPersonBio, setNewPersonBio] = useState('');

  // Add Relationship form state
  const [fromPersonId, setFromPersonId] = useState('');
  const [toPersonId, setToPersonId] = useState('');
  const [relTypeId, setRelTypeId] = useState('');
  const [relStrength, setRelStrength] = useState('5');
  const [relNotes, setRelNotes] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/v1/contributions').then(r => r.json()),
      fetch('/api/v1/persons?limit=100').then(r => r.json()),
      fetch('/api/v1/relationship-types').then(r => r.json()),
      can('audit.read')
        ? fetch('/api/v1/audit-logs', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
        : Promise.resolve({ success: false, data: [] }),
      hasRole(['admin', 'super_admin'])
        ? fetch('/api/v1/auth/users', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
        : Promise.resolve({ success: false, data: [] })
    ]).then(([contribRes, persRes, relTypeRes, auditRes, usersRes]) => {
      if (contribRes.success) setContributions(contribRes.data);
      if (persRes.success) setPersons(persRes.data);
      if (relTypeRes.success) setRelationshipTypes(relTypeRes.data);
      if (auditRes.success) setAuditLogs(auditRes.data);
      if (usersRes.success) setUsersList(usersRes.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Handle Approve Contribution
  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/contributions/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reviewer_notes: reviewerNotes || 'تم الاعتماد بعد الفحص والمطابقة المرجعية' })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'تم اعتماد المساهمة بنجاح وتحديث سجل التعديلات' });
        setSelectedContribution(null);
        setReviewerNotes('');
        loadData();
      } else {
        setFeedback({ type: 'error', message: data.error?.message || 'فشل اعتماد المساهمة' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // Handle Reject Contribution
  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/contributions/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reviewer_notes: reviewerNotes || 'المعلومة تحتاج إلى مزيد من الإسناد المصدري' })
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'تم رفض المقترح وإشعار الباحث بالملاحظات' });
        setSelectedContribution(null);
        setReviewerNotes('');
        loadData();
      } else {
        setFeedback({ type: 'error', message: data.error?.message || 'فشل رفض المساهمة' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // Handle Add Person
  const handleCreatePerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;

    try {
      const res = await fetch('/api/v1/persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          primary_name: newPersonName,
          birth_date: newPersonBirth,
          death_date: newPersonDeath,
          era: newPersonEra,
          short_bio: newPersonBio
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `تمت إضافة الشخصية (${data.data.primary_name}) بنجاح` });
        setNewPersonName('');
        setNewPersonBirth('');
        setNewPersonDeath('');
        setNewPersonBio('');
        loadData();
      } else {
        setFeedback({ type: 'error', message: data.error?.message || 'فشلت إضافة الشخصية' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // Handle Add Relationship
  const handleCreateRelationship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromPersonId || !toPersonId || !relTypeId) return;

    try {
      const res = await fetch('/api/v1/relationships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          from_person_id: fromPersonId,
          to_person_id: toPersonId,
          relationship_type_id: relTypeId,
          strength: parseInt(relStrength, 10),
          notes: relNotes
        })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'تم توثيق وإضافة السند/العلاقة في الشجرة وقاعدة المعرفة' });
        setFromPersonId('');
        setToPersonId('');
        setRelNotes('');
        loadData();
      } else {
        setFeedback({ type: 'error', message: data.error?.message || 'فشل إنشاء العلاقة' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // Handle Role Change
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const res = await fetch(`/api/v1/auth/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: 'تم تحديث رتبة وصلاحيات المستخدم بنجاح' });
        loadData();
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {user ? `رتبة الحساب: ${user.role}` : 'غير مصرح'}
            </span>
            <span className="text-xs text-stone-500">منظومة الحوكمة العلمية والتدقيق</span>
          </div>
          <h2 className="font-heritage text-3xl font-bold text-stone-900">
            لوحة الإشراف والمراجعة والتحقيق (Sprint 1)
          </h2>
        </div>

        {/* Action Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-stone-200">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'moderation' ? 'bg-stone-900 text-amber-200 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>طابور المراجعة ({contributions.filter(c => c.status === 'submitted' || c.status === 'under_review').length})</span>
          </button>

          {can('person.create') && (
            <button
              onClick={() => setActiveTab('add_person')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'add_person' ? 'bg-stone-900 text-amber-200 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>إضافة شخصية</span>
            </button>
          )}

          {can('relationship.create') && (
            <button
              onClick={() => setActiveTab('add_relationship')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'add_relationship' ? 'bg-stone-900 text-amber-200 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <GitMerge className="w-3.5 h-3.5" />
              <span>إضافة علاقة/سند</span>
            </button>
          )}

          {can('audit.read') && (
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'audit' ? 'bg-stone-900 text-amber-200 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>سجل التدقيق</span>
            </button>
          )}

          {hasRole(['admin', 'super_admin']) && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'users' ? 'bg-stone-900 text-amber-200 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>المستخدمون والرتب</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`mb-6 p-4 rounded-2xl flex items-center justify-between border ${
          feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2 text-xs font-semibold">
            {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-xs opacity-70 hover:opacity-100 font-bold">إغلاق</button>
        </div>
      )}

      {/* 1. Moderation Queue Tab */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heritage text-xl font-bold text-stone-900">
              طلبات التحقيق والتدقيق المعلقة
            </h3>
            <span className="text-xs text-stone-500">
              {can('contribution.approve') ? 'لديك صلاحية البت والاعتماد التوثيقي' : 'عرض للمطالعة فقط (تحتاج رتبة Reviewer أو Admin للاعتماد)'}
            </span>
          </div>

          {contributions.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">لا توجد مساهمات مسجلة حالياً.</div>
          ) : (
            <div className="space-y-4">
              {contributions.map((c) => (
                <div key={c.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {c.status === 'approved' ? 'معتمد' : c.status === 'rejected' ? 'مرفوض' : 'قيد التدقيق'}
                      </span>
                      <span className="text-xs font-bold text-stone-800">
                        {c.entity_type === 'person' ? 'تعديل شخصية' : c.entity_type}
                      </span>
                      <span className="text-xs text-stone-400">بواسطة: {c.user_name}</span>
                    </div>

                    <div className="text-xs text-stone-700 bg-white p-3 rounded-xl border border-stone-200/80">
                      {typeof c.payload === 'object' && c.payload !== null
                        ? (c.payload as any).suggestion || (c.payload as any).description || JSON.stringify(c.payload)
                        : String(c.payload)}
                    </div>

                    {c.reviewer_notes && (
                      <div className="text-[11px] text-stone-500 italic">
                        ملاحظة المحقق: {c.reviewer_notes}
                      </div>
                    )}
                  </div>

                  {can('contribution.approve') && c.status !== 'approved' && c.status !== 'rejected' && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(c.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>اعتماد ونشر</span>
                      </button>

                      <button
                        onClick={() => handleReject(c.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>رفض</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Add Person Tab */}
      {activeTab === 'add_person' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs max-w-2xl mx-auto">
          <h3 className="font-heritage text-2xl font-bold text-stone-900 mb-2">
            إضافة شخصية / علم إلى الموسوعة
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            يتم تسجيل الشخصية وتوليد المعرف الفريد (Slug) تلقائياً مع تسجيل عملية الإضافة في سجل التدقيق.
          </p>

          <form onSubmit={handleCreatePerson} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">الاسم الرئيسي المحقق *</label>
              <input
                type="text"
                required
                value={newPersonName}
                onChange={e => setNewPersonName(e.target.value)}
                placeholder="مثال: الإمام مالك بن أنس الأصبحي"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">تاريخ الميلاد</label>
                <input
                  type="text"
                  value={newPersonBirth}
                  onChange={e => setNewPersonBirth(e.target.value)}
                  placeholder="مثال: 93 هـ"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">تاريخ الوفاة</label>
                <input
                  type="text"
                  value={newPersonDeath}
                  onChange={e => setNewPersonDeath(e.target.value)}
                  placeholder="مثال: 179 هـ"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">العصر التاريخي</label>
                <input
                  type="text"
                  value={newPersonEra}
                  onChange={e => setNewPersonEra(e.target.value)}
                  placeholder="مثال: عصر التابعين"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">موجز الترجمة والتعريف العلمي</label>
              <textarea
                rows={4}
                value={newPersonBio}
                onChange={e => setNewPersonBio(e.target.value)}
                placeholder="إمام دار الهجرة، وأحد أئمة المذاهب الأربعة، صاحب كتاب الموطأ..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إدراج الشخصية في قاعدة الأعلام</span>
            </button>
          </form>
        </div>
      )}

      {/* 3. Add Relationship Tab */}
      {activeTab === 'add_relationship' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs max-w-2xl mx-auto">
          <h3 className="font-heritage text-2xl font-bold text-stone-900 mb-2">
            توثيق علاقة وسند معرفي جديد
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            ربط عالمين برابطة تلمذة، أو صحبة، أو إجازة علمية، أو نسب شريف مع إدراجها في شجرة المعرفة.
          </p>

          <form onSubmit={handleCreateRelationship} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">الطرف الأول (الشيخ / الأصل) *</label>
                <select
                  required
                  value={fromPersonId}
                  onChange={e => setFromPersonId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600"
                >
                  <option value="">اختر الشخصية الأولى...</option>
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>{p.primary_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">الطرف الثاني (التلميذ / الفرع) *</label>
                <select
                  required
                  value={toPersonId}
                  onChange={e => setToPersonId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600"
                >
                  <option value="">اختر الشخصية الثانية...</option>
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>{p.primary_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">نوع الرابطة / السند *</label>
                <select
                  required
                  value={relTypeId}
                  onChange={e => setRelTypeId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600"
                >
                  <option value="">اختر نوع العلاقة...</option>
                  {relationshipTypes.map(rt => (
                    <option key={rt.id} value={rt.id}>{rt.name_ar} ({rt.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">قوة التوثيق (1 - 5)</label>
                <select
                  value={relStrength}
                  onChange={e => setRelStrength(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600"
                >
                  <option value="5">5 - متواتر / إجماع قطعي</option>
                  <option value="4">4 - مشهور صحيح الإسناد</option>
                  <option value="3">3 - حسن معتبر</option>
                  <option value="2">2 - رواية آحاد</option>
                  <option value="1">1 - استئناس تاريخي</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">ملاحظات التحقيق والمصدر</label>
              <input
                type="text"
                value={relNotes}
                onChange={e => setRelNotes(e.target.value)}
                placeholder="مثال: ذكره الذهبي في السير، ج4، ص12"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <GitMerge className="w-4 h-4" />
              <span>تسجيل العلاقة في شبكة المعرفة</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
          <h3 className="font-heritage text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            <span>سجل التدقيق والحركات الإدارية (Audit Trail)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-stone-50 text-stone-600 border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">التاريخ والوقت</th>
                  <th className="py-2.5 px-3">المستخدم</th>
                  <th className="py-2.5 px-3">الإجراء</th>
                  <th className="py-2.5 px-3">نوع الكيان</th>
                  <th className="py-2.5 px-3">التفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/60">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-stone-400">
                      {new Date(log.created_at).toLocaleString('ar-EG')}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-stone-800">{log.user_id}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono text-[11px] bg-stone-100 px-2 py-0.5 rounded-md text-amber-900 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{log.entity_type}</td>
                    <td className="py-2.5 px-3 text-stone-500 font-mono text-[10px]">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Users & Roles Management Tab (Admin Only) */}
      {activeTab === 'users' && hasRole(['admin', 'super_admin']) && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
          <h3 className="font-heritage text-xl font-bold text-stone-900 mb-2">
            إدارة المستخدمين والأدوار (RBAC Hierarchy)
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            تعديل رتبة الباحث والمحقق لتحديث صلاحيات الاعتماد والنشر فورياً.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usersList.map((u) => (
              <div key={u.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-900 text-sm">{u.name}</div>
                  <div className="text-xs text-stone-400 font-mono">{u.email}</div>
                  <div className="text-[10px] text-stone-400 mt-1">تاريخ التسجيل: {new Date(u.created_at).toLocaleDateString('ar-EG')}</div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    aria-label={`تغيير رتبة المستخدم ${u.name}`}
                    className="bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 font-bold focus:outline-none focus:border-amber-600"
                  >
                    <option value="visitor">زائر (Visitor)</option>
                    <option value="user">مستخدم (User)</option>
                    <option value="contributor">مساهم (Contributor)</option>
                    <option value="researcher">باحث (Researcher)</option>
                    <option value="reviewer">محقق علمي (Reviewer)</option>
                    <option value="editor">محرر (Editor)</option>
                    <option value="admin">مدير عام (Admin)</option>
                    <option value="super_admin">مشرف أعلى (Super Admin)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
