import { createHighlighter } from 'shiki';
import * as snippets from './code.js';

export const prerender = true;

export async function load() {
	const highlighter = await createHighlighter({
		themes: ['github-dark'],
		langs: ['go']
	});

	const highlight = (code: string) =>
		highlighter.codeToHtml(code, { lang: 'go', theme: 'github-dark' });

	return {
		p1: highlight(snippets.p1Code),
		p4: highlight(snippets.p4Code),
		p4Dump: highlight(snippets.p4Pprof),
		p5: highlight(snippets.p5Code),
		p9: highlight(snippets.p9Code),
		p11: highlight(snippets.p11Code),
		p13: highlight(snippets.p13Code),
		digit: highlight(snippets.digitCode),
		ptr: highlight(snippets.ptrCode),
		p17: highlight(snippets.p17Code),
		sampleData: highlight(snippets.sampleData)
	};
}
