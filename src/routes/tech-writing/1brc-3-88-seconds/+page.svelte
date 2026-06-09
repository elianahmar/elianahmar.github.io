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
				When I think about my absolute perfect day at work I imagine a day where
				it's just me, my terminal, and a really difficult challenge to solve. In
				particular, problems where I am optimizing latency on a complex
				pipeline, refactoring a tangled mess of a codebase, or exploring a new
				technical domain are the days where minutes turn to hours and I enter
				into a flow state. For that reason, when had I come across the 1BRC
				challenge I knew that this was a challenge that I could not pass up!
			</p>
			<p>
				Although I'm fashionably late to this party, I couldn't wait to roll up
				my sleeves and take a crack at a problem that other talented developers
				had tried and see how I stack up against the rest!
			</p>
		</section>

		<!-- Preamble -->
		<section class="mb-16">
			<h2>Preamble</h2>
			<p>
				For those who don't know about this challenge, the premise is fairly
				simple. You are given 1 billion rows of weather data. The data takes the
				following form:

				<CodeBlock html={data.sampleData} />

				For all of the cities you must compute the min, max, and average
				temperature for each city.
				<a
					href="https://github.com/gunnarmorling/1brc"
					target="_blank"
					rel="noopener">Here</a
				>
				is the link to the site explaining the challenge. The problem has many rules
				but the ones worth mentioning:
			</p>
			<ul>
				<li>Only packages from the Go standard library may be used</li>
				<li>
					Absolutely no LLM Code generation. I use AI tools, but I just don't
					learn if I don't struggle myself!
				</li>
			</ul>
			<p>
				In some parts of the code you'll see methods that might be implemented
				elsewhere. If you are wondering what they do please feel free to visit
				the
				<a
					href="https://github.com/elianahmar/1brc-personal"
					target="_blank"
					rel="noopener">repository</a
				>. For this contest, I ran my solution on my MacBook Pro which has an M3
				chip with 18GB of memory.
			</p>
		</section>

		<!-- Baseline -->
		<section class="mb-16">
			<h2>Baseline Implementation</h2>
			<p>
				To get started, I first needed to do some setup. I added pprof for
				reading heap and CPU profiles and writing them to files, plus basic
				command-line arg parsing so I could freely run multiple implementations.
				And lastly, I added validations that would compare my results to
				solution to ensure correctness.
			</p>
			<p>
				In my initial solution, I immediately made the mistake of trying to
				parallelize my solution. I implemented a classic producer-consumer
				pattern where we read the file in one goroutine and push each line to a
				channel to be processed elsewhere.
			</p>
			<p>
				The runtime was <strong>509 seconds</strong>. Not the start I wanted,
				but I was satisfied to have a baseline to improve upon.
			</p>
			<CodeBlock html={data.p1} />
		</section>

		<!-- Wrong direction -->
		<section class="mb-16">
			<h2>Steps in the Wrong Direction; More Concurrency</h2>
			<p>
				After seeing my first result, I thought I could improve the runtime by
				chunk-reading the file and pushing each chunk to be processed. I could
				define beforehand how many bytes I want each chunk to have, read the
				whole file, and push chunks to channels to be consumed elsewhere.
				Unfortunately, this initial attempt failed for an important reason.
			</p>
			<p>
				If we read a certain number of bytes, the boundaries of these byte
				chunks could land somewhere in the middle of a line. I created a
				complicated solution to get around this, but long story short, my
				solution became significantly slower and more complex. This was the
				first real hurdle I had in the challenge.
			</p>
		</section>

		<!-- Sequential -->
		<section class="mb-16">
			<h2>Reset... Write Everything Sequentially</h2>
			<p>
				After some time trying to optimize a fundamentally flawed solution I had
				to take a step back. I decided to restart and completely rewrite the
				solution from scratch with one important caveat: the entire solution
				would run on the main thread. No concurrency, just plain file scanning,
				parsing, and map updates.
			</p>
			<p>
				And boom! My fastest solution yet. The Go standard library offers a
				clean API for reading a file line by line. I used <code
					>bufio.Scanner
				</code>
				to scan every line and update a map. My new runtime came down to
				<strong>117 seconds</strong>. I was back on track!
			</p>
			<CodeBlock html={data.p4} />

			<!-- TODO: need to add pprof dump if I reference it-->
		</section>

		<!-- Unsafe -->
		<section class="mb-16">
			<h2>Optimizing the Sequential Implementation with Unsafe</h2>
			<p>
				At this point, I had a solution that I knew I could improve upon. I
				noticed that parsing the lines themselves could be improved. I read
				through the implementation of <code>bytes.Cut</code> and noticed it does
				extra computation I didn't need. Because I know the exact shape of my data,
				I focused on optimizing that piece. I also wasn't a fan of the fact that
				I was reading and copying data. Instinctually, I knew I could do better.
			</p>
			<p>
				This brought me to Go's <code>unsafe</code> package. The TL;DR is that
				this package provides zero-cost conversions over byte arrays. I like to
				think about it as a "trust me bro" moment with the compiler. Under the
				hood you are creating a string header that points to a memory location
				in a byte slice and defining its length. This is powerful because
				<code>string(byteSlice)</code>
				is O(n) because it copies the bytes. With <code>unsafe</code> that cost becomes
				O(1). This can be dangerous if the underlying byte array changes (which it
				does), but I knew I had a powerful tool here for reducing latency.
			</p>
			<p>
				I used <code>unsafe</code> to perform the map lookup, and only create a
				copy when a novel city appears that isn't in the map. That trick brought
				my solution down to
				<strong>56 seconds</strong>!
			</p>
			<CodeBlock html={data.p5} />
			<Callout>
				You might be wondering, why do I need to copy the unsafe string in the
				case of an unseen city? The problem is that the underlying byte array
				which is being used for reading the file can change. And if I use the
				unsafe string it would be mutated since the we are using a single
				fixed-sized cyclic buffer to process the entire file. Subsequently our
				map's keys would become corrupted. I found this out the hard way...
			</Callout>
		</section>

		<!-- Int conversion -->
		<section class="mb-16">
			<h2>Manual Parsing of Lines + Int Conversion</h2>
			<p>
				At this point the intensity was getting cranked up. I was scrutinizing
				every line of code, reading through the source of every standard library
				function I was using, and pondering how to replace each with an
				implementation that directly suited my problem. My thought process was
				shifting toward implementing specific logic for parsing and handling the
				data.
			</p>
			<p>
				The next two steps were: 1) manually parse each line and 2) cast the
				float values to integers, which have a smaller memory footprint. This
				brought the runtime from 56 seconds to
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
				Things are getting a bit more intense. If I want to make this code fast,
				every line of code - be it mine or from the standard library - must
				serve a purpose. So <code>bytes.Cut()</code> had to go. There was just
				too much extra computation happening in that method that I didn't need.
				Also, I knew and validated that every line maintains the following form:
				<code>&lt;city&gt;;&lt;temperature&gt;\n</code>.
			</p>
			<p>
				<!--TODO: is this an accurate statement-->
				I could parse all of this myself, and doing so ensures I keep memory on the
				stack. I wrote out the logic for parsing the whole line manually. Going from
				44 seconds to <strong>38 seconds</strong>.
			</p>
			<CodeBlock html={data.p11} />
		</section>

		<!-- Chunk reading -->
		<section class="mb-16">
			<h2>Revisiting Chunk File Reading</h2>
			<p>
				I was really scratching my head at this point. I knew better solutions
				existed and I had heard of people who solved the challenge in under 5
				seconds. After running microbenchmarks I revisited chunked file reading.
				The pprof dumps were still showing syscalls consuming a majority of the
				latency, which made sense since I was still scanning each line one at a
				time. Microbenchmarking revealed it took 3 seconds just to read the
				entire file.
			</p>
			<CodeBlock html={data.p4Dump} />
			<p>
				Since my initial chunked reading attempt had failed, I'd brushed off the
				idea. But after revisiting it, I realized it was the only way to get a
				truly performant solution. If you remember earlier I had mentioned that
				the key issue with chunked file reading is that the bounary of the
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
				Those two modifications brought me from 38 seconds all the way to <strong
					>12 seconds</strong
				>!
			</p>
			<CodeBlock html={data.p13} />
			<Callout>
				Writing to a map is an extremely fast operation. However, having
				multiple go routines simoultaneously writing to a map requires mutexs
				and I knew almost immediately that a mutex in this case would slow my
				program down. Instead of updating a single map across multiple go
				routines with mutex I just created a new map for every go routine, and
				push the resulting map to a channel to be processed on the main thread.
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
				completes after the loop.
			</p>
			<CodeBlock html={data.singlePassDigit} />
			<CodeBlock html={data.digit} />

			<h3>Pointer Management</h3>
			<p>
				The key is to track a single <code>ptr</code> index over the raw buffer
				and advance it through each phase of the line - first to the
				<code>;</code>, then through the temperature bytes, then past the
				newline. Checking <code>ptr &lt; n</code> before every inner access
				prevents out-of-bounds reads at the very end of the buffer. What's nice
				about the Go API for reading bytes is that <code>file.ReadAt()</code> will
				give the number of bytes it reads. This became the bound for my loop.
			</p>
			<CodeBlock html={data.ptr} />
			<h3>Synchronization</h3>
			<p>
				In my final solution I utilize three channels: <code>rChan</code> which
				stores the <code>Range</code> object so I know where to read and how
				much to read.
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

		<!-- Conclusion -->
		<section class="mb-16">
			<h2>Conclusion</h2>
			<p>
				If you read this far, thank you. You might be wondering - what's the
				point? Why do all of this? In my day job, I write services that process
				and provide observability across thousands of Kubernetes clusters. The
				systems I work with maintain eventual consistency and store all of that
				data in memory. We don't rely on databases - which I know sounds insane,
				but I've made it work (I'll share that in a future article). All of this
				runs in a single pod in a single cluster.
			</p>
			<p>
				Suffice to say, I deal with matters of performance every day, and it's
				something I genuinely love spending time on. The times I learn the most
				as a programmer are typically when I'm debugging a really challenging
				bug or doing performance optimization like this. These problems require
				me to dig deep.
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
				> on my MacBook Pro. This was easily one of the most fun side projects I've
				ever done. It forced me to squeeze every last drop from my tools, scrutinize
				every piece of code from the standard library, and devise crafty tricks to
				shave off every piece of unnecessary work. The feeling of seeing your slow
				code become blazing fast never failed to put a grin on my face.
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
