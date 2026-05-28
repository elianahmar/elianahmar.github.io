<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import About from '$lib/components/About.svelte';
</script>

<svelte:head>
	<title>Elian Ahmar — Software Engineer</title>
	<meta name="description" content="Software Engineer at Walmart Global Tech specializing in reliability engineering, AI infrastructure, and backend systems." />
	<meta property="og:title" content="Elian Ahmar — Software Engineer" />
	<meta property="og:description" content="Software Engineer specializing in reliability engineering, AI infrastructure, and backend systems." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://elianahmar.github.io" />
</svelte:head>

<Hero />

<!-- Comment-style divider -->
<div class="max-w-4xl mx-auto px-6">
	<div class="h-px bg-[var(--color-border)]"></div>
</div>

<Projects />
<About />
