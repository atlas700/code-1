import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const locale = vi.hoisted(() => ({ direction: "ltr" }));
vi.mock("gt-next", () => ({ useLocaleDirection: () => locale.direction }));
import { Select, SelectTrigger, SelectValue } from "./select";

afterEach(() => { locale.direction = "ltr"; });

describe("localized select direction", () => {
  it.each(["ltr", "rtl"])("sets the trigger direction from the %s locale", (direction) => {
    locale.direction = direction;
    const html = renderToStaticMarkup(<Select><SelectTrigger aria-label="Role"><SelectValue /></SelectTrigger></Select>);
    expect(html).toMatch(new RegExp(`<button[^>]*dir="${direction}"`));
  });
});
