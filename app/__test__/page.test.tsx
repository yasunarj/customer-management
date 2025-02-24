import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../page";

describe("Homeページ", () => {
  it("Homeページが正しくレンダリングされる", () => {
    render(<Home />);

    expect(screen.getByText("地域No1のお店を作り")).toBeInTheDocument();
    expect(screen.getByText("お客様には最高の満足を")).toBeInTheDocument();

    const button = screen.getByRole("link", { name: "予約商材一覧へ" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/auth/login");
  });
})