<svelte:head>
	<title>Elian Ahmar — Resume/CV</title>
	<meta name="description" content="Resume and CV for Elian Ahmar — Software Engineer at Walmart Global Tech." />
	<meta property="og:title" content="Elian Ahmar — Resume/CV" />
	<meta property="og:description" content="Resume and CV for Elian Ahmar — Software Engineer at Walmart Global Tech." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://elianahmar.github.io/resume" />
</svelte:head>

<article class="pt-28 pb-20 px-6">
	<div class="max-w-3xl mx-auto">

		<h1 class="text-3xl font-bold text-[var(--color-text-primary)] mb-3">Elian Ahmar's Resume/CV</h1>

		<p class="text-sm font-mono text-[var(--color-text-secondary)] mb-12">
			Go to:
			<a href="#summary" class="hover:text-[var(--color-accent-blue)] transition-colors">Summary</a> ·
			<a href="#skills" class="hover:text-[var(--color-accent-blue)] transition-colors">Skills</a> ·
			<a href="#experience" class="hover:text-[var(--color-accent-blue)] transition-colors">Experience</a> ·
			<a href="#education" class="hover:text-[var(--color-accent-blue)] transition-colors">Education</a>
		</p>

		<!-- Summary -->
		<section id="summary" class="mb-12 scroll-mt-24">
			<h2 class="text-xl font-bold text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-border)]">Summary</h2>
			<div class="space-y-3 text-[var(--color-text-secondary)] leading-relaxed">
				<p>I'm a software engineer at Walmart Global Tech working on reliability engineering — building the systems that keep production running smoothly at massive scale. My work lives at the intersection of infrastructure automation, AI tooling, and backend performance optimization.</p>
				<p>I'm fluent in Go and Python, with strong experience in TypeScript and C. I graduated from Rice University with a degree in Computer Science and a minor in Data Science, and I care deeply about correctness, performance, and systems that scale.</p>
			</div>
		</section>

		<!-- Skills -->
		<section id="skills" class="mb-12 scroll-mt-24">
			<h2 class="text-xl font-bold text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-border)]">Skills</h2>
			<div class="space-y-2 text-sm">
				<div class="flex gap-3">
					<span class="font-mono text-[var(--color-accent-blue)] w-44 shrink-0">Languages</span>
					<span class="text-[var(--color-text-secondary)]">Go, Python, TypeScript, Java, C, Lua, R</span>
				</div>
				<div class="flex gap-3">
					<span class="font-mono text-[var(--color-accent-blue)] w-44 shrink-0">Tools</span>
					<span class="text-[var(--color-text-secondary)]">Git, Kubernetes, Docker, Neovim, Grafana, Azure, GCP, AWS, Fly.io, Kafka</span>
				</div>
				<div class="flex gap-3">
					<span class="font-mono text-[var(--color-accent-blue)] w-44 shrink-0">Libraries / Frameworks</span>
					<span class="text-[var(--color-text-secondary)]">FastAPI, Svelte, Prisma, PyTorch, NumPy, React</span>
				</div>
			</div>
		</section>

		<!-- Experience -->
		<section id="experience" class="mb-12 scroll-mt-24">
			<h2 class="text-xl font-bold text-[var(--color-text-primary)] mb-6 pb-2 border-b border-[var(--color-border)]">Experience</h2>
			<div class="space-y-10">

				<!-- Walmart -->
				<div>
					<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
						<h3 class="text-base font-semibold text-[var(--color-text-primary)]">
							<a href="https://tech.walmart.com" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-accent-blue)] transition-colors">Walmart Global Tech</a>
							— Software Engineer, Reliability Engineering
						</h3>
						<span class="font-mono text-xs text-[var(--color-text-secondary)] shrink-0">Aug 2023 – Present</span>
					</div>
					<ul class="space-y-2">
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Designed and built Golang services which automated infrastructure scaling during peak holiday traffic, reducing manual engineering hours by over 90% and saving $5M annually. Earned the 2024 Engineering Excellence award for this initiative.</span>
						</li>
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Led core development of OneClick, a platform service enabling real-time production configuration management, automated traffic control, and rapid disaster recovery for critical production systems.</span>
						</li>
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Designed and implemented an internal MCP server enabling AI-assisted playbook creation and validation for OneClick; architected a dynamic validation engine integrating GitHub and live infrastructure metadata, reducing platform support tickets by 80%.</span>
						</li>
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Contributed cross-functionally to Walmart's internal Cloud Native Platform, enhancing performance and observability of core Kubernetes-based microservices.</span>
						</li>
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Authored a deployment verification tool in Golang to identify workloads requiring post-deployment scaling, proactively preventing 10+ production incidents caused by under-provisioning.</span>
						</li>
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Driving alignment and backend implementation of UX enhancements through design docs and stakeholder reviews, reducing user friction when onboarding to our product suite.</span>
						</li>
					</ul>
				</div>

				<!-- AI Camp -->
				<div>
					<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
						<h3 class="text-base font-semibold text-[var(--color-text-primary)]">
							<a href="https://aicamp.ai" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-accent-blue)] transition-colors">AI Camp</a>
							— Software Engineer
						</h3>
						<span class="font-mono text-xs text-[var(--color-text-secondary)] shrink-0">Dec 2022 – Nov 2024</span>
					</div>
					<ul class="space-y-2">
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Designed and launched Novahub.ai, an AI-driven chatbot teaching computer science and data science fundamentals to 200+ high school students. Led backend development (FastAPI, OpenAI APIs, Prisma) and contributed to frontend (Svelte, TypeScript).</span>
						</li>
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Built and maintained CI/CD pipelines using GitHub Actions, AWS EC2, and Dokku, reducing deployment time and improving release confidence for a distributed team.</span>
						</li>
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Created and deployed a production-ready Discord bot using discord.js and Fly.io, extending the chatbot's reach through real-time conversational features.</span>
						</li>
					</ul>
				</div>

				<!-- Booz Allen -->
				<div>
					<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
						<h3 class="text-base font-semibold text-[var(--color-text-primary)]">
							<a href="https://www.boozallen.com" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-accent-blue)] transition-colors">Booz Allen Hamilton</a>
							— Software Engineer Intern
						</h3>
						<span class="font-mono text-xs text-[var(--color-text-secondary)] shrink-0">Jun 2022 – Aug 2022</span>
					</div>
					<ul class="space-y-2">
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Built and deployed an autoencoder-based anomaly detection system for system log files using cuDF, PyTorch, and cuPY, decreasing preprocessing latency by 212%.</span>
						</li>
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Designed and implemented an inference pipeline utilizing Nvidia Morpheus, with production deployment orchestrated via Kubernetes.</span>
						</li>
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Automated real-time log ingestion and enrichment using Apache Kafka and Cribl Stream, integrating end-to-end data flow into the inferencing pipeline. Code shipped to production.</span>
						</li>
					</ul>
				</div>

				<!-- D2K / MIC -->
				<div>
					<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
						<h3 class="text-base font-semibold text-[var(--color-text-primary)]">
							<a href="https://d2k.rice.edu" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-accent-blue)] transition-colors">D2K Lab, Rice University</a>
							/
							<a href="https://www.mic-aic.com" target="_blank" rel="noopener noreferrer" class="hover:text-[var(--color-accent-blue)] transition-colors">Medical Informatics Corporation</a>
							— ML Engineer Intern
						</h3>
						<span class="font-mono text-xs text-[var(--color-text-secondary)] shrink-0">Aug 2022 – Dec 2022</span>
					</div>
					<ul class="space-y-2">
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Built ML models to predict pediatric cardiac output from waveform signals using NumPy, XGBoost, and Spline Regression, achieving high accuracy.</span>
						</li>
						<li class="flex gap-2 text-sm text-[var(--color-text-secondary)] leading-snug">
							<span class="text-[var(--color-accent-green)] shrink-0 mt-0.5">▸</span>
							<span>Engineered features based on the Signal Abnormality Index (Sun, 2006) to enhance model performance.</span>
						</li>
					</ul>
				</div>

			</div>
		</section>

		<!-- Education -->
		<section id="education" class="mb-12 scroll-mt-24">
			<h2 class="text-xl font-bold text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-border)]">Education</h2>
			<p class="text-sm text-[var(--color-text-secondary)] leading-relaxed">
				<a href="https://www.rice.edu" target="_blank" rel="noopener noreferrer" class="text-[var(--color-text-primary)] font-semibold hover:text-[var(--color-accent-blue)] transition-colors">Rice University</a>
				— B.S. Computer Science, Data Science Minor — Aug 2018 – May 2023
			</p>
		</section>

	</div>
</article>
