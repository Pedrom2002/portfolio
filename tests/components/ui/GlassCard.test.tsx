import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import GlassCard from "@/components/ui/GlassCard";

describe("<GlassCard />", () => {
  it("renders children inside a glass container", () => {
    render(
      <GlassCard>
        <p>Inner</p>
      </GlassCard>,
    );
    const inner = screen.getByText("Inner");
    expect(inner).toBeInTheDocument();
    const card = inner.parentElement!;
    expect(card.className).toMatch(/glass/);
    expect(card.className).toMatch(/rounded-2xl/);
  });

  it("applies hover-shadow classes when hover=true (default)", () => {
    render(
      <GlassCard>
        <p>x</p>
      </GlassCard>,
    );
    const card = screen.getByText("x").parentElement!;
    expect(card.className).toMatch(/hover:shadow-lg/);
  });

  it("omits hover classes when hover=false", () => {
    render(
      <GlassCard hover={false}>
        <p>x</p>
      </GlassCard>,
    );
    const card = screen.getByText("x").parentElement!;
    expect(card.className).not.toMatch(/hover:shadow-lg/);
  });

  it("merges extra className", () => {
    render(
      <GlassCard className="my-custom-class">
        <p>x</p>
      </GlassCard>,
    );
    const card = screen.getByText("x").parentElement!;
    expect(card.className).toMatch(/my-custom-class/);
  });
});
