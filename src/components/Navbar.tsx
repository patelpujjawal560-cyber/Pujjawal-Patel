import React from 'react';
import { Scale, FileSpreadsheet, PlusCircle, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  activeRole: 'CITIZEN' | 'ADVOCATE';
  onRoleChange: (role: 'CITIZEN' | 'ADVOCATE') => void;
  onOpenNewComplaint: () => void;
  totalComplaints: number;
  totalCourtCases: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleChange,
  onOpenNewComplaint,
  totalComplaints,
  totalCourtCases
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-md shadow-amber-500/20 text-slate-950 font-bold">
              <Scale className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent font-['Rozha_One',serif]">
                  जन सड़क
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Jan Sadak Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                सड़क शिकायत, साक्ष्य व हाई कोर्ट जनहित याचिका (PIL) विधिक मंच
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar on Desktop */}
          <div className="hidden lg:flex items-center gap-6 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/60">
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-medium">कुल शिकायतें</span>
              <span className="text-sm font-bold text-amber-400">{totalComplaints} दर्ज</span>
            </div>
            <div className="w-px h-6 bg-slate-700" />
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-medium">हाई कोर्ट PIL केस</span>
              <span className="text-sm font-bold text-emerald-400">{totalCourtCases} अग्रसारित</span>
            </div>
            <div className="w-px h-6 bg-slate-700" />
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-medium">विधिक सहायता</span>
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                100% निःशुल्क
              </span>
            </div>
          </div>

          {/* Role Switcher & New Complaint Action */}
          <div className="flex items-center gap-3">
            {/* Dual Role Toggle Button */}
            <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => onRoleChange('CITIZEN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeRole === 'CITIZEN'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="नागरिक मोड: सड़क की फोटो खींचकर मुखिया व वार्ड की शिकायत करें"
              >
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">नागरिक मोड</span>
                <span className="sm:hidden">नागरिक</span>
              </button>
              <button
                type="button"
                onClick={() => onRoleChange('ADVOCATE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeRole === 'ADVOCATE'
                    ? 'bg-blue-600 text-white shadow-md font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="अधिवक्ता / विधिक सेल: हाई कोर्ट PIL याचिका, DM नोटिस व RTI जनरेट करें"
              >
                <Scale className="w-4 h-4" />
                <span className="hidden sm:inline">हाई कोर्ट विधिक सेल</span>
                <span className="sm:hidden">अधिवक्ता</span>
              </button>
            </div>

            {/* Main Action Button */}
            <button
              onClick={onOpenNewComplaint}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all transform active:scale-95 text-xs sm:text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>सड़क शिकायत दर्ज करें</span>
            </button>
          </div>

        </div>
      </div>

      {/* Role Notice Indicator Banner */}
      <div className={`px-4 py-1.5 text-xs text-center font-medium border-t transition-colors ${
        activeRole === 'ADVOCATE'
          ? 'bg-blue-950 text-blue-200 border-blue-800'
          : 'bg-amber-950/60 text-amber-200 border-amber-800/60'
      }`}>
        {activeRole === 'ADVOCATE' ? (
          <div className="flex items-center justify-center gap-2">
            <Scale className="w-3.5 h-3.5 text-blue-400" />
            <span>
              <strong>अधिवक्ता / लीगल पैनल मोड सक्रिय:</strong> आप शिकायतों को हाई कोर्ट जनहित याचिका (PIL) में बदल सकते हैं, 15-दिवसीय डीएम नोटिस भेज सकते हैं व केस नंबर अपडेट कर सकते हैं।
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>
              <strong>नागरिक मंच:</strong> सड़क की फोटो क्लिक करें, अपने प्रदेश, जिला, परसा/प्रखंड, वार्ड व मुखिया का नाम दर्ज करें। आपकी शिकायत सीधे विधिक दल को अग्रसारित होगी।
            </span>
          </div>
        )}
      </div>
    </header>
  );
};
