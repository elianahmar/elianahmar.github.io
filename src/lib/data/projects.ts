export interface Project {
	title: string;
	description: string;
	tags: string[];
	link?: string;
	internal?: boolean;
}

export const projects: Project[] = [
	{
		title: 'Rust Terminal',
		description:
			'Building a modern terminal emulator from scratch in Rust. Focused on performance, correctness, and deep understanding of terminal protocols and system-level I/O.',
		tags: ['Rust', 'Systems Programming', 'Terminal', 'I/O'],
		link: 'https://github.com/elianahmar'
	},
	{
		title: 'Novahub.ai',
		description:
			'AI-driven chatbot teaching CS and data science fundamentals to 200+ students. Full-stack application with real-time conversational AI.',
		tags: ['Svelte', 'FastAPI', 'OpenAI', 'Prisma', 'TypeScript'],
		link: 'https://github.com/elianahmar'
	}
];
