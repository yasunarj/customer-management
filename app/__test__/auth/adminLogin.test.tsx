import { render, screen, fireEvent, act } from "@testing-library/react";
import AdminLoginPage from "@/app/auth/adminLogin/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockSignInWithPassword = jest.fn();

jest.mock("@/utils/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      setSession: jest.fn(),
    },
  }),
}));

describe("管理者用ログインページ", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    window.alert = jest.fn();
  });

  it("フォームが正しく入力される", () => {
    render(<AdminLoginPage />);

    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "ログイン" })
    ).toBeInTheDocument();
  });

  it("正しいパスワードを入力すると管理者用のダッシュボードページへ遷移する", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { session: {}},
      error: null,
    });

    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "test@gmail.com" },
    });

    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "test_password" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "ログイン" }));
    });

    expect(window.alert).toHaveBeenCalledWith("管理者としてログインしました");
    expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
  });

  it("間違った情報を入力するとエラーメッセージが表示される", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: null,
      error: { message: "ログインに失敗しました"}
    })

    render(<AdminLoginPage />);

    fireEvent.change(screen.getByLabelText("メールアドレス"), {
      target: { value: "wrong@gmail.com" },
    });

    fireEvent.change(screen.getByLabelText("パスワード"), {
      target: { value: "wrong_password" },
    })

    await act(async () => {
      fireEvent.click(screen.getByRole("button", {name: "ログイン"}))
    });

    expect(window.alert).toHaveBeenCalledWith("ログインに失敗しました: ログインに失敗しました");
  });
});
