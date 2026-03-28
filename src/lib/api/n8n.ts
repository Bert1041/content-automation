const N8N_WEBHOOK_BASE = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

export interface Draft {
  id: string;
  fields: {
    Content: string;
    Platform: string;
    Status: string;
    Topic: string;
    RequestId?: string;
    CreationDate?: string;
  };
}

/**
 * Internal helper to perform the fetch with logging
 */
const fetchN8nInternal = async (url: string, options: RequestInit = {}) => {
  const headers = {
    "Content-Type": "application/json",
    "X-Api-Key": process.env.NEXT_PUBLIC_N8N_API_KEY || "",
    ...options.headers,
  };

  console.log(`[n8n] Requesting: ${url}`, { 
    method: options.method || 'GET', 
    body: options.body ? 'JSON Payload' : 'No Body' 
  });

  try {
    const response = await fetch(url, { ...options, headers });
    return response;
  } catch (error) {
    console.error(`[n8n] Fetch Failed for ${url}:`, error);
    throw error;
  }
};

const fetchN8n = async (endpoint: string, options: RequestInit = {}) => {
  if (!N8N_WEBHOOK_BASE) {
    console.error("[n8n] API Base URL missing!");
    throw new Error("API Base URL missing (NEXT_PUBLIC_N8N_WEBHOOK_URL)");
  }
  
  const url = `${N8N_WEBHOOK_BASE}${endpoint}`;
  const response = await fetchN8nInternal(url, options);

  // Handle No Content responses
  if (response.status === 204) {
     return true;
  }

  const text = await response.text();
  let data: any;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[n8n] Response from ${endpoint}:`, data);
  }

  if (!response.ok) {
    // Resilience: If n8n returns an error code but the body says success, we proceed
    if (data && typeof data === 'object' && data.success === true) {
      console.warn(`[n8n] Warning: Received ${response.status} but body indicates success. Proceeding.`);
      return data;
    }
    
    console.error(`[n8n] Error Response (${response.status}):`, text || response.statusText);
    throw new Error(data?.message || `n8n webhook error: ${response.statusText}`);
  }

  return data || true;
};

export const n8nApi = {
  /**
   * Submits a request to generate a new AI draft.
   */
  submitContentRequest: async (payload: {
    topic: string;
    referenceUrls: string;
    creativeGuidelines: string;
    platforms: string[];
    draftCount: string;
    userEmail: string;
  }) => {
    return fetchN8n("/create-content", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Submits a manager's review action for a specific draft.
   */
  submitManagerReview: async (payload: {
    draftId: string;
    action: "approve" | "reject" | "request_revision";
    feedback: string;
    publishDate?: string;
    userEmail: string;
  }) => {
    return fetchN8n("/submit-review", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Universal Rule Manager for SEO and Platform rules.
   * Handles create, read, update, delete actions.
   */
  rulesManager: async (payload: {
    action: "create" | "read" | "update" | "delete";
    table: "SEO_Rules" | "Platform_Rules" | "Email_List";
    role: string;
    id?: string;
    data?: Record<string, unknown>;
    userEmail?: string;
    airtableBaseId?: string;
  }) => {
    const tableIdMap: Record<string, string> = {
      "SEO_Rules": "tblycjU7SwDvSyw8t",
      "Platform_Rules": "tblKK2qvVArl5pHGm",
      "Email_List": "Email_List" // Placeholder or keep as name if ID not provided
    };

    const endpoint = payload.table === "Email_List" ? "/email-list-manager" : "/rules-manager";
 
    return fetchN8n(endpoint, {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        tableId: tableIdMap[payload.table] || payload.table
      }),
    });
  },

  /**
   * Dedicated endpoint for adding multiple emails to the distribution list in one batch.
   */
  addBatchEmails: async (payload: {
    emails: string[];
    userEmail: string;
    role: string;
  }) => {
    return fetchN8n("/add-emails-batch", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetches for the user's personal content manager dashboard.
   */
  fetchDrafts: async (userEmail: string): Promise<Draft[]> => {
    return fetchN8n("/drafts-manager", {
      method: "POST",
      body: JSON.stringify({
        action: "read",
        userEmail: userEmail
      })
    });
  },

  /**
   * Fetches the shared manager review queue.
   */
  fetchReviewQueue: async (userEmail: string): Promise<Draft[]> => {
    return fetchN8n(`/review-queue?email=${encodeURIComponent(userEmail)}`, {
      method: "GET",
    });
  },

  /**
   * Triggers an n8n workflow to send an email with login credentials.
   */
  sendInviteEmail: async (payload: {
    email: string;
    displayName: string;
    role: string;
    temporaryPassword?: string;
    apiKey?: string; // Added API key support
  }) => {
    return fetchN8n("/send-invite-email", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Updates an existing draft's content or status in Airtable.
   */
  updateDraft: async (payload: {
    id: string;
    fields?: {
      Content?: string;
      Status?: string;
      Topic?: string;
    };
    drafts?: Array<{
      platform: string;
      content: string;
    }>;
    userEmail: string;
  }) => {
    return fetchN8n("/drafts-manager", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        action: "update"
      }),
    });
  },

  /**
   * Deletes a draft or a group of drafts from Airtable.
   */
  deleteDraft: async (payload: {
    id?: string;
    requestId?: string;
    userEmail: string;
  }) => {
    return fetchN8n("/drafts-manager", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        action: "delete"
      }),
    });
  },

  /**
   * Submits a consolidated batch of manager decisions.
   */
  submitBatchReview: async (payload: {
    requestId?: string;
    userEmail: string;
    publishStrategy: "immediate" | "schedule";
    publishDate?: string;
    decisions: Array<{
      draftId: string;
      action: string;
      feedback: string;
      platform: string;
      imageDirective?: string;
      imagePlacement?: string;
    }>;
  }) => {
    return fetchN8n("/submit-batch-review", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
