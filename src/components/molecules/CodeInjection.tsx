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
    const headElements = data.flatMap((item) => parseCodeContent(item.content, item.id));
    return <Head>{headElements}</Head>;
  }

  return (
    <>
      {data.map((item) => (
        <React.Fragment key={item.id}>
          {renderCodeContent(item.content, item.id)}
        </React.Fragment>
      ))}
    </>
  );
};

// Parse content cho header - trả về array cho Head component
const parseCodeContent = (content: string, id: number): React.ReactNode[] => {
  if (!content?.trim()) return [];

  const elements: React.ReactNode[] = [];

  if (content.includes('<script')) {
    const srcMatch = content.match(/src=["']([^"']+)["']/);
    const innerContentMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    
    if (srcMatch) {
      elements.push(<script key={`script-${id}`} src={srcMatch[1]} data-code-injection-id={id} />);
    } else if (innerContentMatch?.[1]?.trim()) {
      elements.push(
        <script key={`script-${id}`} dangerouslySetInnerHTML={{ __html: innerContentMatch[1] }} data-code-injection-id={id} />
      );
    }
    return elements;
  }

  if (content.includes('<link')) {
    const hrefMatch = content.match(/href=["']([^"']+)["']/);
    const relMatch = content.match(/rel=["']([^"']+)["']/);
    if (hrefMatch) {
      elements.push(<link key={`link-${id}`} href={hrefMatch[1]} rel={relMatch?.[1] || 'stylesheet'} data-code-injection-id={id} />);
    }
    return elements;
  }

  if (content.includes('<style')) {
    const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    if (styleMatch?.[1]?.trim()) {
      elements.push(<style key={`style-${id}`} dangerouslySetInnerHTML={{ __html: styleMatch[1] }} data-code-injection-id={id} />);
    }
    return elements;
  }

  if (content.includes('<meta')) {
    const nameMatch = content.match(/name=["']([^"']+)["']/);
    const contentMatch = content.match(/content=["']([^"']+)["']/);
    if (nameMatch && contentMatch) {
      elements.push(<meta key={`meta-${id}`} name={nameMatch[1]} content={contentMatch[1]} data-code-injection-id={id} />);
    }
    return elements;
  }

  return [];
};

// Render content cho footer - dùng next/script để load sau khi page interactive
const renderCodeContent = (content: string, id: number) => {
  if (!content?.trim()) return null;

  if (content.includes('<script')) {
    const srcMatch = content.match(/src=["']([^"']+)["']/);
    const innerContentMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/);
    
    if (srcMatch) {
      return <Script key={`script-${id}`} src={srcMatch[1]} strategy="afterInteractive" data-code-injection-id={id} />;
    } else if (innerContentMatch?.[1]?.trim()) {
      return (
        <Script
          key={`script-${id}`}
          id={`code-injection-${id}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: innerContentMatch[1] }}
          data-code-injection-id={id}
        />
      );
    }
  }

  if (content.includes('<link')) {
    const hrefMatch = content.match(/href=["']([^"']+)["']/);
    const relMatch = content.match(/rel=["']([^"']+)["']/);
    if (hrefMatch) {
      return <link key={`link-${id}`} href={hrefMatch[1]} rel={relMatch?.[1] || 'stylesheet'} data-code-injection-id={id} />;
    }
  }

  if (content.includes('<style')) {
    const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/);
    if (styleMatch?.[1]?.trim()) {
      return <style key={`style-${id}`} dangerouslySetInnerHTML={{ __html: styleMatch[1] }} data-code-injection-id={id} />;
    }
  }

  if (content.includes('<meta')) {
    const nameMatch = content.match(/name=["']([^"']+)["']/);
    const contentMatch = content.match(/content=["']([^"']+)["']/);
    if (nameMatch && contentMatch) {
      return <meta key={`meta-${id}`} name={nameMatch[1]} content={contentMatch[1]} data-code-injection-id={id} />;
    }
  }

  // Fallback: render HTML khác trong hidden div
  return <div key={`html-${id}`} dangerouslySetInnerHTML={{ __html: content }} style={{ display: 'none' }} data-code-injection-id={id} />;
};

export default CodeInjection;
