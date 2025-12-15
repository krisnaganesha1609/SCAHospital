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
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { CalendarDays, CheckIcon, ChevronsUpDownIcon } from '@lucide/svelte';
	import { format } from 'date-fns';
	import type { uuid } from '$lib/shared/types/type_def.js';
	import { toast } from 'svelte-sonner';

	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	let { data } = $props();
	const user = User.fromPOJO(data.profile);
	const medicines: Medicine[] = data.medicines.map((m: any) => Medicine.fromPOJO(m));

	// selected patient
	let patient: Patient | null = $state(null);
	const unsubscribe = selectedPatientStore.subscribe((p) => (patient = p));

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
			const required = [p.dose, p.frequency, p.duration, p.quantity, p.instruction, p.price];
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
		const prescriptionItems: PrescriptionItems[] = prescriptions.map((r) => {
			return PrescriptionItems.fromPOJO({
				id: null,
				prescription_id: null,
				medicine_id: r.medicine.getId(),
				medicine_name: r.medicine.getName(),
				strength: r.medicine.getStrength(),
				form: r.medicine.getForm(),
				dosage: r.dose,
				frequency: r.frequency,
				duration: r.duration,
				quantity: r.quantity,
				instructions: r.instruction,
				subtotal_price: parseFloat(r.quantity) * parseFloat(r.price),
				created_at: new Date().toISOString()
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
						href="/app/patients/doctor"
						class="inline-block rounded-full border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
						>← Back</a
					>
					<h1 class="text-xl font-semibold">Add Record — {patient.getFullName()}</h1>
				</div>
			</div>

			<!-- TOP: patient summary (non-clickable) -->
			<div class="rounded-xl border bg-white p-6">
				<div class="flex items-start justify-between">
					<div class="mt-2 space-y-1 text-sm text-gray-600">
						<div><strong>MR No:</strong> {patient.getMedicalRecordNumber()}</div>
						<div><strong>Phone:</strong> {patient.getPhone()}</div>
						<div>
							<strong>First Registered:</strong>
							{new Date(patient.getCreatedAt()).toLocaleDateString()}
						</div>
					</div>

					<div class="text-sm text-gray-700">
						<div><strong>Blood Type:</strong> {patient.getBloodType()}</div>
						<div class="mt-2"><strong>Allergies:</strong> {patient.getAllergies() || '-'}</div>
					</div>
				</div>
			</div>

			<!-- RECORD FORM -->
			<form onsubmit={saveRecord}>
				<div class="rounded-xl border bg-white p-6">
					<div class="grid grid-cols-4 gap-6">
						<!-- Left -->
						<div class="col-span-1 space-y-4">
							<h3 class="text-lg font-semibold">Visit - {format(new Date(), 'PP')}</h3>
							<div>
								<label for="visitType" class="block pb-2 text-xs text-black">Visit Type</label>
								<input
									class="w-full rounded-md border px-3 py-2 text-xs"
									value={visitType}
									oninput={(e) => (visitType = (e.target as HTMLInputElement).value)}
									placeholder="Visit Type"
								/>
							</div>
							<div>
								<label for="complaints" class="block pb-2 text-xs text-black"
									>Primary Complaint</label
								>
								<input
									class="w-full rounded-md border px-3 py-2 text-xs"
									value={complaints}
									oninput={(e) => (complaints = (e.target as HTMLInputElement).value)}
									placeholder="Describe complaints..."
								/>
							</div>

							<div>
								<label for="followUpDate" class="block pb-2 text-xs text-black"
									>Follow Up Date</label
								>
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

						<!-- Middle -->
						<div class="col-span-1 space-y-4">
							<div>
								<label for="history" class="block pb-2 text-xs text-black">History</label>
								<textarea
									class="w-full rounded-md border px-3 py-2"
									rows="3"
									value={history}
									oninput={(e) => (history = (e.target as HTMLTextAreaElement).value)}
									placeholder="Add history..."
								></textarea>
							</div>

							<div>
								<label for="physicalExam" class="block pb-2 text-xs text-black"
									>Physical Examination</label
								>
								<textarea
									class="w-full rounded-md border px-3 py-2"
									rows="3"
									value={physicalExam}
									oninput={(e) => (physicalExam = (e.target as HTMLTextAreaElement).value)}
									placeholder="Add physical examination..."
								></textarea>
							</div>
						</div>

						<!-- Right -->
						<div class="col-span-1 space-y-4">
							<div>
								<label for="daignosis" class="block pb-2 text-xs text-black">Diagnosis</label>
								<textarea
									class="w-full rounded-md border px-3 py-2"
									rows="3"
									value={diagnosis}
									oninput={(e) => (diagnosis = (e.target as HTMLTextAreaElement).value)}
									placeholder="Add diagnosis..."
								></textarea>
							</div>
							<div>
								<label for="treatmentPlan" class="block pb-2 text-xs text-black"
									>Treatment Plan</label
								>
								<textarea
									class="w-full rounded-md border px-3 py-2"
									rows="3"
									value={treatmentPlan}
									oninput={(e) => (treatmentPlan = (e.target as HTMLTextAreaElement).value)}
									placeholder="Add treatment plan..."
								></textarea>
							</div>
						</div>
						<div class="col-span-1 p-3">
							<div class="mb-2 text-sm font-semibold text-slate-600">Vitals</div>
							<div class="grid grid-cols-1 gap-5 text-sm">
								<div class="flex items-center gap-4">
									<label for="bpSystolic" class="text-md font-bold text-[#1D69D1]">BP</label>
									<div class="flex items-center gap-2">
										<input
											class="w-12 rounded-md border px-2 py-2 text-center"
											value={bpSystolic}
											oninput={(e) => (bpSystolic = (e.target as HTMLInputElement).value)}
											placeholder="120"
										/>
										<span>/</span>
										<input
											class="w-12 rounded-md border px-2 py-2 text-center"
											value={bpDiastolic}
											oninput={(e) => (bpDiastolic = (e.target as HTMLInputElement).value)}
											placeholder="80"
										/>
										<span>mmHg</span>
									</div>
								</div>

								<div class="flex items-center gap-4">
									<label for="o2" class="text-md font-bold text-[#1D69D1]">O₂</label>
									<div class="flex items-center gap-2">
										<input
											class="w-12 rounded-md border px-2 py-2 text-center"
											value={o2}
											oninput={(e) => (o2 = (e.target as HTMLInputElement).value)}
											placeholder="98"
										/>
										<span>%</span>
									</div>
								</div>

								<div class="flex items-center gap-4">
									<label for="hr" class="text-md font-bold text-[#1D69D1]">HR</label>
									<div class="flex items-center gap-2">
										<input
											class="w-12 rounded-md border px-2 py-2 text-center"
											value={hr}
											oninput={(e) => (hr = (e.target as HTMLInputElement).value)}
											placeholder="72"
										/>
										<span>bpm</span>
									</div>
								</div>

								<div class="flex items-center gap-4">
									<label for="tempC" class="text-md font-bold text-[#1D69D1]">Temp</label>
									<div class="flex items-center gap-2">
										<input
											class="w-14 rounded-md border px-2 py-2 text-center"
											value={tempC}
											oninput={(e) => (tempC = (e.target as HTMLInputElement).value)}
											placeholder="36.6"
										/>
										<span>°C</span>
									</div>
								</div>
							</div>
						</div>
						<div class="col-start-2 col-end-5">
							<label for="notes" class="block text-xs text-black">Notes</label>
							<textarea
								class=" my-2 w-full rounded-md border px-3 py-2"
								rows="1"
								value={notes}
								oninput={(e) => (notes = (e.target as HTMLTextAreaElement).value)}
							></textarea>
						</div>
					</div>

					<!-- Save Record button (right) -->
					<div class="mt-6 flex items-center justify-between">
						<div></div>
						<div>
							<Button class="rounded-full bg-[#1D69D1] px-6 py-3 text-sm text-white" type="submit">
								Save Record
							</Button>
						</div>
					</div>
				</div>
			</form>
			<!-- PRESCRIPTIONS: hidden until record saved -->
			{#if showPrescriptionSection}
				<div class="mx-auto h-20 w-10 border-l-8 border-dashed border-gray-300"></div>
				<div class="rounded-xl border bg-white p-6">
					<div class="mb-4 flex items-center justify-between">
						<h3 class="text-lg font-semibold">Prescriptions</h3>
						<div class="flex gap-2">
							<button
								class="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
								onclick={addPrescription}
							>
								+ Add Medication
							</button>
						</div>
					</div>

					{#if prescriptions.length === 0}
						<div class="p-6 text-sm text-slate-500">
							No medications added yet. Click “+ Add Medication”.
						</div>
					{/if}

					{#each prescriptions as rx, idx (idx)}
						<div class="mb-4 space-y-2 rounded-lg border bg-white p-4">
							<div class="mb-2">
								<label for="rx.medicinename" class="text-black0 text-xs">Medicine Name</label>
								<Popover.Root bind:open={open[idx]}>
									<Popover.Trigger bind:ref={triggerRef[idx]} class="w-full">
										{#snippet child({ props })}
											<Button
												{...props}
												variant="outline"
												class="w-full justify-between"
												role="combobox"
												aria-expanded={open[idx]}
											>
												{selectedValue(idx) || 'Select a medicine...'}
												<ChevronsUpDownIcon class="opacity-50" />
											</Button>
										{/snippet}
									</Popover.Trigger>
									<Popover.Content class="w-full p-0">
										<Command.Root>
											<Command.Input placeholder="Search medicine..." />
											<Command.List>
												<Command.Empty>No medicines found.</Command.Empty>
												<Command.Group value="medicines">
													{#each medicines as medicine (medicine.getId())}
														<Command.Item
															value={medicine.getName()}
															onSelect={() => {
																value[idx] = medicine;
																closeAndFocusTrigger(idx);
																updatePrescriptionMedicine(idx, medicine);
																console.log('Selected medicine for row', idx, medicine);
															}}
														>
															<CheckIcon
																class={cn(value[idx] !== medicine && 'text-transparent')}
															/>
															{medicine.getName()}
														</Command.Item>
													{/each}
												</Command.Group>
											</Command.List>
										</Command.Root>
									</Popover.Content>
								</Popover.Root>
							</div>
							{#if rx.medicine !== null && rx.medicine !== undefined}
								<div class="grid grid-cols-3 gap-4">
									<div>
										<label for="rx.strength" class="text-xs text-black">Strength</label>
										<input
											class="w-full rounded-md border px-3 py-2"
											value={rx.medicine === null ? '' : rx.medicine.getStrength()}
											readonly
										/>
									</div>
									<div>
										<label for="rx.form" class="text-xs text-black">Form</label>
										<input
											class="w-full rounded-md border px-3 py-2"
											value={rx.medicine === null ? '' : rx.medicine.getForm()}
											readonly
										/>
									</div>
									<div>
										<label for="rx.price" class="text-xs text-black">Unit Price</label>
										<input
											class="w-full rounded-md border px-3 py-2"
											value={rx.medicine === null ? 0 : `Rp${rx.medicine.getUnitPrice()}`}
											readonly
										/>
									</div>
									<div>
										<label for="rx.dose" class="text-xs text-black">Dose</label>
										<input
											class="w-full rounded-md border px-3 py-2"
											value={rx.dose}
											oninput={(e) => updatePrescriptionField(idx, 'dose', e)}
											placeholder="e.g., 1 tablet"
										/>
									</div>
									<div>
										<label for="rx.frequency" class="text-xs text-black">Frequency</label>
										<input
											class="w-full rounded-md border px-3 py-2"
											value={rx.frequency}
											oninput={(e) => updatePrescriptionField(idx, 'frequency', e)}
											placeholder="e.g., 3 x daily"
										/>
									</div>
									<div>
										<label for="rx.duration" class="text-xs text-black">Duration</label>
										<input
											class="w-full rounded-md border px-3 py-2"
											value={rx.duration}
											oninput={(e) => updatePrescriptionField(idx, 'duration', e)}
											placeholder="e.g., 7 days"
										/>
									</div>
									<div>
										<label for="rx.quantity" class="text-xs text-black">Quantity</label>
										<input
											class="w-full rounded-md border px-3 py-2"
											value={rx.quantity}
											oninput={(e) => updatePrescriptionField(idx, 'quantity', e)}
											placeholder="e.g., 21"
										/>
									</div>
									<div class="col-span-2">
										<label for="rx.instruction" class="text-xs text-black">Instruction</label>
										<input
											class="w-full rounded-md border px-3 py-2"
											value={rx.instruction}
											oninput={(e) => updatePrescriptionField(idx, 'instruction', e)}
											placeholder="e.g., After meals"
										/>
									</div>
								</div>
							{/if}
							<div class="flex justify-end">
								<button
									class="mt-4 rounded-md bg-red-500 px-3 py-2 text-sm text-white"
									onclick={() => removePrescription(idx)}
								>
									Remove
								</button>
							</div>
						</div>
					{/each}

					<!-- Save Prescriptions button (same size/style as Save Record) -->
					<div class="mt-4 flex justify-end">
						<Button
							class="rounded-full bg-[#1D69D1] px-6 py-3 text-sm text-white"
							onclick={savePrescriptions}
						>
							Save Prescription
						</Button>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<div class="mx-auto max-w-4xl p-6 text-center text-gray-600">
			No patient selected — please go back and select a patient first.
		</div>
	{/if}
</div>

<style>
	:global(.bg-\#1D69D1) {
		background-color: #1d69d1 !important;
	}
</style>
