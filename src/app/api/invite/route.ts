import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password, displayName, role } = await req.json();
    const adminAuth = await getAdminAuth();
    
    // Create the user
    const generatedPassword = password || Math.random().toString(36).slice(-8) + "A1!";
    const userRecord = await adminAuth.createUser({
      email,
      password: generatedPassword,
      displayName,
    });
    
    // Set custom claims
    await adminAuth.setCustomUserClaims(userRecord.uid, { role });
    
    // Attempt to trigger the n8n webhook to send the welcome email
    try {
      const N8N_WEBHOOK_BASE = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || "http://localhost:5678/webhook";
      await fetch(`${N8N_WEBHOOK_BASE}/send-invite-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          displayName,
          role,
          temporaryPassword: generatedPassword
        }),
      });
    } catch (e) {
      console.error("Failed to trigger n8n invite email webhook", e);
    }
    
    return NextResponse.json({ success: true, uid: userRecord.uid, password: generatedPassword });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
