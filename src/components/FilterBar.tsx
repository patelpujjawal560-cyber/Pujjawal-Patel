import React from 'react';
import { ComplaintStatus } from '../types';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  conditionFilter: string;
  onConditionFilterChange: (cond: string) => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  conditionFilter,
  onConditionFilterChange,
  onResetFilters
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="परसा, वार्ड नं, मुखिया का नाम, जिला या ट्रैकिंग आईडी खोजें..."
          className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="ALL">सभी स्थितियां (All Status)</option>
          <option value="SUBMITTED">शिकायत दर्ज (New)</option>
          <option value="LEGAL_REVIEW">विधिक समीक्षा (Legal Review)</option>
          <option value="DM_NOTICE_SENT">15-दिवसीय DM नोटिस प्रेषित</option>
          <option value="HIGH_COURT_PIL_FILED">हाई कोर्ट PIL याचिका दायर</option>
          <option value="WORK_SANCTIONED">सड़क निर्माण स्वीकृत (Success)</option>
        </select>

        {/* Condition Filter */}
        <select
          value={conditionFilter}
          onChange={(e) => onConditionFilterChange(e.target.value)}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="ALL">सभी सड़क स्थितियां</option>
          <option value="WATERLOGGED_SWAMP">कीचड़ व भारी जलभराव</option>
          <option value="UNBUILT_DIRT">कच्चा रास्ता (कभी नहीं बनी)</option>
          <option value="ABANDONED_CONSTRUCTION">अधूरा निर्माण (ठेकेदार फरार)</option>
          <option value="BROKEN_POTHOLES">टूटी सड़क व गड्ढे</option>
          <option value="CORRUPTION_NO_ROAD">कागजी सड़क (फंड गबन)</option>
        </select>

        {/* Reset Filter Button */}
        {(searchQuery || statusFilter !== 'ALL' || conditionFilter !== 'ALL') && (
          <button
            type="button"
            onClick={onResetFilters}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
            title="फिल्टर रीसेट करें"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">रीसेट</span>
          </button>
        )}

      </div>

    </div>
  );
};
