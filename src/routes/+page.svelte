<script lang="ts">
	import heroonepicture from '$lib/assets/hero-bg.png';
	import herotwopicture from '$lib/assets/hero-bg-2.png';
	import dokutah from '$lib/assets/doctor.png';
	import boxblue from '$lib/assets/box-blue.png';
	import boxred from '$lib/assets/box-red.png';
	import boxwhitewhite from '$lib/assets/box-white-white.png';
</script>

<div class="flex w-full flex-col">

	<!-- HERO 1 -->
	<section
		class="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat text-white"
		style="background-image: url({heroonepicture});"
	>
		<!-- GRADIENT -->
		<div class="absolute inset-0 bg-gradient-to-b from-[#3F3F3F] to-white/10"></div>

		<!-- TEXT -->
		<div class="relative container px-4 text-center">
			<h1
				class="mb-4 scroll-m-20 text-4xl tracking-tight text-balance text-white sm:text-5xl md:text-6xl lg:text-7xl"
			>
				Together, We Care for Life.
			</h1>

			<p class="animate__animated animate__fadeInUp animate__delay-1s mb-8 text-lg text-white">
				A place where compassion meets innovation.
			</p>

			<a
				href="#get-started"
				class="inline-block rounded-[40px] bg-[#1D69D1] px-6 py-3 text-white transition hover:bg-blue-700"
			>
				Discover Our Values.
			</a>
		</div>
	</section>

	<!-- HERO 2 -->
	<section
		class="relative flex h-[340px] w-full items-center justify-center overflow-hidden text-white"
	>
		<!-- IMAGE RIGHT SIDE -->
		<div
			class="absolute top-0 right-0 h-full w-[45%] bg-cover bg-right"
			style="background-image: url({herotwopicture});"
		></div>

		<!-- BLACC GRADIENT -->
		<div
			class="absolute inset-0"
			style="background: linear-gradient(to right,
			rgba(0,0,0,0.99) 0%,
			rgba(0,0,0,0.99) 60%,
			rgba(0,0,0,0.95) 70%,
			rgba(0,0,0,0.90) 80%,
			rgba(0,0,0,0.85) 90%,
			rgba(0,0,0,0.80) 100%
			);"
		></div>
		<div class="[removed] absolute inset-0"></div>

		<!-- TEXT -->
		<div class="relative z-10 max-w-2xl px-4 text-center">
			<h2 class="text-3xl font-semibold">Beyond medicine.</h2>
			<p class="mt-2">
				We heal with empathy, driven by science.<br />
				Every day, we strive to make care more human.
			</p>
		</div>
	</section>

	<!-- COMMITMENT TITLE -->
	<section class="py-16 text-center">
		<h2 class="text-3xl font-bold">Our Commitment</h2>
	</section>

	<!-- COMMITMENT GRID -->
	<section class="mx-auto grid max-w-6xl gap-6 bg-white px-6 pb-24 sm:grid-cols-2">
		<!-- CARD 1 -->
		<div
			class="relative flex h-[240px] flex-col items-center justify-center overflow-hidden rounded p-8 text-center text-white shadow"
			style="background-image: url({boxblue}); background-size: cover; background-position: center;"
		>
			<div
				class="absolute inset-0 bg-gradient-to-b from-blue-700/90 via-blue-700/60 to-transparent"
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
			class="relative flex h-[240px] flex-col items-center justify-center overflow-hidden rounded p-8 text-center text-gray-900 shadow"
			style="background-image: url({boxwhitewhite}); background-size: cover; background-position: center;"
		>
			<div
				class="absolute inset-0 bg-gradient-to-b from-white/95 via-white/70 to-transparent"
			></div>
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
			class="relative flex h-[240px] flex-col items-center justify-center overflow-hidden rounded p-8 text-center text-gray-900 shadow"
			style="background-image: url({boxwhitewhite}); background-size: cover; background-position: center;"
		>
			<div
				class="absolute inset-0 bg-gradient-to-b from-white/95 via-white/70 to-transparent"
			></div>
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
			class="relative flex h-[240px] flex-col items-center justify-center overflow-hidden rounded p-8 text-center text-white shadow"
			style="background-image: url({boxred}); background-size: cover; background-position: center;"
		>
			<div
				class="absolute inset-0 bg-gradient-to-b from-pink-600/90 via-pink-600/60 to-transparent"
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

	<!-- DOCTOR SECTION -->
	<section class="bg-white py-20 text-black">
		<div class="container mx-auto max-w-6xl px-6">
			<div class="grid grid-cols-1 items-center gap-8 md:grid-cols-2">

				<!-- LEFT -->
				<div class="order-1 md:order-1">
					<h2 class="mb-4 text-3xl font-semibold">Every story reminds us why we care.</h2>
					<p class="max-w-xl text-gray-700">
						From small recoveries to great miracles, we are part of every heartbeat. Our team
						combines medical expertise with human empathy to offer care that heals both body and
						spirit.
					</p>
				</div>

				<!-- RIGHT -->
				<div class="order-2 flex justify-center md:order-2 md:justify-end">
					<div
						class="h-[420px] w-full rounded-xl bg-cover bg-center shadow-lg md:w-[420px]"
						style="background-image: url({dokutah});"
						role="img"
						aria-label="Doctor image"
					></div>
				</div>
			</div>
		</div>
	</section>
</div>
