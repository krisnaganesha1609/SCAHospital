import { describe, it, expect } from 'vitest';
import { Patient } from '$lib/shared/entities/Patient';

describe('Patient Entity', () => {
  const now = new Date();

  const patient = new Patient(
    'uuid-123' as any,
    'MR-001',
    'Gede Krisna',
    new Date('2000-01-01'),
    'Male',
    'Denpasar',
    '08123456789',
    'O',
    'None',
    now,
    now,
    []
  );

  it('should return correct getters', () => {
    expect(patient.getId()).toBe('uuid-123');
    expect(patient.getFullName()).toBe('Gede Krisna');
    expect(patient.getGender()).toBe('Male');
    expect(patient.getBloodType()).toBe('O');
  });

  it('should convert to JSON correctly', () => {
    const json = patient.toJson() as any;

    expect(json).toHaveProperty('id', 'uuid-123');
    expect(json).toHaveProperty('medical_record_number', 'MR-001');
    expect(json).toHaveProperty('full_name', 'Gede Krisna');
    expect(json).toHaveProperty('blood_type', 'O');
  });

  it('should create Patient from JSON', () => {
    const p = Patient.fromJson({
      id: 'uuid-123',
      medical_record_number: 'MR-001',
      full_name: 'Gede Krisna',
      date_of_birth: new Date('2000-01-01'),
      gender: 'Male',
      address: 'Denpasar',
      phone: '08123456789',
      blood_type: 'O',
      allergies: 'None',
      created_at: now,
      updated_at: now,
      medical_records: []
    });

    expect(p).toBeInstanceOf(Patient);
    expect(p.getFullName()).toBe('Gede Krisna');
  });
});
