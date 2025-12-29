import { AuditLogsServiceImpl } from '$lib/server/services/AuditLogsServiceImpl';
import { MedicineServiceImpl } from '$lib/server/services/MedicineServiceImpl';
import { PrescriptionServiceImpl } from '$lib/server/services/PrescriptionServiceImpl';
import { AuditLogsRequest } from '$lib/shared/utils/AuditLogs_Request';
import { PrescriptionItemsRequest } from '$lib/shared/utils/PrescriptionItems_Request';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
  const payload = await request.json();
  const medicalRecordId = payload.medical_record_id;
  const doctorId = payload.doctor_id;
  const notes = payload.notes;
  const medications: PrescriptionItemsRequest[] = payload.medications.map((item: any) => {
    return PrescriptionItemsRequest.fromJson(item);
  });

  medications.forEach(async (med) => {
    const { data } = await locals.supabase.from('medicines').select('stock_qty').eq('id', med.getMedicineId()).single();
    if (data.stock_qty < med.getQuantity()) {
      throw new Error(`Insufficient stock for medicine: ${med.getMedicineName()}`);
    }
    await new MedicineServiceImpl(locals.supabase).updateStock(med.getMedicineId(), data.stock_qty - med.getQuantity());
  });
  const id = await new PrescriptionServiceImpl(locals.supabase).issuePrescription(medicalRecordId, doctorId, notes, medications);
  const logs: AuditLogsRequest = new AuditLogsRequest(
    locals.user?.id || '',
    'issuing',
    'prescriptions',
    id,
    getClientAddress()
  );

  const auditLogsService = new AuditLogsServiceImpl(locals.supabase);
    await auditLogsService.recordAuditLog(logs);

  return json({ success: true });
};
