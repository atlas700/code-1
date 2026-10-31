import { afterEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ submitter: { form: { requestSubmit: vi.fn() } } }));
vi.mock("react", async (original) => ({ ...await original<typeof import("react")>(), useRef: () => ({ current: mocks.submitter }) }));
import { ConfirmSubmit } from "./confirm-submit";

afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

describe("deactivation confirmation", () => {
  it.each([false, true])("submits only when confirmation is %s", (confirmed) => {
    const confirm = vi.fn(() => confirmed);
    vi.stubGlobal("window", { confirm });
    const control = ConfirmSubmit({ confirmation: "Deactivate Wheat? Its record will be retained.", name: "operation", value: "deactivate-product", formNoValidate: true, children: "Deactivate product" });
    const [trigger, submitter] = control.props.children;
    expect(trigger.props.type).toBe("button");
    trigger.props.onClick();
    expect(confirm).toHaveBeenCalledExactlyOnceWith("Deactivate Wheat? Its record will be retained.");
    expect(mocks.submitter.form.requestSubmit).toHaveBeenCalledTimes(confirmed ? 1 : 0);
    if (confirmed) expect(mocks.submitter.form.requestSubmit).toHaveBeenCalledWith(mocks.submitter);
    expect(submitter.props).toMatchObject({ hidden: true, type: "submit", name: "operation", value: "deactivate-product", formNoValidate: true });
  });
});
