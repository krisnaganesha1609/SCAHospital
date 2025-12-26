<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Patient, User } from '$lib/shared/entities';
	import { Button } from '$lib/components/ui/button';
	import { Calendar as UiCalendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
    import * as InputGroup from "$lib/components/ui/input-group";
	import { ArrowLeft, Clock } from '@lucide/svelte';
	import { type DateValue, CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { CalendarDays, CheckIcon, ChevronsUpDownIcon } from '@lucide/svelte';
	import { format } from 'date-fns';
	import { toast } from 'svelte-sonner';
	import { Input } from '$lib/components/ui/input';
	import { redirect } from '@sveltejs/kit';

	const df = new DateFormatter('en-US', { dateStyle: 'long' });

	let { data } = $props();
	const user = User.fromPOJO(data.profile);
	const patients: Patient[] = data.patients.map((p: any) => Patient.fromPOJO(p));
	const doctors: User[] = data.doctors.map((d: any) => User.fromPOJO(d));

	// reservation / patient form
	let reservationDate: DateValue | undefined = $state(undefined);
	let reservationTime: string = $state('Select time');
	let source: string = $state('');
	let notes = $state('');

	let openPatient = $state<boolean>(false);
	let valuePatient = $state<Patient | null>(null);
	let triggerRefPatient = $state<HTMLButtonElement | null>(null);
	function selectedValuePatient(): string {
		return patients.find((f) => f === valuePatient)?.getFullName() || '';
	}
	function closeAndFocusTriggerPatient() {
		openPatient = false;
		tick().then(() => {
			triggerRefPatient?.focus();
		});
	}

	let openDoctor = $state<boolean>(false);
	let valueDoctor = $state<User | null>(null);
	let triggerRefDoctor = $state<HTMLButtonElement | null>(null);
	function selectedValueDoctor(): string {
		return doctors.find((f) => f === valueDoctor)?.getFullName() || '';
	}
	function closeAndFocusTriggerDoctor() {
		openDoctor = false;
		tick().then(() => {
			triggerRefDoctor?.focus();
		});
	}

	function isRecordComplete(): { ok: boolean; missing: string[] } {
		const missing: string[] = [];

		if (!reservationTime) missing.push('Reservation Time');
		if (!notes.trim()) missing.push('Notes');

		return { ok: missing.length === 0, missing };
	}

	// Save record — validate all fields, then reveal prescription section
	async function saveRecord() {
		if (!valuePatient) {
			toast.error('No patient selected', {
				description: 'Please select a patient for this reservation.',
				closeButton: true
			});
			return;
		}

		if (!valueDoctor) {
			toast.error('No doctor selected', {
				description: 'Please select a doctor for this reservation.',
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

		// Build payload (use patient.getId() — per your instruction)
		const payload = {
			patientId: valuePatient.getId(),
			doctorId: valueDoctor.getUserId(),
			receptionistId: user.getUserId(),
			reservationTime: reservationDate
                ? format(new Date(reservationDate.toString()), 'yyyy-MM-dd') + ' ' + reservationTime
                : null,
			source: source,
			notes: notes
		};

		// POST to server endpoint
		const response = await fetch('/api/receptionist/add-reservation', {
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
		// notify user
		toast.success('Reservation saved successfully');
        redirect(303, '/app/reservations/admin');
	}

	onMount(() => {});
</script>

<svelte:head>
	<title>Add Reservation</title>
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
				<h1 class="text-lg leading-tight font-bold text-gray-900">Add Reservation</h1>
				<p class="font-mono text-[11px] text-gray-400">Add a user to the clinic system</p>
			</div>
		</div>

		<!-- RECORD FORM -->
		<!-- RESERVATION BLOCK -->
		<div class="space-y-6 rounded-xl border bg-white p-6">
			<h3 class="text-lg font-semibold">Reservation Data</h3>

			<!-- BASIC INFO -->
			<div class="grid grid-cols-3 gap-4">
				<!-- Patient Name -->
				<div class="mb-2">
					<label for="patientName" class="text-black0 text-xs">Patient Name</label>
					<Popover.Root bind:open={openPatient}>
						<Popover.Trigger bind:ref={triggerRefPatient} class="w-full">
							{#snippet child({ props })}
								<Button
									{...props}
									variant="outline"
									class="w-full justify-between"
									role="combobox"
									aria-expanded={openPatient}
								>
									{selectedValuePatient() || 'Select a patient...'}
									<ChevronsUpDownIcon class="opacity-50" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-full p-0">
							<Command.Root>
								<Command.Input placeholder="Search patient..." />
								<Command.List>
									<Command.Empty>No patients found.</Command.Empty>
									<Command.Group value="patients">
										{#each patients as patient (patient.getId())}
											<Command.Item
												value={patient.getFullName()}
												onSelect={() => {
													valuePatient = patient;
													closeAndFocusTriggerPatient();
												}}
											>
												<CheckIcon class={cn(valuePatient !== patient && 'text-transparent')} />
												{patient.getFullName()}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>

				<!-- Phone Number -->
				<div class="mb-2">
					<label for="doctorName" class="text-black0 text-xs">Doctor Name</label>
					<Popover.Root bind:open={openDoctor}>
						<Popover.Trigger bind:ref={triggerRefDoctor} class="w-full">
							{#snippet child({ props })}
								<Button
									{...props}
									variant="outline"
									class="w-full justify-between"
									role="combobox"
									aria-expanded={openDoctor}
								>
									{selectedValueDoctor() || 'Select a doctor...'}
									<ChevronsUpDownIcon class="opacity-50" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="w-full p-0">
							<Command.Root>
								<Command.Input placeholder="Search doctor..." />
								<Command.List>
									<Command.Empty>No doctors found.</Command.Empty>
									<Command.Group value="doctors">
										{#each doctors as doctor (doctor.getUserId())}
											<Command.Item
												value={doctor.getFullName()}
												onSelect={() => {
													valueDoctor = doctor;
													closeAndFocusTriggerDoctor();
												}}
											>
												<CheckIcon class={cn(valueDoctor !== doctor && 'text-transparent')} />
												{doctor.getFullName()}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.List>
							</Command.Root>
						</Popover.Content>
					</Popover.Root>
				</div>

				<div>
					<label for="reservationTime" class="block pb-2 text-xs text-black">Reservation Time</label
					>
					<div class="flex items-center gap-3">
						<Popover.Root>
							<Popover.Trigger class="w-full">
								<Button
									class={cn(
										'w-full justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-heading text-sm font-normal text-black hover:bg-gray-50',
										!reservationDate && 'text-muted-foreground'
									)}
								>
									{reservationDate
										? df.format(reservationDate.toDate(getLocalTimeZone()))
										: 'Select a date'}

									<CalendarDays color="#1D69D1" />
								</Button>
							</Popover.Trigger>

							<Popover.Content class="w-auto p-0">
								<UiCalendar
									type="single"
									initialFocus
									captionLayout="dropdown"
									minValue={new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate() + 1)}
									bind:value={reservationDate}
								/>
							</Popover.Content>
						</Popover.Root>
						<div class="flex gap-3">
                            <InputGroup.Root>

                                <InputGroup.Input
                                    type="time"
                                    step="60"
                                    id="reservationTime"
                                    bind:value={reservationTime}
                                    class="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none block w-full p-2.5 bg-neutral-secondary-medium border-t border-l border-b border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
                                />
                                <InputGroup.Addon align="inline-end">
                                    <Clock class="h-5 w-5" color="#1D69D1" />
                                </InputGroup.Addon>
                            </InputGroup.Root>
						</div>
					</div>
				</div>
			</div>

			<!-- SECOND STACK -->
			<div class="grid grid-cols-3 gap-4">
				<!-- Address -->
				<div>
					<label for="source" class="block pb-1 text-xs text-black">Source</label>
					<Input
						class="w-full rounded-md border px-3 py-2 text-xs"
						bind:value={source}
						placeholder="WhatsApp, Phone Call, In-Person, etc."
					/>
				</div>
				<div class="col-span-2">
					<label for="notes" class="block pb-1 text-xs text-black">Notes</label>
					<Input
						class="w-full rounded-md border px-3 py-2 text-xs"
						bind:value={notes}
						placeholder="Add notes (optional)"
					/>
				</div>
			</div>
		</div>
	</div>
	<div class="flex justify-end border-t pt-4">
		<Button
			class="rounded-full bg-[#1D69D1] px-6 py-6 text-sm text-white"
			onclick={() => {
				saveRecord();
			}}
		>
			Save Reservation
		</Button>
	</div>
</div>

<style>
	:global(.bg-\#1D69D1) {
		background-color: #1d69d1 !important;
	}
</style>
