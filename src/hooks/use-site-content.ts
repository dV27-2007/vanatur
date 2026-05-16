import { useState, useEffect } from "react";
import { fetchSiteContent } from "@/services/api";
import type { SiteContent } from "@/types";

interface UseSiteContentResult {
  content: SiteContent | null;
  loading: boolean;
  error: string | null;
}

export function useSiteContent(): UseSiteContentResult {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchSiteContent()
      .then((data) => {
        if (!cancelled) {
          setContent(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load content.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { content, loading, error };
}
