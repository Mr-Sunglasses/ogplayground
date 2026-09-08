const DRAFT_KEY = "ogplayground:draft";
const TAB_KEY = "ogplayground:tab";
const URLS_KEY = "ogplayground:recent-urls";
const MAX_URLS = 6;

export function loadDraft(): string | null {
  try {
    const value = localStorage.getItem(DRAFT_KEY);
    return value && value.length <= 50_000 ? value : null;
  } catch {
    return null;
  }
}

export function saveDraft(tags: string) {
  try {
    localStorage.setItem(DRAFT_KEY, tags.slice(0, 50_000));
  } catch {
    // quota / private mode
  }
}

export function loadTab(): string | null {
  try {
    return localStorage.getItem(TAB_KEY);
  } catch {
    return null;
  }
}

export function saveTab(tab: string) {
  try {
    localStorage.setItem(TAB_KEY, tab);
  } catch {
    // ignore
  }
}

export function loadRecentUrls(): string[] {
  try {
    const raw = localStorage.getItem(URLS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string").slice(0, MAX_URLS)
      : [];
  } catch {
    return [];
  }
}

export function pushRecentUrl(url: string): string[] {
  const next = [url, ...loadRecentUrls().filter((item) => item !== url)].slice(
    0,
    MAX_URLS,
  );
  try {
    localStorage.setItem(URLS_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}
