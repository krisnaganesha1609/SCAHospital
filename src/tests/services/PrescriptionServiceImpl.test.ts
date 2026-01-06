import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrescriptionServiceImpl } from '$lib/server/services/PrescriptionServiceImpl';
import { PrescriptionRepositoryImpl } from '$lib/server/repositories/PrescriptionRepositoryImpl';
import { PrescriptionItemsRepositoryImpl } from '$lib/server/repositories/PrescriptionItemsRepositoryImpl';
import { PharmacyApprovalRepositoryImpl } from '$lib/server/repositories/PharmacyApprovalRepositoryImpl';
import { PharmacyApproval } from '$lib/shared/entities';

describe('PrescriptionServiceImpl', () => {
  const supabase = {} as any;
  let service: PrescriptionServiceImpl;

  beforeEach(() => {
    service = new PrescriptionServiceImpl(supabase);
    vi.restoreAllMocks();
  });

  it('should return pharmacy approvals list', async () => {
    vi.spyOn(PharmacyApprovalRepositoryImpl.prototype, 'findAll')
      .mockResolvedValue([{ id: 'pa-1' }]);

    vi.spyOn(PharmacyApproval, 'fromJson')
      .mockReturnValue({ id: 'pa-1' } as any);

    const result = await service.getPharmacyApprovalsList();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: 'pa-1' });
  });

  it('should issue prescription and return prescription id', async () => {
    vi.spyOn(PrescriptionRepositoryImpl.prototype, 'createPrescription')
      .mockResolvedValue('presc-1' as any);

    const createItemsSpy = vi
      .spyOn(PrescriptionItemsRepositoryImpl.prototype, 'createPrescriptionItemsBulk')
      .mockResolvedValue();

    const createApprovalSpy = vi
      .spyOn(PharmacyApprovalRepositoryImpl.prototype, 'createPharmacyApproval')
      .mockResolvedValue();

    const medications = [
      {
        getSubtotalPrice: () => 100,
        getMedicineId: () => 'med-1',
        getQuantity: () => 2,
        getInstructions: () => 'After meal',
        getMedicineName: () => 'Paracetamol',
        getForm: () => 'Tablet',
        getDosage: () => '500mg',
        getFrequency: () => '2x/day',
        getDuration: () => '5 days',
        getStrength: () => 'Strong'
      }
    ] as any;

    const id = await service.issuePrescription(
      'mr-1' as any,
      'doc-1' as any,
      'Notes',
      medications
    );

    expect(id).toBe('presc-1');
    expect(createItemsSpy).toHaveBeenCalledOnce();
    expect(createApprovalSpy).toHaveBeenCalledOnce();
  });

  it('should approve prescription', async () => {
    const approvalSpy = vi
      .spyOn(PharmacyApprovalRepositoryImpl.prototype, 'update')
      .mockResolvedValue();

    const prescriptionSpy = vi
      .spyOn(PrescriptionRepositoryImpl.prototype, 'updatePrescription')
      .mockResolvedValue();

    await service.approvePrescription(
      'presc-1' as any,
      'pa-1' as any,
      'pharm-1' as any
    );

    expect(approvalSpy).toHaveBeenCalledWith(
      'pa-1',
      expect.objectContaining({
        status: 'Partial',
        pharmacist_id: 'pharm-1'
      })
    );

    expect(prescriptionSpy).toHaveBeenCalledWith(
      'presc-1',
      expect.objectContaining({
        status: 'Approved'
      })
    );
  });

  it('should reject prescription', async () => {
    const approvalSpy = vi
      .spyOn(PharmacyApprovalRepositoryImpl.prototype, 'update')
      .mockResolvedValue();

    const prescriptionSpy = vi
      .spyOn(PrescriptionRepositoryImpl.prototype, 'updatePrescription')
      .mockResolvedValue();

    await service.rejectPrescription(
      'presc-1' as any,
      'pa-1' as any,
      'Out of stock'
    );

    expect(approvalSpy).toHaveBeenCalledWith(
      'pa-1',
      expect.objectContaining({
        status: 'Cancelled',
        notes: 'Out of stock'
      })
    );

    expect(prescriptionSpy).toHaveBeenCalledWith(
      'presc-1',
      { status: 'Cancelled' }
    );
  });

  it('should mark prescription as dispensed', async () => {
    const approvalSpy = vi
      .spyOn(PharmacyApprovalRepositoryImpl.prototype, 'update')
      .mockResolvedValue();

    const prescriptionSpy = vi
      .spyOn(PrescriptionRepositoryImpl.prototype, 'updatePrescription')
      .mockResolvedValue();

    await service.markDispensed(
      'presc-1' as any,
      'pa-1' as any
    );

    expect(approvalSpy).toHaveBeenCalledWith(
      'pa-1',
      expect.objectContaining({
        status: 'Dispensed',
        payment_received: true
      })
    );

    expect(prescriptionSpy).toHaveBeenCalledWith(
      'presc-1',
      { status: 'Dispensed' }
    );
  });
});
