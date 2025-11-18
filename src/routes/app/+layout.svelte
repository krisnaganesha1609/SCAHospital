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

<aside
	id="default-sidebar"
	class="fixed top-0 left-0 z-40 h-full w-64 -translate-x-full transition-transform sm:translate-x-0"
	aria-label="Sidebar"
>
	<div class="bg-neutral-primary-soft border-default h-full overflow-y-auto border-e px-3 py-4">
		<ul class="space-y-2 font-medium">
			{#if role === 'Doctor'}
				<li>
					<a
						href="/app/dashboard/doctor"
						class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5"
					>
						<svg
							class="group-hover:text-fg-brand h-5 w-5 transition duration-75"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
							/><path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
							/></svg
						>
						<span class="ms-3">Dashboard</span>
					</a>
				</li>
				<li>
					<a
						href="/app/patients"
						class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5"
					>
						<svg
							class="group-hover:text-fg-brand h-5 w-5 transition duration-75"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
							/><path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
							/></svg
						>
						<span class="ms-3">Daftar Pasien</span>
					</a>
				</li>
			{/if}
			{#if role === 'Receptionist'}
				<li>
					<a
						href="/app/registrations"
						class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5"
					>
						<svg
							class="group-hover:text-fg-brand h-5 w-5 transition duration-75"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
							/><path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
							/></svg
						>
						<span class="ms-3">Registrasi Pasien</span>
					</a>
				</li>
			{/if}
			{#if role === 'Pharmacist'}
				<li>
					<a
						href="/app/dashboard/pharmacist"
						class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5"
					>
						<svg
							class="group-hover:text-fg-brand h-5 w-5 transition duration-75"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
							/><path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
							/></svg
						>
						<span class="ms-3">Dashboard</span>
					</a>
				</li>
			{/if}
			{#if role === 'Admin'}
				<li>
					<a
						href="/app/dashboard/admin"
						class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5"
					>
						<svg
							class="group-hover:text-fg-brand h-5 w-5 transition duration-75"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
							><path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M10 6.025A7.5 7.5 0 1 0 17.975 14H10V6.025Z"
							/><path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.5 3c-.169 0-.334.014-.5.025V11h7.975c.011-.166.025-.331.025-.5A7.5 7.5 0 0 0 13.5 3Z"
							/></svg
						>
						<span class="ms-3">Dashboard</span>
					</a>
				</li>
			{/if}
		</ul>
	</div>
</aside>
<div class="p-4 sm:ml-64">
	<div class="border-default rounded-base border border-dashed p-4">
		{@render children?.()}
	</div>
</div>
