<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { onDestroy } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { selectedPatientStore } from '$lib/shared/stores/selectedPatient';
	import { Medicine, PrescriptionItems, User, type Patient } from '$lib/shared/entities';
	import { Button } from '$lib/components/ui/button';
	import { Calendar as UiCalendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { Mars, SearchIcon, Venus } from '@lucide/svelte';
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { CalendarDays, CheckIcon, ChevronsUpDownIcon } from '@lucide/svelte';
	import { format } from 'date-fns';
	import type { uuid } from '$lib/shared/types/type_def.js';
	import { toast } from 'svelte-sonner';
	import { PrescriptionItemsRequest } from '$lib/shared/utils/PrescriptionItems_Request.js';
	import { redirect } from '@sveltejs/kit';

	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	let { data } = $props();
	const user = User.fromPOJO(data.profile);
	const medicines: Medicine[] = data.medicines.map((m: any) => Medicine.fromPOJO(m));

	// selected patient
	let patient: Patient | null = $state(null);
	const unsubscribe = selectedPatientStore.subscribe((p) => (patient = p));

	// reservation / patient form
	let patientName = $state('');
	let gender = $state<'male' | 'female' | ''>('');
	let phoneNumber = $state('');
	let address = $state('');
	let bloodType = $state('');
	let allergies = $state('');

	// record form fields (no bind:value — we update with on:input)
	let visitType = $state('');
	let complaints = $state('');
	let history = $state('');
	let physicalExam = $state('');
	let treatmentPlan = $state('');
	let diagnosis = $state('');
	let notes = $state('');
	let followUpDate: DateValue | undefined = $state(undefined);

	let bpSystolic = $state('');
	let bpDiastolic = $state('');
	let o2 = $state('');
	let hr = $state('');
	let tempC = $state('');

	let open = $state<boolean[]>([]);
	let value = $state<Medicine[]>([]);
	let triggerRef = $state<HTMLButtonElement[]>([]);
	function selectedValue(idx: number): string {
		return medicines.find((f) => f === value[idx])?.getName() || '';
	}
	function closeAndFocusTrigger(idx: number) {
		open[idx] = false;
		tick().then(() => {
			triggerRef[idx].focus();
		});
	}

	let medicalRecordId = $state<uuid | null>(null);

	// prescriptions (dynamic) — initially hidden until record saved
	type RxForm = {
		medicine: Medicine;
		dose: string;
		frequency: string;
		duration: string;
		quantity: string;
		instruction: string;
		price: string;
	};
	let prescriptions: RxForm[] = $state([]);

	// UI state
	let showPrescriptionSection = $state(false);
	let recordSaved = false;

	// helpers to update inputs (no bind:value)
	function setInputValue(setter: (v: string) => void, e: Event) {
		const v = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
		setter(v);
	}

	function updatePrescriptionField(index: number, field: keyof RxForm, e: Event) {
		const val = (e.target as HTMLInputElement).value;
		// reassign to trigger reactivity
		prescriptions = prescriptions.map((p, i) => (i === index ? { ...p, [field]: val } : p));
	}

	function updatePrescriptionMedicine(index: number, medicine: Medicine) {
		prescriptions = prescriptions.map((p, i) => (i === index ? { ...p, medicine } : p));
	}

	function addPrescription() {
		prescriptions = [
			...prescriptions,
			{
				medicine: null!,
				dose: '',
				frequency: '',
				duration: '',
				quantity: '',
				instruction: '',
				price: ''
			}
		];
		open = [...open, false];
		value = [...value, null!];
		triggerRef = [...triggerRef, null!];
	}

	function removePrescription(idx: number) {
		if (idx < 0 || idx >= prescriptions.length) return;
		if (prescriptions.length === 1) {
			prescriptions = [];
			open = [];
			value = [];
			triggerRef = [];
			return;
		}
		prescriptions = prescriptions.splice(idx, 1);
	}

	// Attempt to accept calendar change events in multiple shapes:
	function calendarChangeHandler(e: CustomEvent) {
		// many UI calendar components emit detail or detail.value
		const d = (e?.detail as any) ?? null;
		if (!d) {
			followUpDate = undefined;
			return;
		}
		// if calendar returns DateValue directly
		if (typeof (d as DateValue)?.toDate === 'function') {
			followUpDate = d as DateValue;
			return;
		}
		// if detail.value exists
		if ((d as any).value) {
			followUpDate = (d as any).value as DateValue;
			return;
		}
		// fallback: set to detail
		followUpDate = d as DateValue;
	}

	function isRecordComplete(): { ok: boolean; missing: string[] } {
		const missing: string[] = [];

		if (!visitType.trim()) missing.push('Visit Type');
		if (!complaints.trim()) missing.push('Primary Complaint');
		if (!history.trim()) missing.push('History');
		if (!physicalExam.trim()) missing.push('Physical Examination');
		if (!treatmentPlan.trim()) missing.push('Treatment Plan');
		if (!diagnosis.trim()) missing.push('Diagnosis');
		if (!notes.trim()) missing.push('Notes');
		if (!followUpDate) missing.push('Follow Up Date');

		// vitals
		if (!bpSystolic.trim()) missing.push('BP (systolic)');
		if (!bpDiastolic.trim()) missing.push('BP (diastolic)');
		if (!o2.trim()) missing.push('O₂');
		if (!hr.trim()) missing.push('HR');
		if (!tempC.trim()) missing.push('Temp');

		return { ok: missing.length === 0, missing };
	}

	// Save record — validate all fields, then reveal prescription section
	async function saveRecord() {
		if (!patient) {
			toast.error('No patient selected', {
				description: 'Please go back and select a patient first.',
				closeButton: true
			});
			return;
		}

		const { ok, missing } = isRecordComplete();
		if (!ok) {
			toast.error('Validation Error', {
				description: 'Please fill the following fields before saving:\n- ' + missing.join('\n- '),
				closeButton: true
			});
			return;
		}

		// Build vitals object
		const vitals = {
			'BP (mmHg)': `${bpSystolic}/${bpDiastolic}`,
			'O₂ (%)': parseInt(o2),
			'HR (bpm)': parseInt(hr),
			'Temp (°C)': parseFloat(tempC)
		};

		// Build payload (use patient.getId() — per your instruction)
		const payload = {
			patient_id: patient.getId(),
			doctor_id: user.getUserId(),
			department_id: null,
			visit_date: new Date().toISOString(),
			visit_type: visitType,
			complaints,
			history,
			physical_exam: physicalExam,
			vitals,
			procedures: '',
			treatment_plan: treatmentPlan,
			follow_up_date: followUpDate ? followUpDate.toDate(getLocalTimeZone()).toISOString() : null,
			diagnosis,
			notes
		};

		// POST to server endpoint
		const response = await fetch('/api/doctor/add-record', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			toast.error('Failed to save record. Please try again.', {
				description: 'Server responded with ' + response.status,
				closeButton: true
			});
			return;
		}

		const recordData = await response.json();
		medicalRecordId = recordData.medicalRecordId;

		// mark as saved and reveal prescriptions section
		recordSaved = true;
		showPrescriptionSection = true;

		// notify user
		toast.success('Record saved successfully', {
			description: 'Now you can add prescriptions.',
			closeButton: true
		});
	}

	// fixup for let:props
	type TriggerProps = HTMLButtonAttributes;

	// Save prescriptions — same class/size/color as Save Record
	async function savePrescriptions() {
		if (!patient) {
			toast.error('No patient selected', {
				description: 'Please go back and select a patient first.',
				closeButton: true
			});
			return;
		}

		if (prescriptions.length === 0) {
			toast.error('No prescriptions added', {
				description: 'Please add at least one medication before saving.',
				closeButton: true
			});
			return;
		}

		// Validate each prescription row has all fields filled
		const incompleteRows: number[] = [];
		prescriptions.forEach((p, idx) => {
			const required = [p.dose, p.frequency, p.duration, p.quantity, p.instruction];
			if (required.some((r) => !r || !String(r).trim())) incompleteRows.push(idx + 1);
		});

		if (incompleteRows.length) {
			toast.error('Incomplete prescription entries', {
				description:
					'Please complete all fields for the following prescription rows before saving: ' +
					incompleteRows.join(', '),
				closeButton: true
			});
			return;
		}

		// Build prescriptions payload
		const prescriptionItems: PrescriptionItemsRequest[] = prescriptions.map((r) => {
			return PrescriptionItemsRequest.fromJson({
				medicine_id: r.medicine.getId(),
				medicine_name: r.medicine.getName(),
				strength: r.medicine.getStrength(),
				form: r.medicine.getForm(),
				dosage: r.dose,
				frequency: r.frequency,
				duration: r.duration,
				quantity: r.quantity,
				instructions: r.instruction,
				subtotal_price: parseFloat(r.quantity) * r.medicine.getUnitPrice()
			});
		});

		const response = await fetch('/api/doctor/add-prescriptions', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				medical_record_id: medicalRecordId,
				doctor_id: user.getUserId(),
				notes: notes,
				medications: prescriptionItems.map((item) => ({
					medicine_id: item.getMedicineId(),
					medicine_name: item.getMedicineName(),
					strength: item.getStrength(),
					form: item.getForm(),
					dosage: item.getDosage(),
					frequency: item.getFrequency(),
					duration: item.getDuration(),
					quantity: item.getQuantity(),
					instructions: item.getInstructions(),
					subtotal_price: item.getSubtotalPrice()
				}))
			})
		});

		if (!response.ok) {
			toast.error('Failed to save prescriptions. Please try again.', {
				description: 'Server responded with ' + response.status,
				closeButton: true
			});
			return;
		}

		// TODO: send rxList along with patient id to backend
		console.log('Saving prescriptions for patient', patient.getId(), prescriptionItems);
		toast.success('Prescriptions saved successfully', {
			description: 'The prescriptions have been recorded.',
			closeButton: true
		});
		redirect(303, '/app/patients/doctor');
	}

	onMount(() => {
		// optional: initialize or focus
	});

	// cleanup
	onDestroy(() => unsubscribe());
