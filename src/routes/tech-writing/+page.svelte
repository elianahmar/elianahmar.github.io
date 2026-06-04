<svelte:head>
	<title>Elian Ahmar — Tech Writing</title>
	<meta name="description" content="Technical writing, articles, and deep dives by Elian Ahmar." />
	<meta property="og:title" content="Elian Ahmar — Tech Writing" />
	<meta property="og:description" content="Technical writing, articles, and deep dives by Elian Ahmar." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://elianahmar.github.io/tech-writing" />
</svelte:head>

<section class="max-w-3xl mx-auto px-6 py-24">
	<header class="mb-16">
		<p class="font-mono text-[var(--color-accent-blue)] text-xs uppercase tracking-widest mb-4">
			Articles & Deep Dives
		</p>
		<h1 class="text-4xl font-bold text-[var(--color-text-primary)]">
			Tech Writing<span class="text-[var(--color-accent-green)]">_</span>
		</h1>
	</header>

	<div class="flex flex-col gap-4">
		{#each articles as article}
			<a
				href={article.href}
				class="group block p-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-card)] transition-all duration-200"
			>
				<div class="flex items-start justify-between gap-4">
					<div>
						<p class="font-mono text-[var(--color-accent-blue)] text-xs uppercase tracking-widest mb-2">
							{article.tags.join(' · ')}
						</p>
						<h2 class="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-blue)] transition-colors mb-2">
							{article.title}
						</h2>
						<p class="text-[var(--color-text-secondary)] text-sm leading-relaxed">
							{article.description}
						</p>
					</div>
					<svg class="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-blue)] flex-shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</div>
				<p class="font-mono text-[var(--color-text-secondary)] text-xs mt-4">{article.date} · {article.readTime}</p>
			</a>
		{/each}
	</div>
</section>

<script lang="ts">
	const articles = [
		{
			title: '1BRC in 3.88 Seconds',
			description:
				'How I solved the One Billion Row Challenge in 3.88 seconds using Go — a deep dive into file chunking, unsafe string tricks, single-pass parsing, and concurrent goroutine synchronization.',
			href: '/tech-writing/1brc-3-88-seconds',
			tags: ['Performance Engineering', 'Go'],
			date: 'June 2026',
			readTime: '15 min read'
		}
	];
</script>
