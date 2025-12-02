<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		CalendarRange,
		ChevronLeft,
		ChevronRight,
		HeartPulse,
		House,
		LogOut
	} from '@lucide/svelte';
	import logo from '$lib/assets/logo-white.svg';
	import { page } from '$app/state';
	import { Footer } from '$lib/shared/components';
	import { collapsed } from '$lib/shared/stores/collapse';

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
	let isCollapsed = $state($collapsed);
	function toggleCollapse() {
		isCollapsed = !isCollapsed;
		collapsed.set(isCollapsed);
	}
	const layoutBg = $derived(
		(page?.url?.pathname || '').startsWith('/app/dashboard') ? 'bg-white' : 'bg-[#F5F5F5]'
	);
</script>

<div class="flex min-h-screen flex-col {layoutBg}">
	<div>
		<button
			class="fixed top-4 {isCollapsed
				? ' translate-x-2'
				: ' translate-x-60'} z-50 cursor-pointer rounded-full bg-[#1d69d1] p-2 shadow-lg transition-transform duration-300"
			onclick={() => toggleCollapse()}
		>
			{#if isCollapsed}
				<ChevronRight color="white" />
			{:else}
				<ChevronLeft color="white" />
			{/if}
		</button>
		<aside
			class="fixed top-0 {isCollapsed
				? 'w-min -translate-x-1/12'
				: 'w-64 translate-x-0'} z-40 h-full transition-transform duration-300"
		>
			<div class="border-default h-full overflow-y-auto border-e bg-[#113f7d] px-3 py-4">
				<img src={logo} alt="Logo" srcset="" class="mt-10 mb-10 px-4 {isCollapsed ? 'w-0' : ''}" />
				<ul class="space-y-5 font-medium">
					{#if role === 'Doctor'}
						<li
							class={page.url.pathname.includes('/app/dashboard/doctor')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/dashboard/doctor"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group {isCollapsed
									? 'justify-center'
									: 'pl-4'} flex items-center px-2 py-1.5"
							>
								<House
									color={page.url.pathname.includes('/app/dashboard/doctor') ? '#1754a7' : 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/dashboard/doctor')
											? ' text-[#1754a7]'
											: 'text-white'}">Dashboard</span
									>
								{/if}
							</a>
						</li>
						<li
							class={page.url.pathname.includes('/app/patients')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/patients"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} "
							>
								<HeartPulse
									color={page.url.pathname.includes('/app/patients') ? '#1754a7' : 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/patients')
											? ' text-[#1754a7]'
											: 'text-white'}">Patients</span
									>
								{/if}
							</a>
						</li>
						<li
							class={page.url.pathname.includes('/app/reservations/doctor')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/reservations/doctor"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} "
							>
								<CalendarRange
									color={page.url.pathname.includes('/app/reservations/doctor')
										? '#1754a7'
										: 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/reservations/doctor')
											? ' text-[#1754a7]'
											: 'text-white'}">View Reservations</span
									>
								{/if}
							</a>
						</li>
						<li
							class={page.url.pathname.includes('/app/logout')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/logout"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} "
							>
								<LogOut color={page.url.pathname.includes('/app/logout') ? '#1754a7' : 'white'} />
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/logout')
											? ' text-[#1754a7]'
											: 'text-white'}">Log Out</span
									>
								{/if}
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
		<div class="{isCollapsed ? 'ml-16' : 'ml-64 '} transition-all duration-300">
			{@render children?.()}
		</div>
	</div>
	<div class="{isCollapsed ? 'ml-12' : 'ml-64'} transition-all duration-300">
		<Footer />
	</div>
</div>
