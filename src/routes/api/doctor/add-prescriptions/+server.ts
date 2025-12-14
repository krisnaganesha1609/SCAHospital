import { PrescriptionServiceImpl } from '$lib/server/services/PrescriptionServiceImpl';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
  const payload = await request.json();
  const medicalRecordId = payload.medical_record_id;
  const doctorId = payload.doctor_id;
  const notes = payload.notes;
  const medications = payload.medications;

  await new PrescriptionServiceImpl(locals.supabase).issuePrescription(medicalRecordId, doctorId, notes, medications);

  return json({ success: true });
};
