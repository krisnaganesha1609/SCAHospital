import { describe, it, expect, vi } from 'vitest';
import { PatientServiceImpl } from '$lib/server/services/PatientServiceImpl';
import { PatientRepositoryImpl } from '$lib/server/repositories/PatientRepositoryImpl';

describe('PatientServiceImpl', () => {

  it('should register patient and return uuid', async () => {
    const supabase = {} as any;

    vi.spyOn(PatientRepositoryImpl.prototype, 'createNewPatient')
      .mockResolvedValue('uuid-created' as any);

    const service = new PatientServiceImpl(supabase);
    const id = await service.register({
      full_name: 'Test',
      medical_record_number: 'MR',
    });

    expect(id).toBe('uuid-created');
  });

  it('should update patient with filtered payload', async () => {
    const supabase = {} as any;

    const spy = vi
      .spyOn(PatientRepositoryImpl.prototype, 'updateExistingPatient')
      .mockResolvedValue();

    const service = new PatientServiceImpl(supabase);

    await service.update('uuid-1' as any, {
      fullName: 'Updated Name',
      phone: ''
    });

    expect(spy).toHaveBeenCalledWith(
      'uuid-1',
      expect.objectContaining({
        full_name: 'Updated Name'
      })
    );
  });

  it('should return empty array when no patients', async () => {
    const supabase = {} as any;

    vi.spyOn(PatientRepositoryImpl.prototype, 'fetchPatients')
      .mockResolvedValue([]);

    const service = new PatientServiceImpl(supabase);
    const result = await service.listPatients();

    expect(result).toEqual([]);
  });
});
