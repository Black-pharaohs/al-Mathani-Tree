/**
 * السبع المثاني — Authentication & Sign In Modal
 * Supports direct email/password and single-click persona switching for verification
 */

import React, { useState } from 'react';
import { X, Shield, KeyRound, Mail, User as UserIcon, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import { UserRole } from '../../core/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('contributor');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء المعالجة');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (personaEmail: string, personaPass: string) => {
    setError(null);
    setLoading(true);
    try {
      await login(personaEmail, personaPass);
      onClose();
    } catch (err: any) {
      setError(err.message || 'فشل تسجيل الدخول للشخصية التجريبية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white w-full max-w-md rounded-3xl border border-stone-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="bg-stone-900 px-6 py-5 text-stone-100 flex items-center justify-between border-b border-amber-900/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heritage text-lg font-bold text-amber-100">
                {mode === 'login' ? 'تسجيل الدخول إلى المنظومة' : 'إنشاء حساب باحث جديد'}
              </h3>
              <p className="text-[11px] text-stone-400">بوابة الباحثين والمحققين العلميين</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Personas for Review & Test (Sprint 1 Feature) */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80">
            <span className="block text-[11px] font-bold text-stone-600 mb-2">
              تسجيل دخول سريع بالأدوار (لأغراض التحكيم والاختبار):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@almathani.org', 'Admin@123456')}
                className="text-right p-2 rounded-xl bg-white border border-stone-200 hover:border-amber-600 hover:bg-amber-50/50 transition-all text-xs"
              >
                <div className="font-bold text-stone-900">مدير عام (Admin)</div>
                <div className="text-[10px] text-stone-400">كافة الصلاحيات والإشراف</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('reviewer@almathani.org', 'Reviewer@123')}
                className="text-right p-2 rounded-xl bg-white border border-stone-200 hover:border-amber-600 hover:bg-amber-50/50 transition-all text-xs"
              >
                <div className="font-bold text-stone-900">محقق علمي (Reviewer)</div>
                <div className="text-[10px] text-stone-400">اعتماد وتدقيق المقترحات</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('researcher@almathani.org', 'Research@123')}
                className="text-right p-2 rounded-xl bg-white border border-stone-200 hover:border-amber-600 hover:bg-amber-50/50 transition-all text-xs"
              >
                <div className="font-bold text-stone-900">باحث تراثي (Researcher)</div>
                <div className="text-[10px] text-stone-400">إضافة أسانيد وتوثيقات</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('contributor@almathani.org', 'Contrib@123')}
                className="text-right p-2 rounded-xl bg-white border border-stone-200 hover:border-amber-600 hover:bg-amber-50/50 transition-all text-xs"
              >
                <div className="font-bold text-stone-900">مساهم (Contributor)</div>
                <div className="text-[10px] text-stone-400">تقديم مقترحات وتصحيحات</div>
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-stone-400 absolute">أو بالحساب الشخصي</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">الاسم الكامل</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: د. إبراهيم الحسني"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">الرتبة المعرفية المطلوبة</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600"
                  >
                    <option value="contributor">مساهم (Contributor)</option>
                    <option value="researcher">باحث متخصص (Researcher)</option>
                    <option value="user">مستخدم عام (User)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">كلمة المرور</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute right-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition-all shadow-md mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>جارٍ المعالجة...</span>
              ) : (
                <span>{mode === 'login' ? 'تسجيل الدخول' : 'تأكيد التسجيل'}</span>
              )}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              className="text-xs text-stone-500 hover:text-amber-800 font-semibold"
            >
              {mode === 'login'
                ? 'ليس لديك حساب؟ انقر هنا للإنشاء'
                : 'لديك حساب بالفعل؟ انقر لتسجيل الدخول'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
