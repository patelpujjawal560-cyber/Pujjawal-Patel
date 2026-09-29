import { Complaint, ComplaintStatus } from '../types';
import { INITIAL_COMPLAINTS } from '../mockData';

const STORAGE_KEY = 'jan_sadak_complaints_v1';
const USER_ROLE_KEY = 'jan_sadak_active_mode';

export function getComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_COMPLAINTS;
  } catch (e) {
    console.error('Failed to load complaints from storage', e);
    return INITIAL_COMPLAINTS;
  }
}

export function saveComplaints(complaints: Complaint[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  } catch (e) {
    console.error('Failed to save complaints', e);
  }
}

export function addComplaint(complaint: Complaint): Complaint[] {
  const current = getComplaints();
  const updated = [complaint, ...current];
  saveComplaints(updated);
  return updated;
}

export function updateComplaintStatus(
  id: string,
  newStatus: ComplaintStatus,
  note: string,
  courtDetails?: Complaint['highCourtCaseDetails'],
  authorityContacted?: string
): Complaint[] {
  const current = getComplaints();
  const updated = current.map((item) => {
    if (item.id === id) {
      const historyEntry = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
        note: note || `स्थिति बदलकर ${newStatus} की गई।`,
        authorityContacted
      };
      return {
        ...item,
        status: newStatus,
        statusHistory: [...item.statusHistory, historyEntry],
        highCourtCaseDetails: courtDetails ? { ...item.highCourtCaseDetails, ...courtDetails } : item.highCourtCaseDetails
      };
    }
    return item;
  });
  saveComplaints(updated);
  return updated;
}

export function toggleUpvote(id: string): Complaint[] {
  const current = getComplaints();
  const updated = current.map((item) => {
    if (item.id === id) {
      const hasUpvoted = !item.hasUpvoted;
      return {
        ...item,
        hasUpvoted,
        upvotes: hasUpvoted ? item.upvotes + 1 : Math.max(0, item.upvotes - 1)
      };
    }
    return item;
  });
  saveComplaints(updated);
  return updated;
}

export function resetToDefaultData(): Complaint[] {
  saveComplaints(INITIAL_COMPLAINTS);
  return INITIAL_COMPLAINTS;
}

export function getActiveRole(): 'CITIZEN' | 'ADVOCATE' {
  const saved = localStorage.getItem(USER_ROLE_KEY);
  return saved === 'ADVOCATE' ? 'ADVOCATE' : 'CITIZEN';
}

export function setActiveRole(role: 'CITIZEN' | 'ADVOCATE'): void {
  localStorage.setItem(USER_ROLE_KEY, role);
}
