import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import superjson from "superjson";
import type { AppRouter } from "../../api/router";
import type { ReactNode } from "react";
import { getMockResponse } from "@/lib/mockData";

export const trpc = createTRPCReact<AppRouter>();

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      // Override fetch to return mock data directly (no real API)
      fetch: async (_url, options) => {
        try {
          const realRes = await globalThis.fetch(_url, options ?? {});
          if (realRes.ok) return realRes;
        } catch {
          // API unavailable - use mock
        }

        // Extract path from URL: /api/trpc/menu.categories
        const urlStr = _url.toString();
        const pathMatch = urlStr.match(/\/api\/trpc\/(.+)$/);
        const path = pathMatch ? pathMatch[1] : "";

        // Parse input from body (superjson serialized)
        let input: any = {};
        const body = options?.body;
        if (body && typeof body === "string") {
          try {
            const parsed = JSON.parse(body);
            input = parsed.json ?? {};
          } catch { /* ignore */ }
        }

        // Get mock data
        const mockData = getMockResponse(path, input);
        const serialized = superjson.serialize(mockData);

        return new Response(
          JSON.stringify([{ result: { data: serialized } }]),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      },
    }),
  ],
});

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
