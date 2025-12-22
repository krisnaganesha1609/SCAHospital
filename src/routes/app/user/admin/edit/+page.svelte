<script lang="ts">
	import { User } from '$lib/shared/entities';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Eye, EyeOff, ArrowLeft, Save, Trash2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let { data } = $props();
	const user = User.fromPOJO(data.user);

	let fullName = $state(user.getFullName());
	let email = $state(user.getEmail());
	let role = $state(user.getRole() as string);
	let phoneNumber = $state(user.getPhone());

	let password = $state('');
	let confirmPassword = $state('');
	let showPassword = $state(false);
	let isSubmitting = $state(false);

	const roles = [
		{ value: 'Doctor', label: 'Doctor' },
		{ value: 'Admin', label: 'Admin' },
		{ value: 'Pharmacist', label: 'Pharmacist' },
		{ value: 'Receptionist', label: 'Receptionist' }
	];

	// reactive label for the select trigger (keeps markup simple)
	let triggerContentRole = $derived(roles.find((f) => f.value === role)?.label ?? 'Select a role');

	function validateForm(): boolean {
		if (password && password !== confirmPassword) {
			toast.error('Password Mismatch', {
				description: 'Password and Confirm Password do not match.'
			});
			return false;
		}
		return true;
	}
</script>

<svelte:head>
	<title>Edit User - {user.getFullName()}</title>
</svelte:head>

<div class="min-h-screen bg-[#F3F5F7] p-8">
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<div class="mb-6 flex items-center gap-4">
			<Button
				variant="ghost"
				class="h-10 w-10 rounded-full border border-gray-200 bg-white p-0 shadow-sm hover:bg-gray-50"
				onclick={() => history.back()}
			>
				<ArrowLeft size={18} class="text-gray-600" />
			</Button>
			<div>
				<h1 class="text-lg leading-tight font-bold text-gray-900">Edit User Details</h1>
				<p class="font-mono text-[11px] text-gray-400">ID: {user.getUserId()}</p>
			</div>
		</div>

		<!-- Form card that matches the screenshot layout -->
		<form
			method="POST"
			action="?/updateUser"
			use:enhance={() => {
				if (!validateForm()) return;
				isSubmitting = true;
				return async ({ result, update }) => {
					isSubmitting = false;
					if (result.type === 'success') {
						toast.success('User updated successfully');
						goto('/app/user/admin');
					}
					await update();
				};
			}}
			class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
		>
			<input type="hidden" name="id" value={user.getUserId()} />

			<div class="grid grid-cols-3 gap-6">
				<!-- Email -->
				<div class="flex flex-col gap-2">
					<label for="email" class="px-1 text-xs font-semibold text-gray-600"
						>Email (Username)</label
					>
					<input
						name="email"
						class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
						bind:value={email}
						placeholder="example@clinic.com"
					/>
				</div>

				<!-- Full Name -->
				<div class="flex flex-col gap-2">
					<label for="fullName" class="px-1 text-xs font-semibold text-gray-600">Full Name</label>
					<input
						name="fullName"
						class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
						bind:value={fullName}
						placeholder="Enter full name"
					/>
				</div>

				<!-- Role Select (aligned to right in row) -->
				<div class="flex flex-col gap-2">
					<label for="role" class="px-1 text-xs font-semibold text-gray-600">Role</label>
					<Select.Root type="single" name="role" bind:value={role}>
						<Select.Trigger
							class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-left text-sm font-medium text-gray-900 focus:ring-[#1D69D1]/10"
						>
							{triggerContentRole}
						</Select.Trigger>
						<Select.Content class="rounded-xl border border-gray-100 shadow-xl">
							{#each roles as r}
								<Select.Item
									value={r.value}
									label={r.label}
									class="cursor-pointer py-3 text-sm font-medium"
								>
									{r.label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<!-- Phone Number (row 2 col 1) -->
				<div class="flex flex-col gap-2">
					<label for="phone" class="px-1 text-xs font-semibold text-gray-600">Phone Number</label>
					<input
						name="phone"
						class="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
						bind:value={phoneNumber}
						placeholder="+62xxxxxxxx"
					/>
				</div>

				<!-- Password (row 2 col 2) -->
				<div class="flex flex-col gap-2">
					<label for="password" class="px-1 text-xs font-semibold text-gray-600">Password</label>
					<div class="relative">
						<input
							name="password"
							type={showPassword ? 'text' : 'password'}
							class="h-12 rounded-xl border border-gray-300 bg-white px-4 pr-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
							bind:value={password}
							placeholder="••••••••"
						/>
						<button
							type="button"
							class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-[#1D69D1]"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>
				</div>

				<!-- Confirm Password (row 2 col 3) -->
				<div class="flex flex-col gap-2">
					<label for="confirmPassword" class="px-1 text-xs font-semibold text-gray-600"
						>Confirm Password</label
					>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							class="h-12 rounded-xl border border-gray-300 bg-white px-4 pr-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
							bind:value={confirmPassword}
							placeholder="••••••••"
						/>
						<div class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
							<EyeOff size={18} class="opacity-60" />
						</div>
					</div>
				</div>
			</div>
		</form>
		<!-- Action buttons aligned to the right to match the screenshot -->
		<div class="mt-6 flex justify-end gap-4">
			<Button
				variant="ghost"
				type="submit"
				disabled={isSubmitting}
				class="flex h-11 min-w-[140px] items-center justify-center gap-2 rounded-full bg-[#FFAD0D] text-base font-bold text-white transition-all"
			>
				{#if isSubmitting}
					<div
						class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
				{:else}
					<span>Edit</span>
				{/if}
			</Button>

			<Button
				variant="ghost"
				type="button"
				class="flex h-11 min-w-[140px] items-center justify-center gap-2 rounded-full bg-[#EF3131]  text-base font-bold text-white transition-all"
				onclick={() => toast.info('Deletion restricted')}
			>
				<span>Delete User</span>
			</Button>
		</div>
	</div>
</div>

<style>
	/* Utility fix for select triggers to handle overflow text */
	:global(button[role='combobox']) {
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	/* slightly larger rounded corner used in screenshot */
	:global(.rounded-2xl) {
		border-radius: 20px;
	}
</style>
