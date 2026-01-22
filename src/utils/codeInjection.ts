import { CodeInjectionDto } from "../dtos/codeInjection.dto";

const BE_URL = process.env.BE_URL || 'http://localhost:3002';

export async function getCodeInjectionData(
  type: 'code-injection-header' | 'code-injection-footer'
): Promise<CodeInjectionDto[]> {
  try {
    const url = `${BE_URL}/api/pages/static-contents/${type}`;
    const response = await fetch(url);
    const result = await response.json();
    
    // Handle response format
    const items = Array.isArray(result) ? result : (result?.data || []);
    
    // Filter active and sort by sort field
    return items
      .filter((item: CodeInjectionDto) => item.is_active !== false)
      .sort((a: CodeInjectionDto, b: CodeInjectionDto) => (a.sort || 0) - (b.sort || 0));
  } catch (error) {
    console.error('[SSR] Failed to fetch code injection data:', error);
    return [];
  }
}
