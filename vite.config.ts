import build from "@hono/vite-build/cloudflare-pages";
import adapter from "@hono/vite-dev-server/cloudflare";
import honox from "honox/vite";
import { defineConfig } from "vite";
// import { mdx } from "@natsuneko-laboratory/honox-mdx-island";

import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const jsxImportSource = "hono/jsx";

// src/plugins/mdx-island.ts
import { compile, type CompileOptions } from "@mdx-js/mdx";
import precinct from "precinct";
import { type Plugin } from "vite";

const mdx = (opts: Readonly<CompileOptions>): Plugin => {
  return {
    name: "mdx-island",
    async transform(source, id) {
      if (id.endsWith(".mdx")) {
        const code = await compile(source, opts);
        const deps = precinct(code.value, { type: "tsx" }) as string[];
        const hasIslands = deps.some((w) => /\/islands\/.*$/.test(w));
        if (hasIslands) {
          return {
            code: `${code.value}\nexport const __importing_islands = true;`,
          };
        }

        return { code: code.value };
      }
    },
  };
};

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
