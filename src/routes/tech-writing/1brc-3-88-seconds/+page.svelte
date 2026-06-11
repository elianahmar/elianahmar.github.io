<script lang="ts">
	import CodeBlock from "$lib/components/CodeBlock.svelte";
	import Callout from "$lib/components/Callout.svelte";
	import { singlePassDigit } from "./code.js";

	let { data } = $props();
</script>

<svelte:head>
	<title>1BRC in 3.88 Seconds</title>
	<meta
		name="description"
		content="Solving the One Billion Row Challenge in 3.88 seconds using Go"
	/>
	<meta property="og:title" content="1BRC in 3.88 Seconds" />
	<meta
		property="og:description"
		content="A deep dive into solving the One Billion Row Challenge in 3.88 seconds with Go."
	/>
	<meta property="og:type" content="article" />
	<meta
		property="og:url"
		content="https://elianahmar.github.io/tech-writing/1brc-3-88-seconds"
	/>
</svelte:head>

<article class="max-w-3xl mx-auto px-6 py-24">
	<!-- Back link -->
	<a
		href="/tech-writing"
		class="inline-flex items-center gap-2 font-mono text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-accent-blue)] transition-colors mb-12"
	>
		<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 19l-7-7 7-7"
			/>
		</svg>
		tech-writing
	</a>

	<!-- Header -->
	<header class="mb-16">
		<p
			class="font-mono text-[var(--color-accent-blue)] text-xs uppercase tracking-widest mb-4"
		>
			Performance Engineering · Go
		</p>
		<h1
			class="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] mb-6 leading-tight"
		>
			1BRC in 3.88 Seconds<span class="text-[var(--color-accent-green)]">_</span
			>
		</h1>
		<p class="text-[var(--color-text-secondary)] font-mono text-sm">
			June 2026 · 15 min read
		</p>
	</header>

	<div class="prose-article">
		<!-- Intro -->
		<section class="mb-16">
			<h2>Introduction</h2>
			<p>
				When I think about my perfect day at work I imagine a day where it's
				just me, my terminal, and a really difficult problem. In particular,
				problems where I am optimizing latency on a complex pipeline,
				refactoring a tangled mess of a codebase, or exploring a new technical
				domain are the days where minutes turn to hours and I enter into a flow
				state. For that reason, when I had come across the 1BRC challenge I knew
				that this was a challenge that I could not pass up!
			</p>
		</section>

		<!-- Preamble -->
		<section class="mb-16">
			<h2>Preamble</h2>
			<p>
				For those who don't know about this challenge, the premise is fairly
				simple. You are given 1 billion rows of weather data. The data takes the
				following form:
			</p>

			<CodeBlock html={data.sampleData} />

			<p>
				For all of the cities you must compute the min, max, and average
				temperature for each city. For those who are interested, here is
				<a
					href="https://github.com/gunnarmorling/1brc"
					target="_blank"
					rel="noopener">the official repository for the challenge</a
				>
				. Two important constraints of this problem are the following:
			</p>
			<ul>
				<li>Only packages from the standard library are allowed</li>
				<li>
					Absolutely no LLM Code generation. I enjoy using AI tools and see
					their utility, but I just don't learn if I don't struggle myself!
				</li>
			</ul>
			<p>
				In some parts of the code you'll see methods that might be implemented
				in other packages. Please visit the
				<a
					href="https://github.com/elianahmar/1brc-personal"
					target="_blank"
					rel="noopener">repository of my original source code</a
				>. For this contest, I implemented and ran my solution on my MacBook Pro
				which has an M3 chip with 18GB of memory.
			</p>
		</section>

		<!-- Baseline -->
		<section class="mb-16">
			<h2>Baseline Implementation</h2>
			<p>
				To get started, I first needed to set up some boilerplate. I added pprof
				profiling for capturing heap and CPU dumps in addition to file writing
				which would tie the dump to the specific date and the implementation it
				came from. Then, I added command-line arg parsing so I could freely run
				multiple implementations. And lastly, I added validation logic for
				comparing my measurements against the solution.
			</p>
			<p>
				With the boilerplate out of the way, I then began my baseline
				implementation. In my initial implementation, I immediately made the
				mistake of trying to parallelize the code with a producer-consumer
				pattern where I would scan each line of the file in one goroutine and
				push the line to a channel to be consumed elsewhere.
			</p>
			<p>
				The runtime was <strong>509 seconds</strong>. Not the start I wanted,
				but I was satisfied to have a baseline to improve upon.
			</p>
			<CodeBlock html={data.p1} />
		</section>

		<!-- Wrong direction -->
		<section class="mb-16">
			<h2>Steps in the Wrong Direction: More Concurrency</h2>
			<p>
				After seeing my first result, I thought I could improve the runtime by
				chunk-reading the file and pushing each chunk to be processed. I could
				define beforehand how many bytes I want each chunk to have, read the
				whole file, and push chunks to channels to be consumed elsewhere.
				Unfortunately, this initial attempt failed for an important reason.
			</p>
			<p>
				Since each line has a varying number of bytes, there could be cases in
				which the boundaries of the byte chunks land somewhere in the middle of
				a line. I created a complicated solution to get around this, but long
				story short, my solution became significantly slower and more complex.
				This was the first real hurdle I had in the challenge.
			</p>
		</section>

		<!-- Sequential -->
		<section class="mb-16">
			<h2>Reset... Write Everything Sequentially</h2>
			<p>
				After some time trying to optimize a fundamentally flawed solution I had
				to take a step back. I decided to restart and completely rewrite the
				solution from scratch with one important caveat: the entire solution
				would run on the main thread. No concurrency, just plain line scanning,
				parsing, and map updates.
			</p>
			<p>
				And boom! I had my fastest solution yet. My new runtime came down to
				<strong>117 seconds</strong>. I was back on track!
			</p>
			<CodeBlock html={data.p4} />
			<Callout>
				The Go standard library offers a clean API for reading a file line by
				line. I used <code>bufio.Scanner </code>
				to scan every line and update a map. What's also nice about this API is that
				it uses a fixed size buffer under the hood which allowed me to tune and benchmark
				different buffer sizes.
			</Callout>
		</section>

		<!-- Unsafe -->
		<section class="mb-16">
			<h2>Optimizing the Sequential Implementation with Unsafe.String()</h2>
			<p>
				At this point, I had a solution that I knew I could improve upon. The
				first optimization I saw was the line parsing. I read through the
				implementation of <code>bytes.Cut</code> and noticed it contained extra computation
				that was not necessary for my solution. I also was not a fan of the fact
				that I was reading and copying data when updating my map. Instinctually,
				I knew I could do better.
			</p>
			<p>
				This brought me to Go's <code>unsafe.String</code>. The TL;DR is that
				this method provides zero-cost string conversions over byte arrays.
				Under the hood you are creating a string header that points to a memory
				location of a byte slice and defining its length. This is powerful
				because
				<code>string(byteSlice)</code>
				is an O(n) operation because it copies the bytes. With
				<code>unsafe</code> however, that cost becomes O(1). Using
				<code>unsafe</code> can be dangerous if the underlying byte array changes
				(which it does), but I knew I had a powerful tool here for reducing latency.
			</p>
			<p>
				The subtle but powerful trick was that I utilized <code>unsafe</code> to
				create a temporary string that would be used for the map lookup, and
				only create a copy when a novel city appears that was not present in the
				map. That trick brought my solution down to
				<strong>56 seconds</strong>!
			</p>
			<CodeBlock html={data.p5} />
			<Callout>
				You might be wondering, why do I need to copy the unsafe string in the
				case of an unseen city? The rationale behind this code is that the
				underlying byte array is being used for reading the file and it's
				contents can change. If I use the unsafe string as the key for the map,
				the underlying memory address for the key would become corrupted since
				the data in the buffer could change as we continue to read more bytes
				from the file.
			</Callout>
		</section>

		<!-- Int conversion -->
		<section class="mb-16">
			<h2>Manual Parsing of Lines + Int Conversion</h2>
			<p>
				At this point, things were getting a bit more involved. I was
				scrutinizing every line of code, reading through the source of every
				standard library function I was using, and pondering how I could write
				my own implementation that was finely tuned for my problem. Analysis of
				my code through that lense brought me to two next steps.
			</p>
			<p>
				The next two steps were: 1) manually parse each line and 2) cast the
				float values to integers, to enable faster arithmetic operations in
				addition to avoiding annoying rounding errors. This brought the runtime
				from 56 seconds to
				<strong>44 seconds</strong>.
			</p>
			<CodeBlock html={data.p9} />
			<Callout>
				I allocated the <code>numByte</code> array inside the function itself
				and clear it on each call with <code>numByte[:0]</code>. This keeps the
				memory on the stack rather than escaping to the heap. I learned this
				trick from performance-sensitive work at my day job. My Go LSP has an
				option to surface the compiler's escape analysis, which helped me catch
				this.
			</Callout>
		</section>

		<!-- Remove bytes.Cut -->
		<section class="mb-16">
			<h2>Remove bytes.Cut()</h2>
			<p>
				Now, in the previous section I mentioned that I was manually parsing the
				line. However, that was half true. The float-to-int conversion handled
				the temperature side, but I was still relying on <code>bytes.Cut()</code
				>
				to locate the
				<code>;</code> delimiter and split the city from the temperature. That was
				the next thing to go.
			</p>
			<p>
				Now, things were getting serious. If I want to make this code fast,
				every line of code - be it mine or from the standard library - must
				serve a purpose. So <code>bytes.Cut()</code> had to go. There was just
				too much extra computation happening in that method that I didn't need.
				Importantly, I knew and validated that every line maintains the
				following form:
				<code>&lt;city&gt;;&lt;temperature&gt;\n</code>.
			</p>
			<p>
				I could parse all of this myself, and doing so ensures I avoid the extra
				allocations and boundary checking that the method does under the hood. I
				wrote out the logic for parsing the whole line manually, bringing the
				runtime from 44 seconds to <strong>38 seconds</strong>.
			</p>
			<CodeBlock html={data.p11} />
		</section>

		<!-- Chunk reading -->
		<section class="mb-16">
			<h2>Revisiting Chunk File Reading</h2>
			<p>
				I was seriously scratching my head at this point. I knew better
				solutions existed and I had heard of people who solved the challenge in
				under 5 seconds. The pprof dumps were still showing syscalls consuming a
				majority of the latency, which made sense since I was still scanning
				each line one at a time. So I started to microbenchmark different ways
				of reading the file. The cpu profile made the bottleneck obvious:
			</p>
			<CodeBlock html={data.p4Dump} />
			<p>
				<code>fileScanner.Scan()</code> was consuming 98.66% of total runtime. Every
				line was a separate syscall, and that cost was dominating the runtime. A
				microbenchmark confirmed that chunked reading over the entire file took about
				three seconds. Which was nearly 10x faster than line-by-line scanning. Equipped
				with this evidence, my path forward was clear.
			</p>
			<p>
				Since my initial chunked reading attempt had failed, I'd brushed off the
				idea. But after revisiting it, I realized it was the only way to get a
				truly performant solution. If you remember earlier I had mentioned that
				the key issue with chunked file reading is that the boundary of the
				chunks could be landing in the middle of a line. However, after some
				more research into the docs I had discovered
				<code>bytes.LastIndexByte()</code> which completely resolved my issue. What
				I ended up doing is reading chunks of the files and tracking the last newline
				break using the API mentioned. From there, I now had a valid range which
				contained a starting index which would be the first character of a line and
				an end index which would always land on a newline. I would store these ranges
				in a list, and from that list I could concurrently read and process all of
				the data for each chunk of the data.
			</p>
			<p>
				Low and behold I had struck gold because those two modifications brought
				me from 38 seconds all the way to <strong>12 seconds</strong> - a 3x speedup!
			</p>
			<CodeBlock html={data.p13} />
			<Callout>
				Writing to a map is an extremely fast operation. However, having
				multiple go routines simultaneously writing to a map requires
				synchronization via a shared mutex. I instinctually knew that a mutex in
				this case would slow my program down. Instead of updating a single map
				across multiple go routines with mutex, I just created a new map for
				every go routine, and push the resulting map to a channel to be
				processed on the main thread. This worked flawlessly.
			</Callout>
		</section>

		<!-- Single pass -->
		<section class="mb-16">
			<h2>Single Pass Parsing + Concurrent Range Computations</h2>
			<p>
				I could have wrapped up here, but I knew I could do better. After
				reviewing my code and reading through the dumps I realized there were
				still three more opportunities for me to improve the performance:
			</p>
			<ol>
				<li>Parse the digits and construct a number in a single pass</li>
				<li>
					Correctly manage the byte pointer and ensure no out-of-bounds reads
				</li>
				<li>
					Properly synchronize the range producer and consumer, with the main
					thread aggregating results
				</li>
			</ol>

			<h3>Digit Parsing in One Pass</h3>
			<p>
				Here's the algorithm: create a temp variable equal to 0. Then, multiply
				the variable by 10 before adding each new digit. This builds up the
				integer left-to-right as you scan each byte, with zero intermediate
				allocations. The sign is checked separately and applied after the loop
				completes.
			</p>
			<CodeBlock html={data.singlePassDigit} />
			<CodeBlock html={data.digit} />

			<h3>Pointer Management</h3>
			<p>
				The key is to track a single <code>ptr</code> index over the raw buffer
				and advance it through each phase of the line - first to the
				<code>;</code> for the city, then up to the newline for the temperature.
				Checking <code>ptr &lt; n</code> before every inner access prevents
				out-of-bounds reads at the very end of the buffer. What's nice about the
				Go API for reading bytes is that
				<code>file.ReadAt()</code> will read the file at any given offset and give
				the number of bytes read from the offset. This helped me establish the bounds
				for my parsing loop.
			</p>
			<CodeBlock html={data.ptr} />
			<h3>Synchronization</h3>
			<p>
				In my final solution I utilize three buffered channels: <code
					>rChan</code
				>
				which stores the <code>Range</code> object so I know where to read and
				how much to read.
				<code>mChan</code> carries a map for a single processed range, and
				<code>rSig</code>
				is a boolean signal that coordinates closing <code>mChan</code> only
				after every goroutine for processing the ranges finishes. The
				<code>rSig</code>
				signals the main thread's
				<code>range mChan</code> to drain the channel and exit the loop after the
				channel is fully consumed.
			</p>
			<CodeBlock html={data.p17} />
		</section>

		<!-- What I didn't try -->
		<section class="mb-16">
			<h2>What I Didn't Try</h2>
			<p>A couple of optimizations I tabled for later:</p>
			<ul>
				<li>
					<strong>Hyperparameter tuning</strong> - tuning buffer sizes, goroutine
					counts, and other variables. My background in ML could help here.
				</li>
				<li>
					<strong>Custom map implementation</strong> - some solutions do this,
					but Go 1.24 introduced Swiss tables for the default map which is
					optimized for reads.
					<a
						href="https://go.dev/blog/swisstable"
						target="_blank"
						rel="noopener">Golang Blog</a
					>
				</li>
				<li>
					<strong><code>sync.Atomic</code></strong> - the fastest recorded Go
					solution I found (2.70s) heavily utilizes atomics.
					<a
						href="https://github.com/aytechnet/1brc"
						target="_blank"
						rel="noopener">Solution</a
					>
				</li>
			</ul>
		</section>

		<!-- Learnings -->
		<section class="mb-16">
			<h2>Learnings</h2>
			<p>
				This project taught me way more than I had anticipated. The biggest
				lessons from this project:
			</p>
			<ul>
				<li>
					<strong>Microbenchmark</strong>
					Don't assume things are fast or slow. Be scientific and microbenchmark,
					this would have helped me bypass some misteps I made in my earlier implementations.
					As I progressed through the challenge I became more familiar and comfortable
					using go's built-in framework for benchmarking.
				</li>
				<li>
					<strong>Concurrency != Fast</strong>
					Do the simple thing first. A simple sequential implementation first would
					have started me on the right path. This advice is a corollary to the idea
					that "premature optimization is the root of all evil". In my case, it was.
					My approach of adding complex concurrency in my initial implementations
					set me on a trajectory that required a great deal of thought to correct
					from later on.
				</li>
				<li>
					<strong
						>Check the Compiler Optimizations + PPROF (For Golang users)</strong
					>
					I'd highly recommend this talk:

					<a
						href="https://youtu.be/FwzE5Sdhhdw?si=qexWqVrz-2cl39jr"
						target="_blank"
						rel="noopener">Profile Guided Optimization</a
					>
					The content in this video lives in my head, rent-free. Understanding what
					memory lives on the stack versus the heap is super important to understand
					if you aim to write fast code. A lack of understanding would rear itself
					in this challenge, because ideally you want a solution that has a minimal
					memory footprint, so you want to keep as little data in memory as possible.
				</li>

				<li>
					<strong>BYOS (Bring Your Own Solution)</strong> Another concrete learning
					for me was that it's not a bad thing to write code tuned for the data if
					you have guarantees about the shape of the data. A large portion of optimizing
					the code was simply replacing the standard library implementation with
					my own.
				</li>
			</ul>
		</section>

		<!-- Conclusion -->
		<section class="mb-16">
			<h2>Conclusion</h2>
			<p>
				If you read this far, thank you. You might be wondering - what's the
				point? Why do all of this? In my day job, I write services that provide
				observability, and enable changes to hundreds of thousands of
				deployments across thousands of Kubernetes clusters. And I've built and
				optimized this service to such a degree that it runs entirely on a
				single pod.
			</p>
			<p>
				Suffice it to say, I deal with matters of performance every day, and
				it's something I genuinely love spending time on. Historically, the
				times I have learned the most as a engineer are typically when I'm
				debugging a really challenging bug or doing performance optimization
				like this. These problems require me to dig deep.
			</p>
			<p>
				Philosophically, I believe building performant systems is how you make
				the world a better place. In many cases, performance could mean life and
				death. For me it most certainly doesn't. But building software that is
				highly performant makes my users more efficient and happier, and that's
				enough for me!
			</p>
			<p>
				The final result: <strong>3.88 seconds on 1 billion rows of text</strong
				> on my MacBook Pro. This was easily one of the most fun projects I've ever
				done. It forced me to squeeze every last drop from my tools, scrutinize every
				line of code from the standard library, and devise crafty tricks to shave
				off every piece of unnecessary work. The feeling of seeing slow code become
				blazing fast is a victory that never gets old.
			</p>
		</section>
	</div>
</article>

<style>
	.prose-article {
		color: var(--color-text-secondary);
		line-height: 1.8;
		font-size: 1.0625rem;
	}

	.prose-article h2 {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin-top: 3rem;
		margin-bottom: 1rem;
	}

	.prose-article h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	.prose-article p {
		margin-bottom: 1.25rem;
	}

	.prose-article a {
		color: var(--color-accent-blue);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.prose-article a:hover {
		color: var(--color-accent-green);
	}

	.prose-article strong {
		color: var(--color-text-primary);
		font-weight: 600;
	}

	.prose-article em {
		color: var(--color-accent-purple);
		font-style: italic;
	}

	.prose-article code {
		font-family: var(--font-mono);
		font-size: 0.875em;
		background-color: var(--color-bg-elevated);
		color: var(--color-accent-green);
		padding: 0.15em 0.4em;
		border-radius: 4px;
		border: 1px solid var(--color-border);
	}

	.prose-article ol {
		list-style: decimal;
		padding-left: 1.5rem;
		margin-bottom: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.prose-article ul {
		list-style: disc;
		padding-left: 1.5rem;
		margin-bottom: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
