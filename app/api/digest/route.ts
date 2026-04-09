import { NextResponse } from 'next/server';
import { generateDailyDigest } from '@/lib/openai';
import { fetchNaverNews } from '@/lib/naver';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CACHE_DOC = 'digest/latest';

function getAdminDb() {
  if (getApps().length === 0) {
    // Use Application Default Credentials or service account
    // For local dev with GOOGLE_APPLICATION_CREDENTIALS set, this works automatically.
    // For Firebase Hosting, it uses the default service account.
    try {
      initializeApp({
        projectId: 'news-aaa9e',
      });
    } catch {
      // already initialized
    }
  }
  return getFirestore();
}

export async function GET() {
  try {
    const db = getAdminDb();
    const docRef = db.doc(CACHE_DOC);
    const snap = await docRef.get();

    if (snap.exists) {
      const cached = snap.data() as { content: string; generatedAt: number };
      const age = Date.now() - cached.generatedAt;
      if (age < CACHE_TTL_MS) {
        return NextResponse.json({
          success: true,
          data: cached.content,
          cached: true,
          cachedAt: cached.generatedAt,
        });
      }
    }

    // Generate fresh digest
    const news = await fetchNaverNews('오늘 뉴스 주요 이슈', 20, 1, 'date');
    const digest = await generateDailyDigest(news);

    // Save to Firestore
    await docRef.set({
      content: digest,
      generatedAt: Date.now(),
    });

    return NextResponse.json({ success: true, data: digest, cached: false });
  } catch (error) {
    console.error('Digest error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate digest' },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Force regenerate (ignores cache)
  try {
    const db = getAdminDb();
    const docRef = db.doc(CACHE_DOC);

    const news = await fetchNaverNews('오늘 뉴스 주요 이슈', 20, 1, 'date');
    const digest = await generateDailyDigest(news);

    await docRef.set({
      content: digest,
      generatedAt: Date.now(),
    });

    return NextResponse.json({ success: true, data: digest, cached: false });
  } catch (error) {
    console.error('Digest force regenerate error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to regenerate digest' },
      { status: 500 }
    );
  }
}
