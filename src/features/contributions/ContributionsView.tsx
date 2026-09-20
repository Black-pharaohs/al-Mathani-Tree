import React, { useState, useEffect } from 'react';
import { 
  GitPullRequest, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Shield, 
  FileText, 
  User, 
  Database, 
  ShieldCheck,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  CornerDownLeft,
  BookOpen
} from 'lucide-react';
import { Contribution, PeerReviewComment } from '../../core/types';
import { useAuth } from '../../core/auth/AuthContext';

export const ContributionsView: React.FC = () => {
  const { user, token } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Peer Review Comment State
  const [replyingContribId, setReplyingContribId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [commentVerdict, setCommentVerdict] = useState<'support' | 'dispute' | 'inquiry'>('support');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  // Form State
  const [contributorName, setContributorName] = useState<string>(user?.name || '');
  const [entityType, setEntityType] = useState<string>('person');
  const [actionType, setActionType] = useState<Contribution['action']>('update');
  const [details, setDetails] = useState<string>('');
  const [sourceRef, setSourceRef] = useState<string>('');

  useEffect(() => {
    if (user?.name) {
      setContributorName(user.name);
    }
  }, [user]);

  const loadContributions = () => {
    fetch('/api/v1/contributions')
      .then(r => r.json())
      .then(json => {
        if (json.success) setContributions(json.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load contributions:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadContributions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const res = await fetch('/api/v1/contributions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: contributorName.trim() || 'باحث مساهم',
          entity_type: entityType,
          action: actionType,
          payload: {
            description: details,
            source_reference: sourceRef,
            submitted_at: new Date().toISOString()
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage('تم إرسال المقترح بنجاح وإدراجه في قائمة التحقيق والمراجعة العلمية.');
        setDetails('');
        setSourceRef('');
        loadContributions();
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddComment = async (contribId: string) => {
    if (!commentText.trim() || !token) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/v1/contributions/${contribId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: commentText.trim(),
          verdict: commentVerdict
        })
      });

      const data = await res.json();
      if (data.success) {
        setCommentText('');
        setReplyingContribId(null);
        loadContributions();
      }
    } catch (err) {
      console.error('Failed to post peer review comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
            منظومة التحقيق والمساهمات العلمية
          </h2>
          <p className="text-stone-600 text-sm max-w-2xl leading-relaxed font-serif">
            تطبيق مبدأ حوكمة المحتوى (Content Governance)؛ حيث لا يتم إدراج أو تعديل أي معلومة علمية بشكل فوري دون مراجعة وتدقيق وإسناد مصدري مع حفظ سجل التعديلات (Revisions).
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-900 border border-amber-900/40 text-stone-200 text-xs shadow-sm self-start md:self-auto">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-amber-200 font-heritage flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>حوكمة مدعومة بقواعد RLS</span>
            </div>
            <div className="text-[11px] text-stone-400">سجل تدقيق ومراجعات دائم في PostgreSQL</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Contributions Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs">
            <h3 className="font-heritage text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>سجل المقترحات والمراجعات الحالية ({contributions.length})</span>
            </h3>

            {loading ? (
              <div className="py-12 text-center text-stone-500">جارٍ تحميل قائمة المراجعة...</div>
            ) : contributions.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-sm">
                لا توجد مساهمات معلقة حالياً.
              </div>
            ) : (
              <div className="space-y-4">
                {contributions.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700">
                          {c.entity_type === 'person' ? 'شخصية' : c.entity_type}
                        </span>
                        <span className="text-xs text-stone-500">
                          بواسطة: {c.user_name || 'باحث مساهم'}
                        </span>
                      </div>

                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        c.status === 'under_review'
                          ? 'bg-amber-100 text-amber-800'
                          : c.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{c.status === 'under_review' ? 'قيد المراجعة' : c.status === 'approved' ? 'معتمد' : 'مقدم'}</span>
                      </span>
                    </div>

                    <div className="text-xs text-stone-700 font-sans leading-relaxed bg-white p-3 rounded-xl border border-stone-200">
                      {typeof c.payload === 'object' && c.payload !== null
                        ? (c.payload as any).suggestion || (c.payload as any).description || JSON.stringify(c.payload)
                        : String(c.payload)}
                    </div>

                    <div className="text-[10px] text-stone-400 font-mono flex items-center justify-between">
                      <span>تاريخ التقديم: {new Date(c.created_at).toLocaleDateString('ar-EG')}</span>
                      <button
                        onClick={() => setReplyingContribId(replyingContribId === c.id ? null : c.id)}
                        className="text-xs text-amber-700 hover:text-amber-800 font-heritage font-bold flex items-center gap-1 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>مناقشة الأقران والتدقيق ({c.comments?.length || 0})</span>
                      </button>
                    </div>

                    {/* Peer Review Comments Thread */}
                    {c.comments && c.comments.length > 0 && (
                      <div className="mt-2 pt-3 border-t border-stone-200/60 space-y-2">
                        <div className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-amber-600" />
                          <span>الاستدراكات والآراء العلمية المسجلة:</span>
                        </div>
                        {c.comments.map((cm) => (
                          <div key={cm.id} className="p-2.5 rounded-xl bg-white border border-stone-200/80 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-stone-800 text-[11px]">{cm.author_name}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                                  {cm.author_role}
                                </span>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                                cm.verdict === 'support'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : cm.verdict === 'dispute'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {cm.verdict === 'support' ? (
                                  <>
                                    <ThumbsUp className="w-2.5 h-2.5" />
                                    <span>مؤيّد ومثبت</span>
                                  </>
                                ) : cm.verdict === 'dispute' ? (
                                  <>
                                    <ThumbsDown className="w-2.5 h-2.5" />
                                    <span>استدراك / خلاف</span>
                                  </>
                                ) : (
                                  <>
                                    <HelpCircle className="w-2.5 h-2.5" />
                                    <span>استيضاح توثيقي</span>
                                  </>
                                )}
                              </span>
                            </div>
                            <p className="text-stone-700 leading-relaxed font-serif text-[11px]">
                              {cm.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Peer Review Form Box */}
                    {replyingContribId === c.id && (
                      <div className="mt-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-200 animate-fade-in space-y-3">
                        <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
                          <span className="flex items-center gap-1.5">
                            <CornerDownLeft className="w-3.5 h-3.5" />
                            <span>إضافة رأي أو تدقيق علمي تشاركي</span>
                          </span>
                          {!user && (
                            <span className="text-[10px] text-rose-600 font-normal">
                              (يتطلب تسجيل الدخول كمحقق أو باحث)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-stone-600">الموقف العلمي:</span>
                          <div className="flex items-center gap-1.5 text-xs">
                            <button
                              type="button"
                              onClick={() => setCommentVerdict('support')}
                              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                                commentVerdict === 'support'
                                  ? 'bg-emerald-600 text-white font-bold'
                                  : 'bg-white text-stone-600 border border-stone-200'
                              }`}
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>تأييد</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setCommentVerdict('dispute')}
                              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                                commentVerdict === 'dispute'
                                  ? 'bg-rose-600 text-white font-bold'
                                  : 'bg-white text-stone-600 border border-stone-200'
                              }`}
                            >
                              <ThumbsDown className="w-3 h-3" />
                              <span>استدراك</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setCommentVerdict('inquiry')}
                              className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                                commentVerdict === 'inquiry'
                                  ? 'bg-amber-600 text-white font-bold'
                                  : 'bg-white text-stone-600 border border-stone-200'
                              }`}
                            >
                              <HelpCircle className="w-3 h-3" />
                              <span>استيضاح</span>
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="أدخل دليلك التوثيقي، السند، أو المرجع المعتمد..."
                          disabled={!user}
                          className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500 leading-relaxed disabled:opacity-60"
                        />

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setReplyingContribId(null)}
                            className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-700"
                          >
                            إلغاء
                          </button>
                          <button
                            type="button"
                            disabled={!user || isSubmittingComment || !commentText.trim()}
                            onClick={() => handleAddComment(c.id)}
                            className="bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            {isSubmittingComment ? 'جارٍ النشر...' : 'نشر الرأي العلمي'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Propose Contribution Form */}
        <div className="space-y-6">
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 border border-amber-900/40 shadow-xl">
            <h3 className="font-heritage text-xl font-bold text-amber-200 mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 text-amber-400" />
              <span>تقديم اقتراح أو تصحيح</span>
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-5">
              إذا كان لديك توثيق أو تصحيح مسند لأحد الأعلام أو العلاقات، يُرجى إرسال التفاصيل والمصدر للمراجعة.
            </p>

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-stone-300 mb-1 font-medium">اسم الباحث / المساهم</label>
                <input
                  type="text"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  placeholder="مثال: د. عبد الله الشريف"
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">نوع الكيان</label>
                  <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-2 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="person">شخصية / علم</option>
                    <option value="relationship">علاقة / سند</option>
                    <option value="source">مصدر / مرجع</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1 font-medium">نوع الإجراء</label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as any)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-2 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="update">تعديل / تدقيق</option>
                    <option value="create">إضافة جديدة</option>
                    <option value="source_add">إرفاق مصدر</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1 font-medium">تفاصيل الإضافة أو التصحيح</label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="اكتب تفاصيل التعديل مع توضيح الوجه العلمي..."
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1 font-medium">المصدر والإحالة (الكتاب، الجزء، الصفحة)</label>
                <input
                  type="text"
                  value={sourceRef}
                  onChange={(e) => setSourceRef(e.target.value)}
                  placeholder="مثال: سير أعلام النبلاء، ج4، ص215"
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>جارٍ الإرسال...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال للاعتماد والمراجعة</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
};
