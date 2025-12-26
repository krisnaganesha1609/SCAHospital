<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Patient, User } from '$lib/shared/entities';
	import { Button } from '$lib/components/ui/button';
	import { Calendar as UiCalendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import * as Select from '$lib/components/ui/select';
	import { Mars, Venus } from '@lucide/svelte';
	import { type DateValue, CalendarDate, DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { CalendarDays } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { redirect } from '@sveltejs/kit';
	import { ArrowLeft } from '@lucide/svelte';
	import { selectedPatientStore } from '$lib/shared/stores/selectedPatient';

	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	let { data } = $props();
	const user = User.fromPOJO(data.profile);

	// selected patient
	let patient: Patient | null = $state(null);
	const unsubscribe = selectedPatientStore.subscribe((p) => (patient = p));

	// reservation / patient form
	let patientName = $state('');
	let gender = $state<'Male' | 'Female' | ''>('');
	let phoneNumber = $state('');
	let address = $state('');
	let bloodType = $state('');
	let allergies = $state('');
	let birthDate = $state<DateValue | undefined>(undefined);

	const bloodTypes: { value: string; label: string }[] = [
		{ value: 'A', label: 'A' },
		{ value: 'B', label: 'B' },
		{ value: 'AB', label: 'AB' },
		{ value: 'O', label: 'O' }
	];
	const triggerContentBloodType = $derived(
		bloodTypes.find((f) => f.value === bloodType)?.label ?? 'Select a blood type'
	);

	function isRecordComplete(): { ok: boolean; missing: string[] } {
		const missing: string[] = [];

		if (!patientName) missing.push('Patient Name');
		if (!gender) missing.push('Gender');
		if (!phoneNumber) missing.push('Phone Number');
		if (!address) missing.push('Address');
		if (!bloodType) missing.push('Blood Type');
		if (!birthDate) missing.push('Birth Date');
		if (!allergies) missing.push('Allergies');

		return { ok: missing.length === 0, missing };
	}

	// Save record — validate all fields, then reveal prescription section
	async function saveRecord() {
		const { ok, missing } = isRecordComplete();
		if (!ok) {
			toast.error('Validation Error', {
				description: 'Please fill the following fields before saving:\n- ' + missing.join('\n- '),
				closeButton: true
			});
			return;
		}
		const payload = {
			full_name: patientName,
			gender: gender,
			phone: phoneNumber,
			address: address,
			date_of_birth: birthDate ? birthDate.toString() : null,
			blood_type: bloodType,
			allergies: allergies
		};

		// POST to server endpoint
		const response = await fetch('/api/admin/edit-patient', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: patient?.getId(), payload: payload }),
		});

		if (!response.ok) {
			toast.error('Failed to save record. Please try again.', {
				description: 'Server responded with ' + response.status,
				closeButton: true
			});
			return;
		}

		// notify user
		toast.success('Patient edited successfully');

		redirect(303, '/app/patients/admin');
	}

	onMount(() => {
		// if editing existing patient, populate fields
		if (patient) {
			patientName = patient.getFullName();
			gender = patient.getGender() as 'Male' | 'Female' | '';
			phoneNumber = patient.getPhone();
			address = patient.getAddress();
			bloodType = patient.getBloodType();
			allergies = patient.getAllergies();
			birthDate = parseDate(patient.getDateOfBirth().toString());
		}
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<svelte:head>
	<title>Edit Patient</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-6">
	<div class="mx-auto space-y-4">
		<!-- top bar: back + title -->
		<div class="mb-6 flex items-center gap-4">
			<Button
				variant="ghost"
				class="h-10 w-10 rounded-full border border-gray-200 bg-white p-0 shadow-sm hover:bg-gray-50"
				onclick={() => history.back()}
			>
				<ArrowLeft size={18} class="text-gray-600" />
			</Button>
			<div>
				<h1 class="text-lg leading-tight font-bold text-gray-900">Edit Patient</h1>
			</div>
		</div>

		<!-- RECORD FORM -->
		<!-- PATIENT RESERVATION BLOCK -->
		<div class="space-y-6 rounded-xl border bg-white p-6">
			<h3 class="text-lg font-semibold">Patient Data</h3>

			<!-- BASIC INFO -->
			<div class="grid grid-cols-3 gap-4">
				<!-- Patient Name -->
				<div>
					<label for="patientName" class="block pb-1 text-xs text-black">Patient Name</label>
					<input
						class="w-full rounded-md border px-3 py-2 text-xs"
						bind:value={patientName}
						placeholder="Enter Full name"
					/>
				</div>

				<!-- Phone Number -->
				<div>
					<label for="phoneNumber" class="block pb-1 text-xs text-black">Phone Number</label>
					<input
						class="w-full rounded-md border px-3 py-2 text-xs"
						bind:value={phoneNumber}
						placeholder="+62xxxxxxxxxx"
					/>
				</div>

				<!-- Blood Type -->
				<div>
					<label for="bloodType" class="block pb-1 text-xs text-black">Blood Type</label>
					<Select.Root type="single" name="favoriteFruit" bind:value={bloodType}>
						<Select.Trigger class="w-full rounded-md border px-3 py-2 text-xs">
							{triggerContentBloodType}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Blood Types</Select.Label>
								{#each bloodTypes as bl (bl.value)}
									<Select.Item value={bl.value} label={bl.label}>
										{bl.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>

			<!-- SECOND STACK -->
			<div class="grid grid-cols-3 gap-4">
				<!-- Gender -->
				<div>
					<label for="gender" class="block pb-1 text-xs text-black">Gender</label>
					<div class="grid grid-cols-3 gap-2">
						<button
							type="button"
							class="text-md flex items-center justify-center rounded-full px-4 py-3 font-medium text-white transition"
							style="background-color:#1D69D1"
							class:opacity-100={gender === 'Male'}
							class:opacity-50={gender !== 'Male'}
							onclick={() => (gender = 'Male')}
						>
							Male
							<Mars class="ml-1 inline-block" color="#ffffff" />
						</button>

						<button
							type="button"
							class="text-md flex items-center justify-center rounded-full px-4 py-3 font-medium text-white transition ${gender ===
							'Female'
								? 'bg-[#DE51A7]'
								: 'bg-gray-300'}"
							style="background-color:#DE51A7"
							class:opacity-100={gender === 'Female'}
							class:opacity-50={gender !== 'Female'}
							onclick={() => (gender = 'Female')}
						>
							Female
							<Venus class="ml-1 inline-block" color="#ffffff" />
						</button>
					</div>
				</div>

				<!-- Address -->
				<div>
					<label for="address" class="block pb-1 text-xs text-black">Address</label>
					<textarea
						class="w-full rounded-md border px-3 py-2 text-xs"
						rows="2"
						bind:value={address}
						placeholder="Patient address"
					></textarea>
				</div>

				<!-- Allergies -->
				<div>
					<label for="allergies" class="block pb-1 text-xs text-black">Allergies</label>
					<textarea
						class="w-full rounded-md border px-3 py-2 text-xs"
						rows="2"
						bind:value={allergies}
						placeholder="e.g., Penicillin, seafood"
					></textarea>
				</div>
				<div>
					<label for="birthDate" class="block pb-2 text-xs text-black">Birth Date</label>
					<Popover.Root>
						<Popover.Trigger class="w-full">
							<Button
								class={cn(
									'w-full justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-start text-xs font-normal text-black hover:bg-gray-50',
									!birthDate && 'text-muted-foreground'
								)}
							>
								{birthDate ? df.format(birthDate.toDate(getLocalTimeZone())) : 'Select a date'}
								<CalendarDays color="#1D69D1" />
							</Button>
						</Popover.Trigger>

						<Popover.Content class="w-auto p-0">
							<UiCalendar
								type="single"
								initialFocus
								captionLayout="dropdown"
								maxValue={new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())}
								bind:value={birthDate}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>
			</div>
		</div>
	</div>
	<div class="flex justify-end border-t pt-4">
		<Button
			class="rounded-full bg-[#1D69D1] px-6 py-3 text-sm text-white"
			onclick={() => {
				saveRecord();
			}}
		>
			Save Patient
		</Button>
	</div>
</div>

<style>
	:global(.bg-\#1D69D1) {
		background-color: #1d69d1 !important;
	}
</style>
