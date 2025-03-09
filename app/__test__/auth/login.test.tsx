import { render, screen, fireEvent, act } from "@testing-library/react";
import LoginPage from "@/app/auth/login/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ data: { session: {} }, error: null }),
      setSession: jest.fn(),
    },
  }),
}));

describe("Loginページ", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    window.alert = jest.fn();
  });

  it("フォームが正しく入力される", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("ログインパスワード")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ログイン" })
    ).toBeInTheDocument();
  });

  it("正しいパスワードを入力するとdashboardかauthLoginページへ遷移する", async() => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("ログインパスワード"), {
      target: { value: process.env.NEXT_PUBLIC_USER_PASSWORD },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    });

    expect(window.alert).toHaveBeenCalledWith("ログインしました");

    expect(mockPush).toHaveBeenCalledWith("/user/dashboard");
  });

  it("間違ったパスワードを入力するとエラーメッセージが表示される", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("ログインパスワード"), {
      target: { value: "wrong_password"}
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    });

    expect(window.alert).toHaveBeenCalledWith("パスワードが間違っています");
  })
});
