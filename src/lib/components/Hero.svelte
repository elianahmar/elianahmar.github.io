<script lang="ts">
	import { personal } from '$lib/data/personal';
	import { onMount } from 'svelte';

	let loaded = $state(false);

	onMount(() => {
		setTimeout(() => (loaded = true), 100);
	});
</script>

<section id="home" class="min-h-screen flex items-center justify-center relative overflow-hidden">
	<!-- Subtle dot grid background -->
	<div class="absolute inset-0 dot-grid opacity-30"></div>

	<div class="relative z-10 text-center px-6 max-w-3xl">
		<!-- Name -->
		<h1
			class="text-5xl md:text-7xl font-bold tracking-tight transition-all duration-700 {loaded
				? 'opacity-100 translate-y-0'
				: 'opacity-0 translate-y-8'}"
		>
			{personal.name}<span class="cursor-blink text-[var(--color-accent-green)]">_</span>
		</h1>

		<!-- Title -->
		<p
			class="mt-6 font-mono text-[var(--color-accent-blue)] text-base md:text-lg transition-all duration-700 delay-200 {loaded
				? 'opacity-100 translate-y-0'
				: 'opacity-0 translate-y-8'}"
		>
			{personal.title}
		</p>

		<!-- Subtitle -->
		<p
			class="mt-3 text-[var(--color-text-secondary)] text-sm md:text-base font-mono transition-all duration-700 delay-400 {loaded
				? 'opacity-100 translate-y-0'
				: 'opacity-0 translate-y-8'}"
		>
			{personal.subtitle}
		</p>

		<!-- Scroll indicator -->
		<div
			class="mt-16 transition-all duration-700 delay-[600ms] {loaded
				? 'opacity-100 translate-y-0'
				: 'opacity-0 translate-y-8'}"
		>
			<a href="#projects" class="inline-block text-[var(--color-text-secondary)] hover:text-[var(--color-accent-blue)] transition-colors" aria-label="Scroll to projects">
				<svg class="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
				</svg>
			</a>
		</div>
	</div>
</section>
