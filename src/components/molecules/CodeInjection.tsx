import React from 'react';
import Script from 'next/script';
import Head from 'next/head';
import { CodeInjectionDto } from '@/dtos/codeInjection.dto';

interface CodeInjectionProps {
  type: 'header' | 'footer';
  data: CodeInjectionDto[];
}

const CodeInjection: React.FC<CodeInjectionProps> = ({ type, data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  if (type === 'header') {
    // Next.js Head yêu cầu direct children, không dùng Fragment wrapper
    const headElements = data.flatMap((item) => parseContent(item.content, item.id, true));
    return <Head>{headElements}</Head>;
  }

  return (
    <>
      {data.map((item) => (
        <React.Fragment key={item.id}>
          {parseContent(item.content, item.id, false)}
        </React.Fragment>
      ))}
    </>
  );
};

// Parse và render content - isHeader xác định context để chọn cách render phù hợp
const parseContent = (content: string, id: number, isHeader: boolean): React.ReactNode | React.ReactNode[] => {
  if (!content?.trim()) return isHeader ? [] : null;

  if (content.includes('<script')) {
    const srcMatch = content.match(/src=["']([^"']+)["']/);
    const innerMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    
    if (srcMatch) {
      const element = isHeader
        ? <script key={`script-${id}`} src={srcMatch[1]} data-code-injection-id={id} />
        : <Script key={`script-${id}`} src={srcMatch[1]} strategy="afterInteractive" data-code-injection-id={id} />;
      return isHeader ? [element] : element;
    }
    
    if (innerMatch?.[1]?.trim()) {
      const element = isHeader
        ? <script key={`script-${id}`} dangerouslySetInnerHTML={{ __html: innerMatch[1] }} data-code-injection-id={id} />
        : <Script key={`script-${id}`} id={`code-injection-${id}`} strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: innerMatch[1] }} data-code-injection-id={id} />;
      return isHeader ? [element] : element;
    }
    return isHeader ? [] : null;
  }

  if (content.includes('<link')) {
    const hrefMatch = content.match(/href=["']([^"']+)["']/);
    const relMatch = content.match(/rel=["']([^"']+)["']/);
    if (hrefMatch) {
      const element = <link key={`link-${id}`} href={hrefMatch[1]} rel={relMatch?.[1] || 'stylesheet'} data-code-injection-id={id} />;
      return isHeader ? [element] : element;
    }
    return isHeader ? [] : null;
  }

  if (content.includes('<style')) {
    const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    if (styleMatch?.[1]?.trim()) {
      const element = <style key={`style-${id}`} dangerouslySetInnerHTML={{ __html: styleMatch[1] }} data-code-injection-id={id} />;
      return isHeader ? [element] : element;
    }
    return isHeader ? [] : null;
  }

  if (content.includes('<meta')) {
    const nameMatch = content.match(/name=["']([^"']+)["']/);
    const contentMatch = content.match(/content=["']([^"']+)["']/);
    if (nameMatch && contentMatch) {
      const element = <meta key={`meta-${id}`} name={nameMatch[1]} content={contentMatch[1]} data-code-injection-id={id} />;
      return isHeader ? [element] : element;
    }
    return isHeader ? [] : null;
  }

  // Fallback: chỉ render hidden div cho footer (header không hỗ trợ div trong Head)
  if (!isHeader) {
    return <div key={`html-${id}`} dangerouslySetInnerHTML={{ __html: content }} style={{ display: 'none' }} data-code-injection-id={id} />;
  }
  return [];
};

export default CodeInjection;