</script>

<svelte:head>
	<title>Add Record — {patient?.getFullName ? patient.getFullName() : 'Patient'}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 p-6">
	{#if patient}
		<div class="mx-auto space-y-4">
			<!-- top bar: back + title -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<a
						href="/app/patients/admin"
						class="inline-block rounded-full border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
						>← Back</a
					>
					<h1 class="text-xl font-semibold">Add Patient</h1>
				</div>
			</div>

			<!-- RECORD FORM -->
			<!-- PATIENT RESERVATION BLOCK -->
			<div class="space-y-6 rounded-xl border bg-white p-6">
				<h3 class="text-lg font-semibold">Patient Reservation</h3>

				<!-- BASIC INFO -->
				<div class="grid grid-cols-3 gap-4">
					<!-- Patient Name -->
					<div>
						<label for="patientName" class="block pb-1 text-xs text-black">Patient Name</label>
						<input
							class="w-full rounded-md border px-3 py-2 text-xs"
							bind:value={patientName}
							placeholder="Full name"
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
						<select class="w-full rounded-md border px-3 py-2 text-xs" bind:value={bloodType}>
							<option value="">Select blood type</option>
							<option>A</option>
							<option>B</option>
							<option>AB</option>
							<option>O</option>
						</select>
					</div>
				</div>

				<!-- SECOND STACK -->
				<div class="grid grid-cols-3 gap-4">
					<!-- Gender -->
					<div>
						<label for="gender" class="block pb-1 text-xs text-black">Gender</label>
						<div class="flex gap-2">
							<button
								type="button"
								class="flex-1 rounded-full px-4 py-3 text-xs font-medium text-white transition"
								style="background-color:#1D69D1"
								class:opacity-100={gender === 'male'}
								class:opacity-50={gender !== 'male'}
								onclick={() => (gender = 'male')}
							>
								Male
								<Mars class="ml-1 inline-block" color="#ffffff" />
							</button>

							<button
								type="button"
								class="flex-1 rounded-full px-4 py-3 text-xs font-medium text-white transition"
								style="background-color:#DE51A7"
								class:opacity-100={gender === 'female'}
								class:opacity-50={gender !== 'female'}
								onclick={() => (gender = 'female')}
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
				</div>

				<!-- THIRD STACK -->
				<div>
					<label for="followUpDate" class="block pb-2 text-xs text-black">Follow Up Date</label>
					<Popover.Root>
						<Popover.Trigger class="w-full">
							<Button
								class={cn(
									'w-full justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-start text-xs font-normal text-black hover:bg-gray-50',
									!followUpDate && 'text-muted-foreground'
								)}
							>
								{followUpDate
									? df.format(followUpDate.toDate(getLocalTimeZone()))
									: 'Select a date'}
								<CalendarDays color="#1D69D1" />
							</Button>
						</Popover.Trigger>

						<Popover.Content class="w-auto p-0">
							<UiCalendar
								type="single"
								initialFocus
								captionLayout="dropdown"
								bind:value={followUpDate}
							/>
						</Popover.Content>
					</Popover.Root>
				</div>
			</div>
		</div>
		<div class="flex justify-end border-t pt-4">
			<Button
				class="rounded-full bg-[#1D69D1] px-6 py-3 text-sm text-white"
				onclick={() => {
					console.log('Reservation data', {
						patientName,
						gender,
						phoneNumber,
						address,
						bloodType,
						allergies
					});
					toast.success('Reservation saved');
				}}
			>
				Save Reservation
			</Button>
		</div>
	{/if}
</div>

<style>
	:global(.bg-\#1D69D1) {
		background-color: #1d69d1 !important;
	}
</style>
