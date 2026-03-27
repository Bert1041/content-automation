import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Handle n8n content which can be either raw text or a JSON string
 * with structure { drafts: [{ platform: string, content: string }] }
 */
export function parseDraftContent(rawContent: string, platform?: string): string {
  if (!rawContent || typeof rawContent !== 'string') return rawContent || "";
  
  // Quick check if it's likely JSON
  if (!rawContent.trim().startsWith('{')) return rawContent;

  try {
    const parsed = JSON.parse(rawContent);
    
    // Handle { drafts: [...] }
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.drafts)) {
      if (platform) {
        const normalizedPlatform = platform.toLowerCase();
        const match = parsed.drafts.find((d: any) => {
          const p = (d.platform || "").toLowerCase();
          return p.includes(normalizedPlatform) || normalizedPlatform.includes(p);
        });
        if (match) return match.content || match.text || rawContent;
      }
      // Fallback to first draft if no platform match
      return parsed.drafts[0]?.content || parsed.drafts[0]?.text || rawContent;
    }
    
    // Handle direct { platform, content }
    if (parsed && typeof parsed === 'object' && (parsed.content || parsed.text)) {
      return parsed.content || parsed.text;
    }

    return rawContent;
  } catch (e) {
    return rawContent;
  }
}
