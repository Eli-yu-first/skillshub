/**
 * MarkdownRenderer - Full-featured Markdown rendering with syntax highlighting
 * Supports: GFM tables, code blocks with highlight, images, links, task lists
 */
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const isInline = !match && !className;

  if (isInline) {
    return (
      <code className="px-1.5 py-0.5 rounded-md bg-muted text-sm font-mono text-foreground" {...props}>
        {children}
      </code>
    );
  }

  const handleCopy = () => {
    const text = String(children).replace(/\n$/, '');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4">
      {match && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/80 border border-border border-b-0 rounded-t-lg">
          <span className="text-xs font-mono text-muted-foreground">{match[1]}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre className={`overflow-x-auto p-4 bg-muted/50 border border-border text-sm font-mono leading-relaxed ${match ? 'rounded-b-lg' : 'rounded-lg'}`}>
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-body prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code: CodeBlock,
          h1: ({ children }) => (
            <h1 className="text-2xl font-display font-bold mt-8 mb-4 pb-2 border-b border-border text-foreground">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-display font-semibold mt-6 mb-3 pb-1.5 border-b border-border text-foreground">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-display font-semibold mt-5 mb-2 text-foreground">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-display font-semibold mt-4 mb-2 text-foreground">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="my-3 text-sm leading-relaxed text-foreground/90">{children}</p>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
          ),
          ul: ({ children }) => (
            <ul className="my-3 pl-6 space-y-1.5 list-disc text-sm text-foreground/90">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 pl-6 space-y-1.5 list-decimal text-sm text-foreground/90">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 pl-4 border-l-4 border-primary/30 text-muted-foreground italic">{children}</blockquote>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto border border-border rounded-lg">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left font-semibold text-foreground border-b border-border">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 border-b border-border text-foreground/80">{children}</td>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt || ''} className="my-4 rounded-lg max-w-full border border-border" loading="lazy" />
          ),
          hr: () => (
            <hr className="my-6 border-border" />
          ),
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 rounded border-border"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
