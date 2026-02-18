import { NextResponse } from "next/server";

const API_KEY = "J4pLDI6Z.7nOPf7dyfKFugzC66SXiZk1BYKPyyHgU";
const BASE_URL = "https://api.ultravox.ai/api/calls";
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes
const PAGE_SIZE = 100;

// In-memory server-side cache
let cache: {
    data: unknown[] | null;
    fetchedAt: number;
    promise: Promise<unknown[]> | null;
} = {
    data: null,
    fetchedAt: 0,
    promise: null,
};

async function fetchPage(url: string): Promise<{ results: unknown[]; next: string | null; count?: number }> {
    const response = await fetch(url, {
        headers: {
            "X-API-Key": API_KEY,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Ultravox API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

async function fetchAllCallsFromUltravox(): Promise<unknown[]> {
    // Step 1: Fetch the first page to get total count and first batch
    const firstPage = await fetchPage(`${BASE_URL}?limit=${PAGE_SIZE}`);
    const allCalls: unknown[] = [...firstPage.results];

    if (!firstPage.next) {
        return allCalls;
    }

    // Step 2: If there's a total count, calculate remaining pages and fetch in parallel
    if (firstPage.count && firstPage.count > PAGE_SIZE) {
        const totalPages = Math.ceil(firstPage.count / PAGE_SIZE);
        const remainingPages = totalPages - 1;

        // Build all page URLs using offset-based pagination
        const pageUrls: string[] = [];
        for (let i = 1; i < totalPages; i++) {
            pageUrls.push(`${BASE_URL}?limit=${PAGE_SIZE}&offset=${i * PAGE_SIZE}`);
        }

        // Fetch all remaining pages in parallel (batches of 10 to avoid rate limits)
        const BATCH_SIZE = 10;
        for (let i = 0; i < pageUrls.length; i += BATCH_SIZE) {
            const batch = pageUrls.slice(i, i + BATCH_SIZE);
            const results = await Promise.all(batch.map(fetchPage));
            for (const page of results) {
                allCalls.push(...page.results);
            }
        }
    } else {
        // Fallback: cursor-based sequential pagination
        let nextUrl: string | null = firstPage.next;
        while (nextUrl) {
            const page = await fetchPage(nextUrl);
            allCalls.push(...page.results);
            nextUrl = page.next;
        }
    }

    return allCalls;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "1";
    const now = Date.now();

    // Return cached data if still fresh
    if (!forceRefresh && cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
        return NextResponse.json({
            results: cache.data,
            count: cache.data.length,
            cached: true,
            cachedAt: new Date(cache.fetchedAt).toISOString(),
        });
    }

    // If a fetch is already in progress, wait for it (deduplication)
    if (cache.promise) {
        try {
            const data = await cache.promise;
            return NextResponse.json({
                results: data,
                count: data.length,
                cached: true,
                cachedAt: new Date(cache.fetchedAt).toISOString(),
            });
        } catch {
            return NextResponse.json(
                { error: "Failed to fetch from Ultravox API" },
                { status: 500 }
            );
        }
    }

    // Start a new fetch
    cache.promise = fetchAllCallsFromUltravox();

    try {
        const data = await cache.promise;
        cache.data = data;
        cache.fetchedAt = Date.now();
        cache.promise = null;

        return NextResponse.json({
            results: data,
            count: data.length,
            cached: false,
            cachedAt: new Date(cache.fetchedAt).toISOString(),
        });
    } catch (error) {
        cache.promise = null;
        console.error("Failed to fetch all calls:", error);

        // Return stale data if available
        if (cache.data) {
            return NextResponse.json({
                results: cache.data,
                count: cache.data.length,
                cached: true,
                stale: true,
                cachedAt: new Date(cache.fetchedAt).toISOString(),
            });
        }

        return NextResponse.json(
            { error: "Failed to fetch from Ultravox API" },
            { status: 500 }
        );
    }
}
