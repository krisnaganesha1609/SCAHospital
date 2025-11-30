import { PatientServiceImpl } from "$lib/server/services/PatientServiceImpl";
import type { PageServerLoad } from "./$types";
import { toPOJO } from '$lib/shared/utils/Utils';
import { MedicalRecordServiceImpl } from "$lib/server/services/MedicalRecordServiceImpl";


export const load: PageServerLoad = async ({ locals }) => {
    const listPatients = await new PatientServiceImpl(locals.supabase).listPatients();
    for (const patient of listPatients) {
        const record = await new MedicalRecordServiceImpl(locals.supabase).getMedicalRecordOfAPatient(patient.getId());
        console.log("Medical Record:", record);
        let recordsMap = new Map<string, any>();
        if (record) {
            recordsMap.set(patient.getId(), record);
            return { patients: toPOJO(listPatients), medicalRecord: toPOJO(recordsMap) };
        }
    }
    console.log("List Patients:", listPatients);
    return { patients: toPOJO(listPatients), medicalRecord: toPOJO(null) };
}