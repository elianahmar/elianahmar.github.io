<script lang="ts">
	let { html }: { html: string } = $props();
</script>

<div class="code-block my-6">
	{@html html}
</div>

<style>
	.code-block {
		border: 1px solid var(--color-border);
		border-radius: 8px;
		overflow: hidden;
	}

	.code-block :global(pre.shiki) {
		overflow-x: auto;
		padding: 1.25rem 1.5rem;
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.7;
		border-radius: 0;
		background-color: #0d1117 !important; /* match site bg-primary */
	}

	.code-block :global(pre.shiki code) {
		font-family: inherit;
		background: none;
		padding: 0;
		border: none;
		border-radius: 0;
		font-size: inherit;
		color: inherit;
	}

	/* Subtle top bar showing it's a code block */
	.code-block :global(pre.shiki::before) {
		content: '';
		display: block;
		height: 3px;
		background: linear-gradient(
			90deg,
			var(--color-accent-blue),
			var(--color-accent-green)
		);
		margin: -1.25rem -1.5rem 1.25rem;
	}
</style>
