import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Mail, Lock, Loader2, User as UserIcon, MapPin, ExternalLink, Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '../lib/utils';
import OptiMindsLogo from './OptiMindsLogo';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../lib/firebase';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Extra signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEmployee, setIsEmployee] = useState(false);
  const [location, setLocation] = useState('');
  
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [popupBlockedNotice, setPopupBlockedNotice] = useState(false);
  const { signIn, signUp, signInWithGoogle, signInAnonymouslyUser, loading, setUserProfile } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (isEmployee && !location.trim()) {
          setError('Location is required for employees.');
          return;
        }
        const userCredential = await signUp(email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: `${firstName} ${lastName}`.trim() });
        
        const newProfile = {
          firstName,
          lastName,
          isEmployee,
          location: isEmployee ? location : '',
          email: user.email,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', user.uid), newProfile);
        setUserProfile(newProfile);
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password sign-in is not enabled in your Firebase console. Please enable it in the Authentication settings.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    }
  };

  const isEmbedded = typeof window !== 'undefined' && window.self !== window.top;

  const handleGoogleSignIn = () => {
    if (googleLoading || loading) return;
    setError('');
    setPopupBlockedNotice(false);
    setGoogleLoading(true);

    // Call immediately to preserve user gesture activation for the browser popup
    signInWithGoogle()
      .then((res: any) => {
        // Successfully signed in
      })
      .catch((err: any) => {
        if (err?.code === 'auth/cancelled-popup-request') {
          console.warn("Google sign-in popup request cancelled or superseded.");
        } else if (err?.code === 'auth/popup-blocked') {
          console.warn("Google Sign-In popup was blocked by browser or preview sandbox.");
          setPopupBlockedNotice(true);
          setError('');
        } else if (err?.code === 'auth/popup-closed-by-user') {
          console.warn("Google Sign-in popup closed by user.");
          setError('Sign-in cancelled. If the popup closed automatically, please open the app in a new tab.');
        } else if (err?.code === 'auth/operation-not-allowed') {
          console.warn("Google Sign-In not enabled in Firebase:", err);
          setError('Google Sign-In is not enabled in your Firebase console.');
        } else if (err?.message && (err.message.includes('cross-origin') || err.message.includes('iframe'))) {
          console.warn("Iframe cross-origin sign-in restriction:", err);
          setPopupBlockedNotice(true);
          setError('');
        } else if (err?.code === 'auth/unauthorized-domain') {
          console.warn("Unauthorized domain for Firebase Auth:", err);
          setError('This domain is not authorized for Google Sign-In in your Firebase Console.');
        } else {
          console.warn("Google Sign-In notice:", err?.message || err);
          setError(err?.message || 'Failed to sign in with Google.');
        }
      })
      .finally(() => {
        setGoogleLoading(false);
      });
  };

  const handleAnonymousSignIn = async () => {
    try {
      setError('');
      await signInAnonymouslyUser();
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/admin-restricted-operation') {
        setError('Guest Mode (Anonymous Sign-In) is not enabled. Please enable "Anonymous" provider in your Firebase Console under Authentication > Sign-in method.');
      } else {
        setError(err.message || 'Failed to sign in anonymously.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors duration-150">
      {/* Top Bar Theme Switcher */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            type="button"
            onClick={() => setTheme('light')}
            title="Light Mode"
            className={cn(
              "p-1.5 rounded-lg text-xs font-semibold transition-all",
              theme === 'light'
                ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            title="Dark Mode"
            className={cn(
              "p-1.5 rounded-lg text-xs font-semibold transition-all",
              theme === 'dark'
                ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setTheme('system')}
            title="System Theme"
            className={cn(
              "p-1.5 rounded-lg text-xs font-semibold transition-all",
              theme === 'system'
                ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            <Monitor className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <OptiMindsLogo className="w-16 h-16 rounded-2xl shadow-xl shadow-blue-900/20" iconClassName="w-8 h-8" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {t('auth.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          {t('auth.subtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-2xl sm:px-10 border border-slate-200 dark:border-slate-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {popupBlockedNotice && (
              <div className="p-3.5 text-sm bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 rounded-xl space-y-2 text-amber-900 dark:text-amber-200">
                <div className="font-semibold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Preview Browser Restriction
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Sandboxed preview iframes often block popup windows. You can open the app in a new browser tab to sign in with Google, or continue below with Guest Access or Email.
                </p>
                <button
                  type="button"
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open App in New Tab to Sign In
                </button>
              </div>
            )}

            {error && !popupBlockedNotice && (
              <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg">
                {error}
              </div>
            )}
            
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                      </div>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-red-800 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                        placeholder="First name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                      </div>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-red-800 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="employeeCheck"
                    checked={isEmployee}
                    onChange={(e) => setIsEmployee(e.target.checked)}
                    className="w-4 h-4 text-red-600 border-slate-300 dark:border-slate-700 rounded focus:ring-red-600"
                  />
                  <label htmlFor="employeeCheck" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    I am an Oil India employee
                  </label>
                </div>
                
                {isEmployee && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Location <span className="text-red-500">*</span></label>
                    <div className="relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MapPin className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                      </div>
                      <input
                        type="text"
                        required={isEmployee}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-red-800 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                        placeholder="e.g. Sector 5, Block B"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t('auth.email')}
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-red-800 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t('auth.password')}
              </label>
              <div className="relative mt-2">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-red-800 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex w-full justify-center rounded-lg bg-red-800 hover:bg-red-900 active:bg-red-950 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? t('auth.submit_login') : t('auth.submit_signup')
              )}
            </button>

            {isLogin && (
              <button
                type="button"
                onClick={() => {
                  setEmail('optiminds2026@gmail.com');
                  setPassword('optimindsCSEB');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors focus:outline-none"
              >
                Auto-Fill Admin Credentials
              </button>
            )}

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-sm font-medium leading-6">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 focus-visible:ring-transparent transition-colors disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-slate-600 dark:text-slate-400" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span>{googleLoading ? 'Connecting...' : 'Google'}</span>
              </button>

              <button
                type="button"
                onClick={handleAnonymousSignIn}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-white dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 focus-visible:ring-transparent transition-colors"
              >
                <span>Guest Access</span>
              </button>
            </div>

            {isEmbedded && !popupBlockedNotice && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>In preview iframe? Open app in a new tab for Google Sign-In</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            )}
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
          >
            {isLogin ? t('auth.toggle_signup') : t('auth.toggle_login')}
          </button>
        </p>
      </div>
    </div>
  );
}
