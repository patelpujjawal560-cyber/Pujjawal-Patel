import React from 'react';
import { Complaint, ComplaintStatus } from '../types';
import { 
  MapPin, 
  Clock, 
  UserCheck, 
  Scale, 
  FileText, 
  ThumbsUp, 
  Share2, 
  AlertCircle, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onViewDetails: (complaint: Complaint) => void;
  onOpenLegalHub: (complaint: Complaint) => void;
  onToggleUpvote: (id: string) => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onViewDetails,
  onOpenLegalHub,
  onToggleUpvote
}) => {
  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return {
          label: 'शिकायत दर्ज (New)',
          color: 'bg-yellow-50 text-yellow-800 border-yellow-300',
          dot: 'bg-yellow-500'
        };
      case 'LEGAL_REVIEW':
        return {
          label: 'अधिवक्ता विधिक जांच',
          color: 'bg-sky-50 text-sky-800 border-sky-300',
          dot: 'bg-sky-500'
        };
      case 'DM_NOTICE_SENT':
        return {
          label: 'DM व BDO को विधिक नोटिस प्रेषित',
          color: 'bg-orange-50 text-orange-800 border-orange-300',
          dot: 'bg-orange-500'
        };
      case 'HIGH_COURT_PIL_FILED':
        return {
          label: 'हाई कोर्ट में PIL याचिका दर्ज ⚖️',
          color: 'bg-purple-50 text-purple-900 border-purple-300 font-bold shadow-sm',
          dot: 'bg-purple-600'
        };
      case 'WORK_SANCTIONED':
        return {
          label: 'सड़क निर्माण स्वीकृत (टेंडर जारी)',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500'
        };
      case 'COMPLETED':
        return {
          label: 'सड़क निर्माण पूर्ण',
          color: 'bg-green-50 text-green-900 border-green-300',
          dot: 'bg-green-600'
        };
      default:
        return {
          label: status,
          color: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-500'
        };
    }
  };

  const statusBadge = getStatusBadge(complaint.status);

  const getRoadConditionLabel = (condition: Complaint['roadCondition']) => {
    switch (condition) {
      case 'WATERLOGGED_SWAMP':
        return 'कीचड़ व दलदल (Waterlogged)';
      case 'ABANDONED_CONSTRUCTION':
        return 'अधूरा निर्माण / ठेकेदार फरार';
      case 'UNBUILT_DIRT':
        return 'कच्चा रास्ता (कभी नहीं बनी)';
      case 'BROKEN_POTHOLES':
        return 'टूटी सड़क व जानलेवा गड्ढे';
      case 'CORRUPTION_NO_ROAD':
        return 'कागजों में बनी, जमीन पर नदारद (गबन)';
      default:
        return 'जर्जर सड़क';
    }
  };

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const courtName = complaint.highCourtCaseDetails?.highCourtName || 'उच्च न्यायालय';
    const text = `🚨 *सड़क निर्माण शिकायत व हाई कोर्ट PIL सूचना* 🚨\n\n📍 *स्थान:* ${complaint.wardNumber}, ग्राम पंचायत: ${complaint.gramPanchayat}, प्रखंड: ${complaint.blockOrTehsil}, जिला: ${complaint.district} (${complaint.state})\n👤 *मुखिया:* ${complaint.mukhiyaName}\n⏳ *कितने साल से नहीं बनी:* ${complaint.yearsPending} वर्षों से\n⚖️ *विधिक स्थिति:* ${statusBadge.label}\n\n*समस्या:* ${complaint.description.slice(0, 150)}...\n\n👉 जनहित याचिका व 15-दिवसीय विधिक नोटिस जन सड़क पोर्टल पर देखें: ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Top Image Banner with Badges */}
      <div className="relative h-52 sm:h-56 bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onViewDetails(complaint)}>
        <img
          src={complaint.photoUrl}
          alt={complaint.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Road condition badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600/90 text-white backdrop-blur-md shadow-md flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {getRoadConditionLabel(complaint.roadCondition)}
          </span>
        </div>

        {/* Years Pending Badge - High Impact */}
        <div className="absolute top-3 right-3">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-slate-950" />
            <span>{complaint.yearsPending} साल से उपेक्षित</span>
          </div>
        </div>

        {/* Location Overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 mb-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{complaint.district} • प्रखंड: {complaint.blockOrTehsil}</span>
          </div>
          <h3 className="font-bold text-sm sm:text-base text-white line-clamp-1 drop-shadow-md">
            {complaint.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Key Administration & Mukhiya Section */}
          <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs">
            <div className="border-r border-slate-200 pr-2">
              <span className="text-[11px] font-medium text-slate-500 block">ग्राम पंचायत व वार्ड</span>
              <span className="font-bold text-slate-800 line-clamp-1">
                {complaint.wardNumber}, {complaint.gramPanchayat}
              </span>
            </div>
            <div className="pl-1">
              <span className="text-[11px] font-medium text-slate-500 block">जिम्मेदार मुखिया</span>
              <span className="font-bold text-slate-900 flex items-center gap-1 line-clamp-1">
                <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                {complaint.mukhiyaName}
              </span>
            </div>
          </div>

          {/* Description Snippet */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {complaint.description}
          </p>

          {/* Problem tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {complaint.problems.slice(0, 2).map((prob, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium truncate max-w-[200px]"
              >
                • {prob}
              </span>
            ))}
            {complaint.problems.length > 2 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-semibold">
                +{complaint.problems.length - 2} और
              </span>
            )}
          </div>

          {/* High Court & Status Highlight */}
          <div className="mb-4">
            <div className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${statusBadge.color}`}>
              <div className="flex items-center gap-2 truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${statusBadge.dot}`} />
                <span className="truncate">{statusBadge.label}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                {complaint.trackingNumber}
              </span>
            </div>

            {complaint.highCourtCaseDetails?.caseNumber && (
              <div className="mt-1.5 px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200/80 rounded-lg text-[11px] flex items-center justify-between font-medium">
                <span className="flex items-center gap-1 font-semibold truncate">
                  <Scale className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                  {complaint.highCourtCaseDetails.caseNumber}
                </span>
                <span className="text-[10px] text-purple-700 font-bold bg-purple-200/70 px-1.5 py-0.5 rounded">
                  PIL दायर
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          
          {/* Upvote & WhatsApp buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleUpvote(complaint.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                complaint.hasUpvoted
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="जन समर्थन दें (Upvote this complaint)"
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${complaint.hasUpvoted ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{complaint.upvotes}</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="मुखिया / अधिकारियों को WhatsApp पर भेजें"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Main Action: Open Legal Hub / View Details */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenLegalHub(complaint)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>हाई कोर्ट PIL</span>
            </button>

            <button
              type="button"
              onClick={() => onViewDetails(complaint)}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="पूरा विवरण देखें"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
