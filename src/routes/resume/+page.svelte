<script lang="ts">
	import Experience from '$lib/components/Experience.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import Awards from '$lib/components/Awards.svelte';
</script>

<svelte:head>
	<title>Elian Ahmar — Resume</title>
	<meta name="description" content="Experience, skills, and recognition — Elian Ahmar, Software Engineer at Walmart Global Tech." />
	<meta property="og:title" content="Elian Ahmar — Resume" />
	<meta property="og:description" content="Experience, skills, and recognition — Software Engineer at Walmart Global Tech." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://elianahmar.github.io/resume" />
</svelte:head>

<Experience />
<Skills />
<Awards />
