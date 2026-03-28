import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * A premium Markdown renderer styled for the "Luxury Refined" design system.
 * Handles headers, lists, bold text, and links with proper typography.
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={cn(
      "markdown-content prose dark:prose-invert max-w-none text-brand-dark dark:text-brand-light font-body transition-colors duration-300",
      className
    )}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Luxury Headers
          h1: ({ children }) => (
            <h1 className="mb-6 mt-1 text-3xl font-extrabold tracking-tight text-brand-dark dark:text-brand-light font-heading lg:text-4xl border-b border-brand-light-grey pb-2 dark:border-brand-dark/20 uppercase tracking-widest">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-4 mt-10 text-xl font-bold tracking-tight text-brand-dark dark:text-brand-light font-heading lg:text-2xl pt-4 first:mt-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-8 text-lg font-bold tracking-wide text-brand-dark dark:text-brand-light font-heading lg:text-xl border-l-4 border-brand-accent/30 pl-4 py-1">
              {children}
            </h3>
          ),
          
          // Refined Paragraphs
          p: ({ children }) => (
            <p className="mb-5 leading-relaxed text-slate-600 dark:text-brand-light/90 text-sm lg:text-base font-medium opacity-95">
              {children}
            </p>
          ),
          
          // Elegant Lists
          ul: ({ children }) => (
            <ul className="mb-6 ml-4 list-none space-y-3">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 ml-6 list-decimal space-y-3 marker:text-brand-accent marker:font-bold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="relative pl-6 text-sm lg:text-base text-slate-600 dark:text-brand-light/90">
              <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-brand-accent/60" />
              {children}
            </li>
          ),
          
          // Standout Bold/Italic
          strong: ({ children }) => (
            <strong className="font-extrabold text-brand-dark dark:text-brand-light tracking-tight px-0.5 bg-brand-accent/5 rounded-sm">
              {children}
            </strong>
          ),
          
          // Premium Links
          a: ({ children, href }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-brand-accent decoration-brand-accent/30 underline-offset-4 hover:underline hover:text-brand-orange transition-all duration-200"
            >
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-10 border-0 h-px bg-gradient-to-r from-transparent via-brand-light-grey to-transparent opacity-50 dark:via-brand-dark/20" />
          ),

          // Blockquote for emphasis
          blockquote: ({ children }) => (
            <blockquote className="my-8 border-l-4 border-brand-orange bg-brand-orange/5 px-6 py-4 rounded-r-2xl italic text-slate-700 dark:text-brand-light font-serif">
              {children}
            </blockquote>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
