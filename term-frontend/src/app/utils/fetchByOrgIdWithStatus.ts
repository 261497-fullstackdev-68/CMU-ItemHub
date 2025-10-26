import api from "../lib/api"; // adjust path to where you defined your axios instance

/**
 * Fetch equipment loans by organization ID and loan status.
 *
 * @param orgId - Organization ID
 * @param status - Loan status (e.g. 'pending' | 'approved' | 'returned' | 'rejected')
 * @returns List of loans from the backend
 */
export async function fetchLoansByOrgAndStatus(orgId: number, status: string) {
  try {
    const res = await api.get(
      `/equipmentLoans/findByOrgIdWithStatus?orgId=${orgId}&status=${status}`
    );
    return res.data;
  } catch (error) {
    console.error("Failed to fetch loans:", error);
    throw error;
  }
}
