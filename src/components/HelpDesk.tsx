import { Phone, Mail, AlertTriangle, LifeBuoy, Clock, ShieldCheck, MapPin, Library } from 'lucide-react';

export default function HelpDesk() {
  return (
    <div className="h-full bg-transparent p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold tracking-widest uppercase mb-3">
            Support & Resources
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <LifeBuoy className="w-8 h-8 text-blue-600" />
            Safety Help Desk
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Contact information for emergencies, IT support, and OIL safety personnel.</p>
        </div>

        {/* Emergency Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-900/60 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-red-100 dark:border-red-900/40 flex items-center justify-between bg-red-50/50 dark:bg-red-950/30">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="text-xl font-bold text-red-900 dark:text-red-300">Emergency Contacts</h2>
            </div>
            <span className="px-3 py-1 bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-200 dark:border-red-800">24/7 Response</span>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-950/50 rounded-xl flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/50">
                  <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Central Control Room (CCR)</h3>
                  <a href="tel:18002334000" className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:underline block">1800-233-4000</a>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">For immediate reporting of leaks, fires, or major incidents.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/50 rounded-xl flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-900/50">
                  <Phone className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Fire Station / HSE</h3>
                  <a href="tel:18002334001" className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:underline block">1800-233-4001</a>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Direct line for fire tenders and immediate HSE support.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-950/50 rounded-xl flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/50">
                  <Mail className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Emergency Email Dispatch</h3>
                  <div className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:underline cursor-pointer">emergency@oilindia.in</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Monitored 24/7 by the incident command team.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
                  <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">OIL Hospital (Medical)</h3>
                  <a href="tel:18002334002" className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight hover:underline block">1800-233-4002</a>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">For medical emergencies and ambulance dispatch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* General Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Library className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              IT & Platform Support
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Helpdesk Phone</h3>
                <a href="tel:+913742804444" className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline block">+91 374 280 4444</a>
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Support Email</h3>
                <a href="mailto:helpdesk@oilindia.in" className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline block">helpdesk@oilindia.in</a>
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Operating Hours</h3>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">Mon-Sat, 07:00 AM - 05:00 PM (IST)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Corporate Headquarters
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Address</h3>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Oil India Limited<br />
                  Duliajan, Dibrugarh<br />
                  Assam - 786602, India
                </p>
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">General Inquiries</h3>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-200">+91 374 280 0411</div>
              </div>
              <div className="pt-2">
                <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 uppercase tracking-widest transition-colors">
                  View Full Directory &rarr;
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
