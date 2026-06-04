<script lang="ts">
	let { code, lang = 'go' }: { code: string; lang?: string } = $props();
</script>

<div class="code-block my-6">
	<div class="code-header">
		<span class="lang-label">{lang}</span>
	</div>
	<pre class="code-body"><code>{code}</code></pre>
</div>

<style>
	.code-block {
		border: 1px solid var(--color-border);
		border-radius: 8px;
		overflow: hidden;
		background-color: var(--color-bg-elevated);
	}

	.code-header {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		background-color: var(--color-bg-card);
		border-bottom: 1px solid var(--color-border);
	}

	.lang-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-secondary);
	}

	.code-body {
		overflow-x: auto;
		padding: 1.25rem 1.5rem;
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.7;
		color: var(--color-text-primary);
		tab-size: 4;
	}

	code {
		font-family: inherit;
		white-space: pre;
	}
</style>
