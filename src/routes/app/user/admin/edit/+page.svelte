<script lang="ts">
	import { User } from '$lib/shared/entities';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { Eye, EyeOff, ArrowLeft, Save, Trash2, Loader2 } from '@lucide/svelte';
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
	let showConfirmPassword = $state(false);

	let isSubmitting = $state(false);
	let isDeleting = $state(false);

	const roles = [
		{ value: 'Doctor', label: 'Doctor' },
		{ value: 'Admin', label: 'Admin' },
		{ value: 'Pharmacist', label: 'Pharmacist' },
		{ value: 'Receptionist', label: 'Receptionist' }
	];

	let triggerContentRole = $derived(roles.find((f) => f.value === role)?.label ?? 'Select a role');
</script>

<div class="min-h-screen bg-[#F3F5F7] p-8">
	<div class="mx-auto max-w-6xl">
		<div class="mb-6 flex items-center justify-between">
			<div class="flex items-center gap-4">
				<Button
					variant="ghost"
					class="h-10 w-10 rounded-full border border-gray-200 bg-white p-0 shadow-sm hover:bg-gray-50"
					onclick={() => window.history.back()}
				>
					<ArrowLeft size={18} class="text-gray-600" />
				</Button>
				<div>
					<h1 class="text-lg leading-tight font-bold text-gray-900">Edit User Details</h1>
					<p class="font-mono text-[11px] text-gray-400">ID: {user.getUserId()}</p>
				</div>
			</div>
		</div>

		<form
			id="userForm"
			method="POST"
			action="?/updateUser"
			use:enhance={() => {
				if (password !== '' || confirmPassword !== '') {
					if (password.length < 6) {
						toast.error('Password too short', {
							description: 'Password minimal harus 6 karakter.'
						});
						return;
					}
					if (password !== confirmPassword) {
						toast.error('Password Mismatch', {
							description: 'Password and Confirm Password do not match.'
						});
						return;
					}
				}
				isSubmitting = true;
				return async ({ result, update }) => {
					isSubmitting = false;
					if (result.type === 'success') {
						toast.success('User updated successfully');
						await goto('/app/user/admin');
					}
					await update();
				};
			}}
			class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
		>
			<input type="hidden" name="id" value={user.getUserId()} />

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<div class="flex flex-col gap-2">
					<label for="email" class="px-1 text-xs font-semibold text-gray-600"
						>Email (Username)</label
					>
					<input
						name="email"
						bind:value={email}
						class="h-12 rounded-xl border border-gray-300 px-4 text-sm focus:border-[#1D69D1] focus:outline-none"
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="fullName" class="px-1 text-xs font-semibold text-gray-600">Full Name</label>
					<input
						name="fullName"
						bind:value={fullName}
						class="h-12 rounded-xl border border-gray-300 px-4 text-sm focus:border-[#1D69D1] focus:outline-none"
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="role" class="px-1 text-xs font-semibold text-gray-600">Role</label>
					<Select.Root type="single" name="role" bind:value={role}>
						<Select.Trigger class="h-12 rounded-xl border border-gray-300 px-4 text-left text-sm">
							{triggerContentRole}
						</Select.Trigger>
						<Select.Content class="rounded-xl border border-gray-100 shadow-xl">
							{#each roles as r}
								<Select.Item value={r.value} label={r.label} class="cursor-pointer py-3 text-sm"
									>{r.label}</Select.Item
								>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="flex flex-col gap-2">
					<label for="phone" class="px-1 text-xs font-semibold text-gray-600">Phone Number</label>
					<input
						name="phone"
						bind:value={phoneNumber}
						class="h-12 rounded-xl border border-gray-300 px-4 text-sm focus:border-[#1D69D1] focus:outline-none"
					/>
				</div>
				<!-- Password -->
				<div class="flex flex-col gap-2">
					<label for="password" class="px-1 text-xs font-semibold text-gray-600">Password</label>
					<div class="relative">
						<input
							name="password"
							id="password"
							type={showPassword ? 'text' : 'password'}
							autocomplete="new-password"
							class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pr-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
							bind:value={password}
							placeholder="••••••••"
						/>
						<button
							type="button"
							class="absolute top-1/2 right-0 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-gray-500 hover:text-[#1D69D1]"
							onclick={() => (showPassword = !showPassword)}
							tabindex="-1"
						>
							{#if showPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>
				</div>

				<div class="flex flex-col gap-2">
					<label for="confirmPassword" class="px-1 text-xs font-semibold text-gray-600"
						>Confirm Password</label
					>
					<div class="relative">
						<input
							name="confirmPassword"
							id="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							autocomplete="new-password"
							class="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pr-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#1D69D1] focus:ring-2 focus:ring-[#1D69D1]/10 focus:outline-none"
							bind:value={confirmPassword}
							placeholder="••••••••"
						/>
						<button
							type="button"
							class="absolute top-1/2 right-0 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-gray-500 hover:text-[#1D69D1]"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
							tabindex="-1"
						>
							{#if showConfirmPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>
				</div>
			</div>
		</form>

		<div class="mt-8 flex justify-end gap-3">
			<form
				method="POST"
				action="?/deleteUser"
				use:enhance={() => {
					const confirmDelete = confirm('Are you sure you want to delete this user?');
					if (!confirmDelete) return;

					isDeleting = true;

					return async ({ result, update }) => {
						isDeleting = false;

						if (result.type === 'redirect') {
							toast.success('User deleted successfully');
							await goto(result.location);
						} else if (result.type === 'success') {
							toast.success('User deleted');
							await goto('/app/user/admin');
						} else {
							toast.error('Delete failed: Internal Server Error');
						}

						await update();
					};
				}}
			>
				<input type="hidden" name="id" value={user.getUserId()} />

				<Button
					type="submit"
					variant="outline"
					disabled={isDeleting || isSubmitting}
					class="h-12 rounded-full border-2 border-red-500 px-6 font-bold text-red-500 hover:bg-red-50"
				>
					{#if isDeleting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{:else}
						<Trash2 class="mr-2 h-4 w-4" />
						<span>Remove User</span>
					{/if}
				</Button>
			</form>

			<Button
				form="userForm"
				type="submit"
				disabled={isSubmitting || isDeleting}
				class="h-12 min-w-[140px] rounded-full bg-[#1D69D1] px-8 font-bold text-white shadow-lg hover:bg-[#1656b0]"
			>
				{#if isSubmitting}
					<Loader2 class="h-5 w-5 animate-spin text-white" />
				{:else}
					<Save class="mr-2 h-4 w-4" />
					<span>Save Changes</span>
				{/if}
			</Button>
		</div>
	</div>
</div>

<style>
	:global(.rounded-2xl) {
		border-radius: 20px;
	}
</style>
