import { visit } from "unist-util-visit";

import type { TocHeading } from "@/lib/content/types";

type ElementNode = {
  type: "element";
  tagName: string;
  properties?: { id?: string };
  children: Array<{ type: string; value?: string; children?: ElementNode["children"] }>;
};

export function createRehypeCollectHeadings(headings: TocHeading[]) {
  return () => (tree: ElementNode) => {
    visit(tree, "element", (node: ElementNode) => {
      if (node.tagName !== "h2" && node.tagName !== "h3" && node.tagName !== "h4") {
        return;
      }

      const id = node.properties?.id;
      if (typeof id !== "string" || id.length === 0) return;

      const text = node.children
        .flatMap((child) => {
          if (child.type === "text" && child.value) return child.value;
          if (child.type === "element" && child.children) {
            return child.children
              .filter((c) => c.type === "text" && c.value)
              .map((c) => c.value ?? "");
          }
          return [];
        })
        .join("")
        .trim();

      if (!text) return;

      headings.push({
        id,
        text,
        level: Number(node.tagName.replace("h", "")) as 2 | 3 | 4,
      });
    });
  };
}
