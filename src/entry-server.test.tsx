// @vitest-environment node

import { describe, expect, it } from "vitest";
import { render } from "./entry-server";

describe("server prerender entry", () => {
  it("renders meaningful page content for crawlers", () => {
    const html = render();

    expect(html).toContain("<main");
    expect(html).toContain("Արեն և Ադելինա");
    expect(html).toContain("Սիրելի հարազատներ և ընկերներ");
    expect(html).toContain("Օրվա ծրագիրը");
    expect(html).toContain("Մասնակցության հաստատում");
  });
});
