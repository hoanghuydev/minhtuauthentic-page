import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import IconListOl from '@/components/icons/list-ol';
import IconCheveronRight from '@/components/icons/cheveron-right';

type TocNode = {
  id: string;
  text: string;
  level: number;
  position: number;
  children: TocNode[];
};

type Props = {
  contentId?: string;
};

const HEADINGS = 'h2, h3, h4';
const SCROLL_GAP = 16;
const SCROLL_MIN_MS = 350;
const SCROLL_MAX_MS = 800;

function easeInOutQuad(progress: number) {
  return progress < 0.5
    ? 2 * progress * progress
    : 1 - (2 - 2 * progress) ** 2 / 2;
}

function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function collectHeadings(content: HTMLElement): TocNode[] {
  const taken = new Set<string>();
  const root: TocNode[] = [];
  const ancestors: TocNode[] = [];

  content
    .querySelectorAll<HTMLElement>(HEADINGS)
    .forEach((heading, position) => {
      const text = heading.textContent?.trim();
      if (!text) return;

      let id = heading.id || slugify(text) || 'muc-luc';
      for (let suffix = 2; taken.has(id); suffix++) {
        id = `${slugify(text)}-${suffix}`;
      }
      taken.add(id);
      heading.id = id;

      const level = Number(heading.tagName.slice(1));
      const node: TocNode = { id, text, level, position, children: [] };
      while (
        ancestors.length &&
        ancestors[ancestors.length - 1].level >= level
      ) {
        ancestors.pop();
      }
      (ancestors[ancestors.length - 1]?.children ?? root).push(node);
      ancestors.push(node);
    });

  return root;
}

export default function Toc({ contentId = 'toc-content' }: Props) {
  const [nodes, setNodes] = useState<TocNode[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const animation = useRef<number | undefined>(undefined);

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (content) setNodes(collectHeadings(content));
  }, [contentId]);

  // Resolved by position rather than by id: the headings live inside a
  // dangerouslySetInnerHTML block, so a re-render there can replace them.
  const scrollToHeading = (position: number) => {
    const content = document.getElementById(contentId);
    const heading = content?.querySelectorAll<HTMLElement>(HEADINGS)[position];
    if (!heading) return;
    // The site header is sticky, so it would cover the heading at its natural offset.
    const stickyHeader = document.getElementById('header');
    const top =
      heading.getBoundingClientRect().top +
      window.scrollY -
      (stickyHeader?.offsetHeight || 0) -
      SCROLL_GAP;

    // Native `behavior: 'smooth'` jumps instantly here, so animate it by hand.
    const from = window.scrollY;
    const distance = top - from;
    const duration = Math.min(
      SCROLL_MAX_MS,
      Math.max(SCROLL_MIN_MS, Math.abs(distance) / 3),
    );
    const startedAt = performance.now();

    if (animation.current) cancelAnimationFrame(animation.current);
    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      window.scrollTo(0, from + distance * easeInOutQuad(progress));
      if (progress < 1) animation.current = requestAnimationFrame(step);
    };
    animation.current = requestAnimationFrame(step);
  };

  const renderList = (items: TocNode[], isRoot = false) => (
    <ul className={isRoot ? 'toc-list' : undefined}>
      {items.map((item) => (
        <li key={item.id}>
          <a onClick={() => scrollToHeading(item.position)}>{item.text}</a>
          {item.children.length > 0 && renderList(item.children)}
        </li>
      ))}
    </ul>
  );

  if (!nodes.length) return null;

  return (
    <div className="meta-toc">
      <div className="box-readmore">
        <button
          type="button"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((value) => !value)}
          className="flex w-full items-center gap-2 bg-primary px-4 py-3 text-left text-white"
        >
          <IconListOl className="h-5 w-5 shrink-0" />
          <span className="text-base font-bold uppercase">Mục lục</span>
          <IconCheveronRight
            className={twMerge(
              'ml-auto h-4 w-4 shrink-0 transition-transform duration-200',
              collapsed ? 'rotate-90' : '-rotate-90',
            )}
          />
        </button>
        {!collapsed && (
          <nav className="px-4 py-3">{renderList(nodes, true)}</nav>
        )}
      </div>
    </div>
  );
}
