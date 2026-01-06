import { describe, it, expect } from 'vitest';
import { PatientRepositoryImpl } from '$lib/server/repositories/PatientRepositoryImpl';
import { createSupabaseMock } from '../SupabaseMock';

describe('PatientRepositoryImpl', () => {

  it('should fetch patients and map to Patient entities', async () => {
    const supabase = createSupabaseMock({
      data: [{
        id: 'uuid-1',
        medical_record_number: 'MR-001',
        full_name: 'Krisna',
        date_of_birth: new Date(),
        gender: 'Male',
        address: '',
        phone: '',
        blood_type: 'O',
        allergies: '',
        created_at: new Date(),
        updated_at: new Date(),
        medical_records: []
      }],
      error: null
    });

    const repo = new PatientRepositoryImpl(supabase);
    const result = await repo.fetchPatients();

    expect(result).toHaveLength(1);
    expect(result?.[0].getFullName()).toBe('Krisna');
  });

  it('should create new patient and return uuid', async () => {
    const supabase = createSupabaseMock({
      data: [{ id: 'uuid-new' }],
      error: null
    });

    const repo = new PatientRepositoryImpl(supabase);

    const id = await repo.createNewPatient({
      getFullName: () => 'Test',
      getDateOfBirth: () => new Date(),
      getGender: () => 'Male',
      getAddress: () => '',
      getPhone: () => '',
      getBloodType: () => '',
      getAllergies: () => ''
    } as any);

    expect(id).toBe('uuid-new');
  });

  it('should throw error when update fails', async () => {
    const supabase = createSupabaseMock({
      data: null,
      error: new Error('Update failed')
    });

    const repo = new PatientRepositoryImpl(supabase);

    await expect(
      repo.updateExistingPatient('uuid' as any, {})
    ).rejects.toThrow('Update failed');
  });
});
