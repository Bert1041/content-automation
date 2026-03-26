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
 * Helper to make requests to n8n webhooks
 */
const fetchN8n = async (endpoint: string, options: RequestInit = {}) => {
  if (!N8N_WEBHOOK_BASE) throw new Error("API Base URL missing (NEXT_PUBLIC_N8N_WEBHOOK_URL)");
  const url = `${N8N_WEBHOOK_BASE}${endpoint}`;
  
  // In a real app we would pass an auth token here
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error(`n8n webhook error: ${response.statusText}`);
  }

  // Handle No Content responses
  if (response.status === 204) {
     return true;
  }

  return response.json();
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
    table: "SEO_Rules" | "Platform_Rules";
    role: string;
    id?: string;
    data?: Record<string, unknown>;
    userEmail?: string;
  }) => {
    return fetchN8n("/rules-manager", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Fetches the current list of drafts from Airtable via n8n.
   * (Mock data is currently preserved in the UI per user request, 
   * but this endpoint is ready for integration)
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
    fields: {
      Content?: string;
      Status?: string;
      Topic?: string;
    };
    userEmail: string;
  }) => {
    return fetchN8n("/update-draft", {
      method: "POST",
      body: JSON.stringify(payload),
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
    return fetchN8n("/delete-draft", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
