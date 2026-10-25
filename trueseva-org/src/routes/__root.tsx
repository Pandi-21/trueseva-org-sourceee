import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HelpHomesIndia — Support Care for All Homes in Tamil Nadu | TAFVA Verified" },
      { name: "description", content: "Directly support 10 verified Care for All Homes across 10 districts in Tamil Nadu with new clothing, kitchen groceries & medical aid. Zero commission, field verified by TAFVA." },
      { name: "keywords", content: "care for all homes, elderly care homes tamil nadu, old age homes tamil nadu, donate to old age homes, direct elder care support, tafva tamil nadu, helphomesindia, elderly care theni madurai chennai, transparent charity tamil nadu" },
      { name: "author", content: "HelpHomesIndia Initiative & TAFVA" },
      { name: "publisher", content: "Tamil Nadu Federation of Voluntary Agencies (TAFVA)" },
      { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
      { name: "geo.region", content: "IN-TN" },
      { name: "geo.placename", content: "Tamil Nadu, India" },
      { name: "geo.position", content: "11.127123;78.656894" },
      { name: "ICBM", content: "11.127123, 78.656894" },
      { property: "og:site_name", content: "HelpHomesIndia" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_IN" },
      { property: "og:url", content: "https://helphomesindia.org" },
      { property: "og:title", content: "HelpHomesIndia — Support Care for All Homes in Tamil Nadu | TAFVA Verified" },
      { property: "og:description", content: "Directly support 10 verified Care for All Homes across 10 districts in Tamil Nadu. 100% direct giving with zero middlemen or commission." },
      { property: "og:image", content: "https://helphomesindia.org/hero.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "HelpHomesIndia — TAFVA Verified Orphanages Homes in Tamil Nadu" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "HelpHomesIndia — Support Care for All Homes in Tamil Nadu" },
      { name: "twitter:description", content: "Directly support 10 verified Care for All Homes across 10 districts in Tamil Nadu. Field verified by TAFVA." },
      { name: "twitter:image", content: "https://helphomesindia.org/hero.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://helphomesindia.org" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preload", as: "style", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "shortcut icon", type: "image/png", href: "/logo.png" },
      { rel: "apple-touch-icon", href: "/logo.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <HeadContent />
      </head>
      <body className="overflow-x-hidden min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
