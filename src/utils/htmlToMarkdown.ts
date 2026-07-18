import sanitizeHtml from 'sanitize-html';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

// CMS content carries its own <h1>-<h6>, but the .md document already has its
// own H1 (the page/product/news title): shift content headings down one
// level so the document keeps a single top-level heading.
turndownService.addRule('shiftedHeading', {
  filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
  replacement: (content, node) => {
    const level = Math.min(Number((node as HTMLElement).nodeName.charAt(1)) + 1, 6);
    return `\n\n${'#'.repeat(level)} ${content}\n\n`;
  },
});

export function htmlToMarkdown(html?: string | null): string {
  if (!html) {
    return '';
  }

  const clean = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.filter(
      (tag) => tag !== 'iframe' && tag !== 'script' && tag !== 'style',
    ),
    allowedAttributes: false,
    allowedSchemes: ['http', 'https', 'mailto'],
  });

  return turndownService.turndown(clean).trim();
}
