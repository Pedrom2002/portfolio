import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import GradientText from "@/components/ui/GradientText";

describe("<GradientText />", () => {
  it("renders children with the gradient-text class by default in a span", () => {
    render(<GradientText>Hello</GradientText>);
    const el = screen.getByText("Hello");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveClass("gradient-text");
  });

  it.each(["h1", "h2", "h3", "p"] as const)(
    "renders as %s when as=%s",
    (tag) => {
      render(<GradientText as={tag}>Heading</GradientText>);
      const el = screen.getByText("Heading");
      expect(el.tagName).toBe(tag.toUpperCase());
    },
  );

  it("merges extra className", () => {
    render(<GradientText className="text-4xl">x</GradientText>);
    expect(screen.getByText("x")).toHaveClass("gradient-text", "text-4xl");
  });
});
