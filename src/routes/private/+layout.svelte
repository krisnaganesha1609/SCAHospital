<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});

	const role = data?.role;
</script>

<nav class="sidebar">
	{#if role === 'doctor'}
		<a href="/private/dashboard/doctor">Dashboard Dokter</a>
		<a href="/private/patients">Daftar Pasien</a>
	{/if}

	{#if role === 'receptionist'}
		<a href="/private/registrations">Registrasi Pasien</a>
	{/if}

	{#if role === 'pharmacist'}
		<a href="/private/pharmacy">Farmasi</a>
	{/if}

	{#if role === 'admin'}
		<a href="/private/manage/users">Kelola User</a>
	{/if}
</nav>

<main>
	{@render children?.()}
</main>
