<script lang="ts">
	import boxblue from '$lib/assets/box-blue.png';
	import boxred from '$lib/assets/box-red.png';
	import boxwhitewhite from '$lib/assets/box-white-white.png';
	let { data } = $props();
	let { user } = $derived(data);
</script>

<div class="flex w-full flex-col">
	<!-- HEADER TITLE -->
	<section class="py-16 text-center">
		<p class="text-4xl font-bold">Hi, {user?.email}</p>
		<h2 class="text-6xl font-bold">Remember Our Commitment</h2>
	</section>

	<!-- COMMITMENT GRID -->
	<section class="mx-auto grid max-w-6xl gap-6 bg-white px-6 pb-24 sm:grid-cols-2">
		<!-- CARD 1 -->
		<div
			class="relative flex h-60 flex-col items-center justify-center overflow-hidden rounded p-8 text-center text-white shadow"
			style="background-image: url({boxblue}); background-size: cover; background-position: center;"
		>
			<div
				class="absolute inset-0 bg-linear-to-b from-blue-700/90 via-blue-700/60 to-transparent"
			></div>
			<div class="relative z-10">
				<h3 class="text-xl font-semibold">Excellence in Care</h3>
				<p class="mt-3 text-sm opacity-95">
					Precision guided by compassion.<br />
					Every treatment is a promise to do better.
				</p>
			</div>
		</div>

		<!-- CARD 2 -->
		<div
			class="relative flex h-60 flex-col items-center justify-center overflow-hidden rounded p-8 text-center text-gray-900 shadow"
			style="background-image: url({boxwhitewhite}); background-size: cover; background-position: center;"
		>
			<div class="absolute inset-0 bg-linear-to-b from-white/95 via-white/70 to-transparent"></div>
			<div class="relative z-10">
				<h3 class="text-xl font-semibold">Innovation for Healing</h3>
				<p class="mt-3 text-sm opacity-90">
					Technology with a human heart.<br />
					Advancing care for every generation.
				</p>
			</div>
		</div>

		<!-- CARD 3 -->
		<div
			class="relative flex h-60 flex-col items-center justify-center overflow-hidden rounded p-8 text-center text-gray-900 shadow"
			style="background-image: url({boxwhitewhite}); background-size: cover; background-position: center;"
		>
			<div class="absolute inset-0 bg-linear-to-b from-white/95 via-white/70 to-transparent"></div>
			<div class="relative z-10">
				<h3 class="text-xl font-semibold">Integrity in Every Step</h3>
				<p class="mt-3 text-sm opacity-90">
					Trust begins with honesty.<br />
					We act with purpose and transparency.
				</p>
			</div>
		</div>

		<!-- CARD 4 -->
		<div
			class="relative flex h-60 flex-col items-center justify-center overflow-hidden rounded p-8 text-center text-white shadow"
			style="background-image: url({boxred}); background-size: cover; background-position: center;"
		>
			<div
				class="absolute inset-0 bg-linear-to-b from-pink-600/90 via-pink-600/60 to-transparent"
			></div>
			<div class="relative z-10">
				<h3 class="text-xl font-semibold">Human-Centered Experience</h3>
				<p class="mt-3 text-sm opacity-95">
					Care designed around you.<br />
					Every interaction, simple, warm, and deeply personal.
				</p>
			</div>
		</div>
	</section>
</div>
