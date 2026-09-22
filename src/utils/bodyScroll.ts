/**
 * Locks page scroll while an overlay (search, nav menu, modal, image popup) is open.
 *
 * Unlocking removes the inline property instead of writing a value back. `overflow: auto`
 * is not the original state — globals.css leaves <body> on `overflow-x: clip` /
 * `overflow-y: visible` — and it turns <body> into the scroll container, which strands
 * `window.scrollY` at 0 and makes `window.scrollTo` a no-op for the rest of the session.
 */
export function setBodyScrollLocked(locked: boolean) {
  if (locked) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.removeProperty('overflow');
  }
}
