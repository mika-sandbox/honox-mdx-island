import build from "@hono/vite-build/cloudflare-pages";
import adapter from "@hono/vite-dev-server/cloudflare";
import honox from "honox/vite";
import { defineConfig } from "vite";
import { mdx } from "@natsuneko-laboratory/honox-mdx-island";

import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const jsxImportSource = "hono/jsx";

export default defineConfig({
  plugins: [
    honox({ devServer: { adapter } }),
    mdx({
      jsxImportSource,
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    build(),
  ],
});
