import { type FirestoreDraft } from "./firebase/drafts";
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
  
  let content = rawContent.trim();
  
  // Clean up common "JSON-wrapped-in-string" issues (e.g. from Airtable/CSV)
  if (content.startsWith('"') && content.endsWith('"')) {
    content = content.substring(1, content.length - 1).replace(/""/g, '"');
  }

  // Quick check if it's likely JSON
  if (!content.startsWith('{')) return content;

  try {
    const parsed = JSON.parse(content);
    
    // Handle { drafts: [...] }
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.drafts)) {
      if (platform) {
        const normalizedPlatform = platform.toLowerCase();
        const match = (parsed.drafts as Array<{platform?: string; content?: string; text?: string}>).find((d) => {
          const p = (d.platform || "").toLowerCase();
          return p.includes(normalizedPlatform) || normalizedPlatform.includes(p);
        });
        if (match) return match.content || match.text || content;
      }
      // Fallback to first draft if no platform match
      return parsed.drafts[0]?.content || parsed.drafts[0]?.text || content;
    }
    
    // Handle direct { platform, content }
    if (parsed && typeof parsed === 'object' && (parsed.content || parsed.text)) {
      return parsed.content || parsed.text;
    }

    return content;
  } catch {
    return content;
  }
}

/**
 * Group individual drafts by requestId to show documents in dashboard tables.
 */
export function groupDraftsByRequest(drafts: FirestoreDraft[]) {
  const groups: Record<string, {
    id: string;
    title: string;
    platforms: string[];
    status: string;
    generatedAt: any;
    requestId: string;
  }> = {};

  drafts.forEach(draft => {
    const rid = draft.requestId || draft.id;
    if (!groups[rid]) {
      groups[rid] = {
        id: draft.id,
        title: draft.topic || draft.title || "Untitled Document",
        platforms: [],
        status: draft.status,
        generatedAt: draft.generatedAt,
        requestId: rid
      };
    }
    
    // Add platform if not already there
    if (draft.platform && !groups[rid].platforms.includes(draft.platform.toLowerCase())) {
      groups[rid].platforms.push(draft.platform.toLowerCase());
    }
    
    // Status priority: If any are Pending Review, show that. If any are Published, show that.
    const priority = ["Rejected", "Pending Review", "Scheduled", "Published", "Draft"];
    const currentStatusIdx = priority.indexOf(groups[rid].status);
    const newStatusIdx = priority.indexOf(draft.status);
    if (newStatusIdx < currentStatusIdx) {
      groups[rid].status = draft.status;
    }
  });

  return Object.values(groups).sort((a, b) => {
    const dateA = a.generatedAt instanceof Date ? a.generatedAt.getTime() : 0;
    const dateB = b.generatedAt instanceof Date ? b.generatedAt.getTime() : 0;
    return dateB - dateA;
  });
}
