import { PrescriptionServiceImpl } from '$lib/server/services/PrescriptionServiceImpl';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const PATCH: RequestHandler = async ({ request, locals }) => {
  const payload = await request.json();
  const prescription_id = payload.prescriptionId as string;
  const pharmacy_approval_id = payload.pharmacyApprovalId as string;
  const pharmacist_id = payload.pharmacistId as string;

  await new PrescriptionServiceImpl(locals.supabase).approvePrescription(prescription_id, pharmacy_approval_id, pharmacist_id);

  return json({ success: true });
};
