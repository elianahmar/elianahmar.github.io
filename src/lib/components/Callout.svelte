<script lang="ts">
	let { children }: { children: import('svelte').Snippet } = $props();
</script>

<aside class="callout my-6">
	<span class="callout-icon">💡</span>
	<p class="callout-text">{@render children()}</p>
</aside>

<style>
	.callout {
		display: flex;
		gap: 0.875rem;
		align-items: flex-start;
		background-color: color-mix(in srgb, var(--color-accent-blue) 8%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-accent-blue) 30%, transparent);
		border-radius: 8px;
		padding: 1rem 1.25rem;
	}

	.callout-icon {
		font-size: 1rem;
		flex-shrink: 0;
		margin-top: 0.1rem;
	}

	.callout-text {
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--color-text-secondary);
		margin: 0;
	}

	.callout-text :global(code) {
		font-family: var(--font-mono);
		font-size: 0.875em;
		background-color: var(--color-bg-elevated);
		color: var(--color-accent-green);
		padding: 0.15em 0.4em;
		border-radius: 4px;
		border: 1px solid var(--color-border);
	}
</style>
