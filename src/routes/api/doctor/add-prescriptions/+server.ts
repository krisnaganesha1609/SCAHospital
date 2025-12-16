import { MedicineServiceImpl } from '$lib/server/services/MedicineServiceImpl';
import { PrescriptionServiceImpl } from '$lib/server/services/PrescriptionServiceImpl';
import { PrescriptionItemsRequest } from '$lib/shared/utils/PrescriptionItems_Request';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
  const payload = await request.json();
  const medicalRecordId = payload.medical_record_id;
  const doctorId = payload.doctor_id;
  const notes = payload.notes;
  const medications: PrescriptionItemsRequest[] =  payload.medications.map((item: any) => {
    return PrescriptionItemsRequest.fromJson(item);
  });

  medications.forEach(async (med) => {
    const { data } = await locals.supabase.from('medicines').select('stock_qty').eq('id', med.getMedicineId()).single();
    if (data.stock_qty < med.getQuantity()) {
      throw new Error(`Insufficient stock for medicine: ${med.getMedicineName()}`);
    }
    await new MedicineServiceImpl(locals.supabase).updateStock(med.getMedicineId(), data.stock_qty - med.getQuantity());
  });
  await new PrescriptionServiceImpl(locals.supabase).issuePrescription(medicalRecordId, doctorId, notes, medications);

  return json({ success: true });
};
