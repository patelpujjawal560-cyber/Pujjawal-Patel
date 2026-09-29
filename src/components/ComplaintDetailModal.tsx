import React from 'react';
import { Complaint } from '../types';
import { 
  X, 
  MapPin, 
  Clock, 
  UserCheck, 
  Scale, 
  FileText, 
  Share2, 
  ThumbsUp, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink,
  Phone,
  Compass
} from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenLegalHub: (complaint: Complaint) => void;
  onToggleUpvote: (id: string) => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  isOpen,
  onClose,
  onOpenLegalHub,
  onToggleUpvote
}) => {
  if (!isOpen || !complaint) return null;

  const handleShareWhatsApp = () => {
    const text = `🚨 *सड़क निर्माण शिकायत व जनहित साक्ष्य* 🚨\n\n📌 *वार्ड व प्रखंड:* ${complaint.wardNumber}, ${complaint.gramPanchayat}, प्रखंड: ${complaint.blockOrTehsil}, जिला: ${complaint.district}\n👤 *मुखिया:* ${complaint.mukhiyaName}\n⏳ *कितने साल से नहीं बनी:* ${complaint.yearsPending} वर्ष\n\n*समस्या:* ${complaint.description}\n\n👉 जन सड़क पोर्टल पर पूरा विवरण व हाई कोर्ट PIL देखें: ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {complaint.trackingNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {complaint.yearsPending} साल से लंबित
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">
              {complaint.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1 text-slate-800">
          
          {/* Photo & Road Condition Banner */}
          <div className="relative rounded-2xl overflow-hidden h-64 sm:h-72 bg-slate-900 border border-slate-200">
            <img
              src={complaint.photoUrl}
              alt={complaint.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-bold text-amber-300 bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm inline-block mb-1">
                सड़क स्थिति: {complaint.roadCondition}
              </span>
              <p className="text-xs text-slate-200 line-clamp-2">
                लंबाई: लगभग {complaint.roadLengthMeters || 1000} मीटर | प्रभावित आबादी: {complaint.affectedPopulation || 2000}+ लोग
              </p>
            </div>
          </div>

          {/* Key Administration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
              <div className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4 text-amber-700" />
                स्थान व प्रशासनिक क्षेत्र
              </div>
              <div><strong className="text-slate-600">प्रदेश:</strong> {complaint.state}</div>
              <div><strong className="text-slate-600">जिला:</strong> {complaint.district}</div>
              <div><strong className="text-slate-600">प्रखंड / तहसील:</strong> <span className="font-bold text-slate-900">{complaint.blockOrTehsil}</span></div>
              <div><strong className="text-slate-600">ग्राम पंचायत:</strong> {complaint.gramPanchayat}</div>
              <div><strong className="text-slate-600">वार्ड नंबर:</strong> <span className="font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">{complaint.wardNumber}</span></div>
              {complaint.locationCoordinates && (
                <div className="text-[11px] text-slate-600 pt-1 border-t border-amber-200 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{complaint.locationCoordinates.addressText}</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-2 text-xs">
              <div className="font-bold text-blue-950 flex items-center gap-1.5 text-sm">
                <UserCheck className="w-4 h-4 text-blue-700" />
                जिम्मेदार जनप्रतिनिधि व अधिकारी
              </div>
              <div><strong className="text-slate-600">ग्राम मुखिया:</strong> <span className="font-bold text-slate-900">{complaint.mukhiyaName}</span></div>
              {complaint.wardParshadName && (
                <div><strong className="text-slate-600">वार्ड सदस्य / पार्षद:</strong> {complaint.wardParshadName}</div>
              )}
              {complaint.mlaName && (
                <div><strong className="text-slate-600">स्थानीय विधायक:</strong> {complaint.mlaName}</div>
              )}
              <div><strong className="text-slate-600">सड़क न बनने की अवधि:</strong> <span className="font-black text-rose-600">{complaint.yearsPending} वर्ष से उपेक्षित</span></div>
              <div className="pt-1 border-t border-blue-200 text-slate-600">
                <strong>शिकायतकर्ता:</strong> {complaint.complainantName}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              समस्या का विस्तृत विवरण (Ground Reality)
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {complaint.description}
            </div>
          </div>

          {/* Problems list */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              मुख्य परेशानियां
            </h4>
            <div className="flex flex-wrap gap-2">
              {complaint.problems.map((p, i) => (
                <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Legal Escalation Quick Box */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <h5 className="font-bold text-sm text-white">
                  हाई कोर्ट जनहित याचिका व डीएम विधिक नोटिस
                </h5>
                <p className="text-xs text-slate-400">
                  इस शिकायत का अनुच्छेद 226 के अंतर्गत ड्राफ्ट तैयार है।
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLegalHub(complaint);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-lg shrink-0 flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>हाई कोर्ट PIL ड्राफ्ट देखें</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleUpvote(complaint.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                complaint.hasUpvoted
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${complaint.hasUpvoted ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>समर्थन ({complaint.upvotes})</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp शेयर</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
