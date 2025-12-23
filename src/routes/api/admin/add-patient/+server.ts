import { PatientServiceImpl } from '$lib/server/services/PatientServiceImpl';
export const POST = async ({ request, locals }) => {
    const payload = await request.json();
    const patientService = new PatientServiceImpl(locals.supabase);
    try {
        await patientService.register(payload);
        return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (e) {
        console.error('Error adding patient:', e);
        return new Response(JSON.stringify({ success: false, message: 'Failed to add patient' }), { status: 500 });
    }
};

