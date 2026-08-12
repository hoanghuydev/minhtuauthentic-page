import { useEffect, useState } from 'react';

type TocItem = {
  id: string;
  text: string;
  level: number;
  number: string;
  /** Vị trí trong danh sách heading, dùng để tìm lại khi id bị mất. */
  index: number;
};

const DEFAULT_VISIBLE_ITEMS = 5;

// Kept byte-for-byte compatible with the old jQuery plugin (public/js/toc.js)
// so heading ids - and therefore any anchor already shared or indexed - stay
// exactly the same after moving the TOC to React.
const changeToSlug = (value = '') => {
  return (
    '@' +
    value
      .toLowerCase()
      .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
      .replace(/đ/gi, 'd')
      .replace(
        /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
        '',
      )
      .replace(/ /gi, '-')
      .replace(/&nbsp;/gi, '-')
      .replace(/\-\-\-\-\-/gi, '-')
      .replace(/\-\-\-\-/gi, '-')
      .replace(/\-\-\-/gi, '-')
      .replace(/ /g, '')
      .replace(/\-\-/gi, '-') +
    '@'
  ).replace(/\@\-|\-\@|\@/gi, '');
};

const buildUniqueId = (text: string, index: number) => {
  // Heading rỗng hoặc chỉ toàn dấu câu cho ra slug rỗng (hay gặp với HTML
  // dán từ nơi khác, vd <h2>&nbsp;</h2>). Rơi về id theo vị trí, nếu không
  // sẽ có nhiều mục cùng id rỗng -> trùng key React.
  const base = changeToSlug(text) || `toc-${index}`;
  let suffix = '';
  let counter = 1;
  while (document.getElementById(base + suffix) !== null) {
    suffix = '_' + counter++;
  }
  return base + suffix;
};

type Props = {
  title?: string;
  contentId?: string;
  headings?: string;
  /** Số mục hiển thị trước khi phải bấm "Xem tất cả". */
  defaultVisibleItems?: number;
  /** Đổi giá trị này để bắt TOC quét lại khi nội dung thay đổi. */
  contentKey?: string | number;
};

export default function Toc({
  title = 'Nội dung bài viết',
  contentId = 'toc-content',
  headings = 'h2,h3,h4',
  defaultVisibleItems = DEFAULT_VISIBLE_ITEMS,
  contentKey,
}: Props) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const content = document.getElementById(contentId);
    if (!content) {
      setItems([]);
      return;
    }

    const levels = headings.split(',').map((item) => item.trim().toLowerCase());
    const counters: number[] = [];

    const nextItems = Array.from(
      content.querySelectorAll<HTMLElement>(headings),
    ).map((node, index) => {
      const level = Math.max(levels.indexOf(node.tagName.toLowerCase()), 0);
      const text = (node.textContent || '').trim();
      if (!node.id) {
        node.id = buildUniqueId(text, index);
      }

      // Cắt bớt counter của các cấp sâu hơn để đánh số lại từ đầu, ví dụ
      // 1 -> 1.1 -> 1.2 -> 2 -> 2.1
      counters.length = level + 1;
      for (let i = 0; i < level; i++) {
        if (!counters[i]) counters[i] = 1;
      }
      counters[level] = (counters[level] || 0) + 1;

      return {
        id: node.id,
        text,
        level,
        number: counters.slice(0, level + 1).join('.'),
        index,
      };
    });

    setItems(nextItems);
    setIsExpanded(false);
  }, [contentId, headings, contentKey]);

  const scrollToHeading = (item: TocItem) => {
    // React dựng lại nội dung mô tả bằng dangerouslySetInnerHTML, nên các
    // node heading có thể bị thay mới sau khi ta gán id - lúc đó
    // getElementById trả về null. Tìm lại theo vị trí rồi đóng dấu id lại.
    let target = document.getElementById(item.id);
    if (!target) {
      const content = document.getElementById(contentId);
      const nodes = content?.querySelectorAll<HTMLElement>(headings);
      target = nodes?.[item.index] || null;
      if (target && !target.id) {
        target.id = item.id;
      }
    }
    if (!target) return;

    // Header dùng `sticky top-0` nên phải trừ chiều cao của nó, nếu không
    // tiêu đề sẽ bị che mất.
    const header = document.getElementById('header');
    const offset = (header?.offsetHeight || 0) + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: top < 0 ? 0 : top, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  const hasMore = items.length > defaultVisibleItems;
  const visibleItems =
    hasMore && !isExpanded ? items.slice(0, defaultVisibleItems) : items;

  return (
    <div className="meta-toc">
      <div className="box-readmore">
        <h3 className="text-xl font-bold">{title}</h3>
        <ul className="toc-list">
          {visibleItems.map((item) => (
            <li
              key={item.id}
              className="toc-item"
              style={{ paddingLeft: item.level * 16 }}
            >
              <span className="toc-number">{item.number}.</span>
              <a
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToHeading(item);
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>

        {hasMore && (
          <button
            type="button"
            className="toc-toggle"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((value) => !value)}
          >
            {isExpanded ? 'Thu gọn' : `Xem tất cả (${items.length} mục)`}
            <svg
              className={isExpanded ? 'toc-toggle-icon is-open' : 'toc-toggle-icon'}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
