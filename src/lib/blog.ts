export const BLOG_ARTICLE_SLUGS = [
  "sahl-hasheesh-excursions",
  "el-gouna-excursions-guide",
  "sharm-airport-transfer",
  "top-places-to-visit-egypt",
] as const;

export type BlogArticleSlug = (typeof BLOG_ARTICLE_SLUGS)[number];

export function isBlogArticleSlug(slug: string): slug is BlogArticleSlug {
  return (BLOG_ARTICLE_SLUGS as readonly string[]).includes(slug);
}
