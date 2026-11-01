/**
 * GitHub Repo URL parsing and fetching utility
 */

export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
}

export interface FetchedProjectDetails {
  title: string;
  domainTag: string;
  description: string;
  techStack: string[];
  homepage?: string;
}

/**
 * Extracts owner and repo from various GitHub URL formats
 */
export function parseGitHubUrl(url: string): ParsedGitHubUrl | null {
  if (!url) return null;

  // Clean URL
  const trimmed = url.trim().replace(/\.git$/i, "").replace(/\/+$/, "");

  // Match https://github.com/owner/repo or github.com/owner/repo or git@github.com:owner/repo
  const webRegex = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/i;
  const sshRegex = /^git@github\.com:([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)(?:\/.*)?$/i;

  const webMatch = trimmed.match(webRegex);
  if (webMatch) {
    return { owner: webMatch[1], repo: webMatch[2] };
  }

  const sshMatch = trimmed.match(sshRegex);
  if (sshMatch) {
    return { owner: sshMatch[1], repo: sshMatch[2] };
  }

  // Handle bare "owner/repo" input
  const parts = trimmed.split("/").filter(Boolean);
  if (parts.length === 2 && !trimmed.includes(".")) {
    return { owner: parts[0], repo: parts[1] };
  }

  return null;
}

/**
 * Converts repo slug to institutional Title Case / Uppercase format
 * e.g., "smart-campus-navigation" -> "SMART CAMPUS NAVIGATION"
 */
export function formatRepoTitle(repoName: string): string {
  return repoName
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .toUpperCase();
}

/**
 * Extracts the first 2 meaningful sentences from raw Markdown README text
 */
function cleanReadmeExtract(markdown: string): string {
  // Strip code blocks
  const noCode = markdown.replace(/```[\s\S]*?```/g, "");
  // Strip badges e.g. [![...](...)](...)
  const noBadges = noCode.replace(/\[!\[.*?\]\(.*?\)\]\(.*?\)/g, "").replace(/!\[.*?\]\(.*?\)/g, "");
  // Strip HTML tags
  const noHtml = noBadges.replace(/<[^>]*>/g, "");
  // Strip Markdown links [text](url) -> text
  const noLinks = noHtml.replace(/\[(.*?)\]\(.*?\)/g, "$1");
  // Strip Markdown headings (# Heading)
  const noHeadings = noLinks.replace(/^#+\s+.*$/gm, "");

  // Find paragraphs
  const paragraphs = noHeadings
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 30 && !p.startsWith("#") && !p.startsWith("-") && !p.startsWith("*"));

  if (paragraphs.length > 0) {
    const firstPara = paragraphs[0].replace(/\s+/g, " ");
    const sentences = firstPara.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 0) {
      return sentences.slice(0, 2).join(" ").trim();
    }
    return firstPara.slice(0, 220).trim() + "...";
  }

  return "";
}

/**
 * Fetches repository metadata, languages, and readme from GitHub public API
 */
export async function fetchGitHubRepoDetails(url: string): Promise<FetchedProjectDetails> {
  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    throw new Error("Invalid GitHub URL. Use format: https://github.com/owner/repo");
  }

  const { owner, repo } = parsed;

  // 1. Fetch Repository Details
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: { Accept: "application/vnd.github.v3+json" }
  });

  if (!repoRes.ok) {
    if (repoRes.status === 404) {
      throw new Error("Repository not found. Please ensure the repository is public.");
    }
    if (repoRes.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Please try again later or edit manually.");
    }
    throw new Error(`GitHub error: HTTP ${repoRes.status}`);
  }

  const repoData = await repoRes.json();

  // 2. Fetch Languages
  let languages: string[] = [];
  try {
    const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
      headers: { Accept: "application/vnd.github.v3+json" }
    });
    if (langRes.ok) {
      const langData = await langRes.json();
      languages = Object.keys(langData).slice(0, 4);
    }
  } catch {
    // Non-fatal if languages API fails
  }

  // 3. Fallback to README if description is sparse
  let description = repoData.description ? repoData.description.trim() : "";
  if (!description || description.length < 20) {
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
        headers: { Accept: "application/vnd.github.v3+json" }
      });
      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        if (readmeData.content && readmeData.encoding === "base64") {
          // Decode Base64 in browser or node
          const decoded = atob(readmeData.content.replace(/\s/g, ""));
          const extracted = cleanReadmeExtract(decoded);
          if (extracted) {
            description = extracted;
          }
        }
      }
    } catch {
      // Non-fatal
    }
  }

  if (!description) {
    description = `Engineered ${formatRepoTitle(repo)} utilizing ${languages.join(", ") || "modern engineering practices"} for robust performance.`;
  }

  // 4. Derive Domain / Tech Tag
  const topics: string[] = Array.isArray(repoData.topics) ? repoData.topics : [];
  const primaryLang = repoData.language || (languages.length > 0 ? languages[0] : "");
  const primaryTopic = topics.length > 0 ? topics[0].toUpperCase() : "";

  let domainTag = "FULL STACK";
  if (primaryLang && primaryTopic) {
    domainTag = `${primaryTopic} / ${primaryLang.toUpperCase()}`;
  } else if (primaryLang) {
    domainTag = primaryLang.toUpperCase();
  } else if (primaryTopic) {
    domainTag = primaryTopic;
  }

  const techStack = Array.from(new Set([...languages, ...topics.map((t) => t.toUpperCase())]));

  return {
    title: formatRepoTitle(repo),
    domainTag: domainTag.slice(0, 30),
    description,
    techStack,
    homepage: repoData.homepage || undefined
  };
}
