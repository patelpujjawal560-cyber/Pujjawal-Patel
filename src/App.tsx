import React, { useState, useEffect } from 'react';
import { Complaint, ComplaintStatus } from './types';
import { 
  getComplaints, 
  addComplaint, 
  updateComplaintStatus, 
  toggleUpvote, 
  getActiveRole, 
  setActiveRole, 
  resetToDefaultData 
} from './services/storage';
import { Navbar } from './components/Navbar';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { ComplaintCard } from './components/ComplaintCard';
import { ComplaintFormModal } from './components/ComplaintFormModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { HighCourtLegalHubModal } from './components/HighCourtLegalHubModal';
import { 
  PlusCircle, 
  Scale, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Gavel,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

export default function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeRole, setActiveRoleState] = useState<'CITIZEN' | 'ADVOCATE'>('CITIZEN');

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [conditionFilter, setConditionFilter] = useState<string>('ALL');
  const [quickFilter, setQuickFilter] = useState<string>('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedDetailComplaint, setSelectedDetailComplaint] = useState<Complaint | null>(null);
  const [selectedLegalHubComplaint, setSelectedLegalHubComplaint] = useState<Complaint | null>(null);

  // Success alert toast state
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    setComplaints(getComplaints());
    setActiveRoleState(getActiveRole());
  }, []);

  const handleRoleToggle = (role: 'CITIZEN' | 'ADVOCATE') => {
    setActiveRoleState(role);
    setActiveRole(role);
  };

  const handleCreateComplaint = (newComplaint: Complaint) => {
    const updated = addComplaint(newComplaint);
    setComplaints(updated);
    showToast(`शिकायत ${newComplaint.trackingNumber} सफलतापूर्वक दर्ज! विधिक नोटिस व हाई कोर्ट PIL ड्राफ्ट तैयार हो गया।`);
  };

  const handleStatusUpdate = (
    id: string,
    newStatus: ComplaintStatus,
    note: string,
    courtDetails?: Complaint['highCourtCaseDetails'],
    authorityContacted?: string
  ) => {
    const updated = updateComplaintStatus(id, newStatus, note, courtDetails, authorityContacted);
    setComplaints(updated);
    if (selectedDetailComplaint?.id === id) {
      const refreshed = updated.find((c) => c.id === id) || null;
      setSelectedDetailComplaint(refreshed);
    }
    if (selectedLegalHubComplaint?.id === id) {
      const refreshed = updated.find((c) => c.id === id) || null;
      setSelectedLegalHubComplaint(refreshed);
    }
    showToast('हाई कोर्ट विधिक कार्यवाही व स्टेटस सफलतापूर्वक अद्यतन!');
  };

  const handleToggleUpvote = (id: string) => {
    const updated = toggleUpvote(id);
    setComplaints(updated);
  };

  const handleResetData = () => {
    if (confirm('क्या आप सभी डेमो डाटा को रीसेट करना चाहते हैं?')) {
      const res = resetToDefaultData();
      setComplaints(res);
      showToast('डाटा रीसेट हो गया है।');
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  const handleQuickFilter = (keyword: string) => {
    setQuickFilter(keyword);
    if (keyword === 'HIGH_COURT') {
      setStatusFilter('HIGH_COURT_PIL_FILED');
      setSearchQuery('');
    } else if (keyword === '10+') {
      setSearchQuery('');
      setStatusFilter('ALL');
    } else {
      setStatusFilter('ALL');
      setSearchQuery(keyword);
    }
  };

  // Filter logic
  const filteredComplaints = complaints.filter((c) => {
    // Quick 10+ filter
    if (quickFilter === '10+' && c.yearsPending < 10) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'ALL' && c.status !== statusFilter) {
      return false;
    }

    // Condition filter
    if (conditionFilter !== 'ALL' && c.roadCondition !== conditionFilter) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.mukhiyaName.toLowerCase().includes(q) ||
        c.wardNumber.toLowerCase().includes(q) ||
        c.blockOrTehsil.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.trackingNumber.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const totalCourtCases = complaints.filter(
    (c) => c.status === 'HIGH_COURT_PIL_FILED' || c.status === 'WORK_SANCTIONED'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      
      {/* Navigation */}
      <Navbar
        activeRole={activeRole}
        onRoleChange={handleRoleToggle}
        onOpenNewComplaint={() => setIsFormOpen(true)}
        totalComplaints={complaints.length}
        totalCourtCases={totalCourtCases}
      />

      {/* Success Notification Toast */}
      {successToast && (
        <div className="fixed top-24 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{successToast}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        
        {/* Workflow Guide Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
              ⚖️
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                जन सड़क विधिक समाधान प्रक्रिया (3-चरण कार्यप्रणाली):
              </h3>
              <p className="text-xs text-slate-500">
                फोटो खींचें &gt; परसा/प्रखंड, वार्ड व मुखिया दर्ज करें &gt; हमारे विधिक सेल द्वारा DM नोटिस व हाई कोर्ट PIL निःशुल्क दायर
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>सड़क फोटो अपलोड करें</span>
            </button>
            <button
              onClick={handleResetData}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="डेमो डाटा रीसेट करें"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats & Hero Banner */}
        <StatsBanner
          complaints={complaints}
          onQuickFilter={handleQuickFilter}
          activeQuickFilter={quickFilter}
        />

        {/* Search and Filters */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          conditionFilter={conditionFilter}
          onConditionFilterChange={setConditionFilter}
          onResetFilters={() => {
            setSearchQuery('');
            setStatusFilter('ALL');
            setConditionFilter('ALL');
            setQuickFilter('');
          }}
        />

        {/* Content Heading */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <span>शिकायतें एवं विधिक साक्ष्य</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2.5 py-0.5 rounded-full">
                {filteredComplaints.length} मार्ग सूचीबद्ध
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              प्रत्येक शिकायत के साथ मुखिया की जवाबदेही, उपेक्षा की अवधि एवं हाई कोर्ट जनहित याचिका संलग्न है
            </p>
          </div>

          {activeRole === 'ADVOCATE' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold">
              <Scale className="w-3.5 h-3.5 text-blue-700" />
              <span>हाई कोर्ट लीगल पैनल एक्टिव</span>
            </div>
          )}
        </div>

        {/* Complaints Grid */}
        {filteredComplaints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onViewDetails={(c) => setSelectedDetailComplaint(c)}
                onOpenLegalHub={(c) => setSelectedLegalHubComplaint(c)}
                onToggleUpvote={handleToggleUpvote}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="h-16 w-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <FolderOpen className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              कोई शिकायत नहीं मिली
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              आपके द्वारा चुने गए फिल्टर (खोज, स्थिति अथवा क्षेत्र) में कोई सड़क शिकायत नहीं है।
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('ALL');
                  setConditionFilter('ALL');
                  setQuickFilter('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
              >
                सभी शिकायतें दिखाएं
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>नयी शिकायत दर्ज करें</span>
              </button>
            </div>
          </div>
        )}

        {/* Legal Rights Footer Education Box */}
        <section className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
              <Gavel className="w-7 h-7" />
            </div>

            <div className="space-y-3 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                क्या आप जानते हैं? सड़क न बनाना आपके संवैधानिक मौलिक अधिकारों का हनन है!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                भारत के सर्वोच्च न्यायालय ने <strong>'स्टेट ऑफ हिमाचल प्रदेश बनाम उमेद राम शर्मा' (1986)</strong> में ऐतिहासिक निर्णय दिया है कि हर नागरिक को सुलभ पक्की सड़क का अधिकार संविधान के <strong>अनुच्छेद 21 (जीने का अधिकार)</strong> के अंतर्गत मौलिक अधिकार है। यदि पंचायत मुखिया, बीडीओ या ग्रामीण कार्य विभाग फंड आने के बाद भी 5-10 सालों से सड़क नहीं बनाते, तो उच्च न्यायालय परमादेश (Writ of Mandamus) जारी कर कार्य कराने और गबन की विजिलेंस जांच का आदेश दे सकता है।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">1. धारा 80 CPC विधिक नोटिस</span>
                  <p className="text-slate-500">डीएम व बीडीओ को 15 दिनों का अंतिम मांग पत्र जारी किया जाता है।</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">2. धारा 6(1) RTI आवेदन</span>
                  <p className="text-slate-500">10 वर्षों के बजट, एमबी बुक और ठेकेदार भुगतान का हिसाब निकाला जाता है।</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  <span className="font-bold text-slate-900 block mb-1">3. हाई कोर्ट जनहित याचिका (PIL)</span>
                  <p className="text-slate-500">उच्च न्यायालय की खंडपीठ के समक्ष रिट याचिका दायर कर तुरंत सड़क स्वीकृत कराई जाती है।</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white">जन सड़क (Jan Sadak)</span>
            <span>— नागरिक अधिकार व उच्च न्यायालय विधिक निवारण पोर्टल</span>
          </div>
          <div className="text-slate-500 text-center sm:text-right">
            <span>बिहार (सारण/परसा) एवं समस्त भारतीय राज्यों के नागरिकों हेतु 100% निःशुल्क सेवा</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {isFormOpen && (
        <ComplaintFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateComplaint}
        />
      )}

      {selectedDetailComplaint && (
        <ComplaintDetailModal
          complaint={selectedDetailComplaint}
          isOpen={!!selectedDetailComplaint}
          onClose={() => setSelectedDetailComplaint(null)}
          onOpenLegalHub={(c) => {
            setSelectedDetailComplaint(null);
            setSelectedLegalHubComplaint(c);
          }}
          onToggleUpvote={handleToggleUpvote}
        />
      )}

      {selectedLegalHubComplaint && (
        <HighCourtLegalHubModal
          complaint={selectedLegalHubComplaint}
          isOpen={!!selectedLegalHubComplaint}
          onClose={() => setSelectedLegalHubComplaint(null)}
          onUpdateStatus={handleStatusUpdate}
          userRole={activeRole}
        />
      )}

    </div>
  );
}
