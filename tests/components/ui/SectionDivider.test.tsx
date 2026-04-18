import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import SectionDivider from "@/components/ui/SectionDivider";

describe("<SectionDivider />", () => {
  it("renders a 3-part divider with the diamond accent", () => {
    const { container } = render(<SectionDivider />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex", "items-center", "justify-center");
    // 1 left line + 1 diamond + 1 right line = 3 children
    expect(wrapper.children).toHaveLength(3);
    // diamond has rotate
    expect(wrapper.children[1].className).toMatch(/rotate-45/);
  });
});
