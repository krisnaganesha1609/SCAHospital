<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import {
		CalendarRange,
		ChevronLeft,
		ChevronRight,
		HeartPulse,
		House,
		LogOut,
		User,
		Pill
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

	// log out pop-up functions
	let showLogoutModal = $state(false);
	function openLogoutModal() {
		showLogoutModal = true;
	}
	function closeLogoutModal() {
		showLogoutModal = false;
	}
	function redirectToLogout() {
		window.location.href = '/app/logout';
	}
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
							class={page.url.pathname.includes('/app/patients/doctor')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/patients/doctor"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} "
							>
								<HeartPulse
									color={page.url.pathname.includes('/app/patients/doctor') ? '#1754a7' : 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/patients/doctor')
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
						<li>
							<button
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} w-full text-left"
								onclick={openLogoutModal}
							>
								<LogOut color={isCollapsed ? 'white' : 'white'} />
								{#if !isCollapsed}
									<span class="ms-3 text-white">Log Out</span>
								{/if}
							</button>
						</li>
					{/if}
					{#if role === 'Receptionist'}
						<li
							class={page.url.pathname.includes('/app/dashboard/receptionist')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/dashboard/receptionist"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group {isCollapsed
									? 'justify-center'
									: 'pl-4'} flex items-center px-2 py-1.5"
							>
								<House
									color={page.url.pathname.includes('/app/dashboard/receptionist')
										? '#1754a7'
										: 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/dashboard/receptionist')
											? ' text-[#1754a7]'
											: 'text-white'}">Dashboard</span
									>
								{/if}
							</a>
						</li>
						<li
							class={page.url.pathname.includes('/app/reservations/receptionist')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/reservations/receptionist"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} "
							>
								<CalendarRange
									color={page.url.pathname.includes('/app/reservations/receptionist')
										? '#1754a7'
										: 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/reservations/receptionist')
											? ' text-[#1754a7]'
											: 'text-white'}">Reservations</span
									>
								{/if}
							</a>
						</li>
						<li>
							<button
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} w-full text-left"
								onclick={openLogoutModal}
							>
								<LogOut color={isCollapsed ? 'white' : 'white'} />
								{#if !isCollapsed}
									<span class="ms-3 text-white">Log Out</span>
								{/if}
							</button>
						</li>
					{/if}
					{#if role === 'Pharmacist'}
						<li
							class={page.url.pathname.includes('/app/dashboard/pharmacist')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/dashboard/pharmacist"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group {isCollapsed
									? 'justify-center'
									: 'pl-4'} flex items-center px-2 py-1.5"
							>
								<House
									color={page.url.pathname.includes('/app/dashboard/pharmacist')
										? '#1754a7'
										: 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/dashboard/pharmacist')
											? ' text-[#1754a7]'
											: 'text-white'}">Dashboard</span
									>
								{/if}
							</a>
						</li>
						<li
							class={page.url.pathname.includes('/app/prescription/pharmacist')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/prescription/pharmacist"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group {isCollapsed
									? 'justify-center'
									: 'pl-4'} flex items-center px-2 py-1.5"
							>
								<Pill
									color={page.url.pathname.includes('/app/prescription/pharmacist')
										? '#1754a7'
										: 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/prescription/pharmacist')
											? ' text-[#1754a7]'
											: 'text-white'}">Prescription</span
									>
								{/if}
							</a>
						</li>
						<li>
							<button
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} w-full text-left"
								onclick={openLogoutModal}
							>
								<LogOut color={isCollapsed ? 'white' : 'white'} />
								{#if !isCollapsed}
									<span class="ms-3 text-white">Log Out</span>
								{/if}
							</button>
						</li>
					{/if}
					{#if role === 'Admin'}
						<li
							class={page.url.pathname.includes('/app/dashboard/admin')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/dashboard/admin"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group {isCollapsed
									? 'justify-center'
									: 'pl-4'} flex items-center px-2 py-1.5"
							>
								<House
									color={page.url.pathname.includes('/app/dashboard/admin') ? '#1754a7' : 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/dashboard/admin')
											? ' text-[#1754a7]'
											: 'text-white'}">Dashboard</span
									>
								{/if}
							</a>
						</li>
						<li
							class={page.url.pathname.includes('/app/patients/admin')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/patients/admin"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} "
							>
								<HeartPulse
									color={page.url.pathname.includes('/app/patients/admin') ? '#1754a7' : 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/patients/admin')
											? ' text-[#1754a7]'
											: 'text-white'}">Patients</span
									>
								{/if}
							</a>
						</li>
						<li
							class={page.url.pathname.includes('/app/prescription/admin')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/prescription/admin"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group {isCollapsed
									? 'justify-center'
									: 'pl-4'} flex items-center px-2 py-1.5"
							>
								<Pill
									color={page.url.pathname.includes('/app/prescription/admin')
										? '#1754a7'
										: 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/prescription/admin')
											? ' text-[#1754a7]'
											: 'text-white'}">Prescription</span
									>
								{/if}
							</a>
						</li>
						<li
							class={page.url.pathname.includes('/app/reservations/admin')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/reservations/admin"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} "
							>
								<CalendarRange
									color={page.url.pathname.includes('/app/reservations/admin')
										? '#1754a7'
										: 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/reservations/admin')
											? ' text-[#1754a7]'
											: 'text-white'}">Reservations</span
									>
								{/if}
							</a>
						</li>
						<li
							class={page.url.pathname.includes('/app/user/admin')
								? 'rounded-[20px] bg-[#e8f0fa] py-2'
								: ''}
						>
							<a
								href="/app/user/admin"
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} "
							>
								<User
									color={page.url.pathname.includes('/app/user/admin')
										? '#1754a7'
										: 'white'}
								/>
								{#if !isCollapsed}
									<span
										class="ms-3 {page.url.pathname.includes('/app/user/admin')
											? ' text-[#1754a7]'
											: 'text-white'}">Users</span
									>
								{/if}
							</a>
						</li>
						<li>
							<button
								class="text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group flex items-center px-2 py-1.5 {isCollapsed
									? 'justify-center'
									: 'pl-4'} w-full text-left"
								onclick={openLogoutModal}
							>
								<LogOut color={isCollapsed ? 'white' : 'white'} />
								{#if !isCollapsed}
									<span class="ms-3 text-white">Log Out</span>
								{/if}
							</button>
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

<!-- log out pop-up -->
{#if showLogoutModal}
  <!-- overlay -->
  <div
    class="fixed inset-0 z-50 bg-black/50"
    onclick={closeLogoutModal}
    onkeydown={(e) => e.key === 'Escape' && closeLogoutModal()}
    role="button"
    tabindex="0"
  ></div>

  <!-- modal container -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      class="relative w-full max-w-lg bg-white p-6 shadow-lg"
      style="border-radius: 32px;"
    >
      <!-- header row: icon left, close-X right -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FA]">
          <LogOut color="#1d69d1" size={24} />
        </div>
        <button
          class="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F5] font-bold text-black text-2xl"
          onclick={closeLogoutModal}
          aria-label="Close"
        >
          X
        </button>
      </div>

	  <!-- Log out text -->
      <div class="flex flex-col space-y-2">
        <h3 class="text-left text-2xl font-bold">Log out?</h3>
        <p class="text-left" style="color: #8E8E8E;">You'll be signed out from your account.</p>
		<!-- Dummy Text -->
		<p class="text-left" ><br></p>
      </div>

	  <!-- log out button -->
      <div class="mt-4 flex w-full justify-end">
        <button
          class="rounded-full bg-[#1d69d1] px-6 py-2 font-medium text-white hover:bg-[#155ab8]"
          onclick={redirectToLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  </div>
{/if}
