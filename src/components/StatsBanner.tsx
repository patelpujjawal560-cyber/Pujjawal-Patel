import React from 'react';
import { Complaint } from '../types';
import { 
  Building, 
  Scale, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Flame, 
  FileText 
} from 'lucide-react';

interface StatsBannerProps {
  complaints: Complaint[];
  onQuickFilter: (keyword: string) => void;
  activeQuickFilter: string;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  complaints,
  onQuickFilter,
  activeQuickFilter
}) => {
  const total = complaints.length;
  const courtPilCount = complaints.filter(
    (c) => c.status === 'HIGH_COURT_PIL_FILED' || c.status === 'WORK_SANCTIONED'
  ).length;
  const dmNoticeCount = complaints.filter(
    (c) => c.status === 'DM_NOTICE_SENT' || c.status === 'HIGH_COURT_PIL_FILED'
  ).length;
  
  const avgYearsPending = total > 0
    ? (complaints.reduce((acc, c) => acc + c.yearsPending, 0) / total).toFixed(1)
    : '0';

  const parsaCount = complaints.filter((c) => c.blockOrTehsil.includes('परसा') || c.district.includes('सारण')).length;

  return (
    <div className="space-y-4 mb-8">
      {/* Top Banner Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>संविधान का अनुच्छेद 21: 'सड़क का अधिकार, जीवन का मौलिक अधिकार'</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2 font-['Rozha_One',serif]">
            टूटी व अधूरी सड़क की फोटो खींचें, मुखिया का नाम दर्ज करें — सीधे हाई कोर्ट में PIL
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            यदि आपके प्रदेश, जिले, परसा या अन्य प्रखंड के वार्ड में मुखिया ने वर्षों से सड़क नहीं बनवाई है, तो साक्ष्य अपलोड करें। हमारा विधिक प्रकोष्ठ तुरंत डीएम व बीडीओ को कानूनी नोटिस भेजता है और माननीय उच्च न्यायालय में निःशुल्क जनहित याचिका (PIL) तैयार करता है।
          </p>

          {/* Key Stat Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">कुल दर्ज शिकायतें</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">{total}</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">हाई कोर्ट PIL दायर</span>
              <span className="text-xl sm:text-2xl font-black text-purple-400">{courtPilCount}</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">15-दिवसीय DM नोटिस</span>
              <span className="text-xl sm:text-2xl font-black text-orange-400">{dmNoticeCount}</span>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block">औसत लंबित अवधि</span>
              <span className="text-xl sm:text-2xl font-black text-rose-400">{avgYearsPending} साल</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none hidden md:block" />
      </div>

      {/* Quick Location / Topic Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-bold shrink-0 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          त्वरित फिल्टर:
        </span>

        <button
          type="button"
          onClick={() => onQuickFilter('')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeQuickFilter === ''
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          सभी क्षेत्र ({total})
        </button>

        <button
          type="button"
          onClick={() => onQuickFilter('परसा')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1 ${
            activeQuickFilter === 'परसा'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md ring-2 ring-amber-400/40'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <MapPin className="w-3 h-3 text-amber-600" />
          परसा / सारण प्रखंड ({parsaCount})
        </button>

        <button
          type="button"
          onClick={() => onQuickFilter('वार्ड नं 04')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            activeQuickFilter === 'वार्ड नं 04'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          वार्ड नं 04
        </button>

        <button
          type="button"
          onClick={() => onQuickFilter('HIGH_COURT')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1 ${
            activeQuickFilter === 'HIGH_COURT'
              ? 'bg-purple-700 text-white font-black shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Scale className="w-3 h-3 text-purple-600" />
          हाई कोर्ट केस केवल ({courtPilCount})
        </button>

        <button
          type="button"
          onClick={() => onQuickFilter('10+')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1 ${
            activeQuickFilter === '10+'
              ? 'bg-rose-600 text-white font-black shadow-md'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3 h-3 text-rose-600" />
          10+ वर्षों से लंबित
        </button>
      </div>
    </div>
  );
};
