import { CodeInjectionDto } from "../dtos/codeInjection.dto";

const BE_URL = process.env.BE_URL || 'http://localhost:3002';
const CACHE_TTL = 60 * 1000;

type CacheEntry = { data: CodeInjectionDto[]; expiresAt: number };

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<CodeInjectionDto[]>>();

async function fetchCodeInjectionData(
  type: 'code-injection-header' | 'code-injection-footer'
): Promise<CodeInjectionDto[]> {
  const url = `${BE_URL}/api/pages/static-contents/${type}`;
  const response = await fetch(url);
  const result = await response.json();

  // Handle response format
  const items = Array.isArray(result) ? result : (result?.data || []);

  // Filter active and sort by sort field
  return items
    .filter((item: CodeInjectionDto) => item.is_active !== false)
    .sort((a: CodeInjectionDto, b: CodeInjectionDto) => (a.sort || 0) - (b.sort || 0));
}

export async function getCodeInjectionData(
  type: 'code-injection-header' | 'code-injection-footer'
): Promise<CodeInjectionDto[]> {
  // BE_URL không được expose ra client nên request phía trình duyệt luôn hỏng.
  if (typeof window !== 'undefined') {
    return [];
  }

  const cached = cache.get(type);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const pending = inflight.get(type);
  if (pending) {
    return pending;
  }

  const request = fetchCodeInjectionData(type)
    .then((data) => {
      cache.set(type, { data, expiresAt: Date.now() + CACHE_TTL });
      return data;
    })
    .catch((error) => {
      console.error('[SSR] Failed to fetch code injection data:', error);
      // Giữ bản cũ khi BE lỗi để script tracking không biến mất khỏi trang.
      return cached?.data || [];
    })
    .finally(() => {
      inflight.delete(type);
    });

  inflight.set(type, request);
  return request;
}
