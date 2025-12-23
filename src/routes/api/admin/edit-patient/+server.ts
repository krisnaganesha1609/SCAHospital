import { PatientServiceImpl } from '$lib/server/services/PatientServiceImpl.js';

export const PUT = async ({ request, locals }) => {
    const data = await request.json();
    const id = data.id;
    const payload = data.payload;
    await new PatientServiceImpl(locals.supabase).update(id, payload);
    return new Response(JSON.stringify({ message: `Patient updated successfully`, payload }), { status: 200 });
}