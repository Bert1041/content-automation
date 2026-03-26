import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const listUsersResult = await adminAuth.listUsers(1000);
    const users = listUsersResult.users.map((record) => ({
      uid: record.uid,
      email: record.email,
      displayName: record.displayName,
      role: record.customClaims?.role || "Content Manager",
      metadata: record.metadata,
      disabled: record.disabled,
    }));
    return NextResponse.json({ users });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 });
    }

    await adminAuth.deleteUser(uid);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
