import { MedicalRecordServiceImpl } from '$lib/server/services/MedicalRecordServiceImpl';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
  const payload = await request.json();

  const recordId = await new MedicalRecordServiceImpl(locals.supabase).createMedicalRecordForAPatient(payload);

  return json({ success: true, medicalRecordId: recordId });
};
