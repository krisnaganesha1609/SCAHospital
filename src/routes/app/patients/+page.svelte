<script lang="ts">
	import logo from '$lib/assets/logo.svg';
	import type { PageProps } from './$types';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as InputGroup from '$lib/components/ui/input-group';
	import * as Item from '$lib/components/ui/item';
	import { SearchIcon } from '@lucide/svelte';
	import { Patient } from '$lib/shared/entities';

	let { data }: PageProps = $props();
	let patients = data.patients.map((p) => Patient.fromPOJO(p));
</script>

<div class="min-h-screen w-full bg-[#F5F5F5]">
	<NavigationMenu.Root
		class="sticky top-0 flex h-16 w-full max-w-full items-center justify-end bg-white px-4 text-center text-black shadow-md"
	>
		<NavigationMenu.List>
			<NavigationMenu.Item class="mr-[calc(100vw-1200px)] w-1/2">
				<NavigationMenu.Link class=" cursor-pointer">
					<div class="h-[54px] w-[170px]">
						<img src={logo} alt="Logo" />
					</div>
				</NavigationMenu.Link>
			</NavigationMenu.Item>
			<NavigationMenu.Item class="">
				<InputGroup.Root class="w-72 rounded-[50px]">
					<InputGroup.Input placeholder="Find name, medical record..."></InputGroup.Input>
					<InputGroup.Addon align="inline-end" class="rounded-[50px] bg-white">
						<SearchIcon color="#1D69D1" />
					</InputGroup.Addon>
				</InputGroup.Root>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
	<div class="min-h-[calc(100vh-64px)] p-4">
		<Item.Group>
			{#each patients as patient}
				<Item.Root class="mb-4 border border-gray-300 bg-white p-4 shadow-sm hover:shadow-md">
					<Item.Content class="flex flex-col gap-1">
						<div class="">
							<Item.Title
								>{patient.getFullName()} {patient.getGender() == 'Male' ? '♂' : '♀'}</Item.Title
							>
							<Item.Description
								>Medical Record No.<br /> {patient.getMedicalRecordNumber()}</Item.Description
							>
						</div>
					</Item.Content>
				</Item.Root>
			{/each}
		</Item.Group>
	</div>
</div>
