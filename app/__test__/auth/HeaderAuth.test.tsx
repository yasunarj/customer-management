import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import Header from "@/components/header/Header";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@/utils/supabase/client", () => ({
  createClient: jest.fn(),
}));

describe("HeaderAuth", () => {
  let mockPush: jest.Mock;
  let mockSignOut: jest.Mock;
  let mockGetUser: jest.Mock;
  let mockPathname: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    mockSignOut = jest
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ error: null }), 500)
          )
      );
    mockGetUser = jest.fn().mockResolvedValue({
      data: { user: { user_metadata: { role: "user" } } },
    });
    mockPathname = jest.fn().mockReturnValue("/");

    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    (usePathname as jest.Mock).mockImplementation(mockPathname);

    (createClient as jest.Mock).mockReturnValue({
      auth: {
        signOut: mockSignOut,
        getUser: mockGetUser,
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
      },
    });

    window.alert = jest.fn();
  });

  it("ログインしていない場合に、ログインリンクが表示される", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
    });

    render(<Header />);
    expect(await screen.findByText("ログイン")).toBeInTheDocument();
    expect(screen.queryByText("ログアウト")).not.toBeInTheDocument();
  });

  it("ログインしている場合に、ログアウトボタンが表示される", async () => {
    render(<Header />);
    expect(await screen.findByText("ログアウト")).toBeInTheDocument();
    expect(screen.queryByText("ログイン")).not.toBeInTheDocument();
  });

  it("ログアウトボタンを実行するとログアウト処理が実行される", async () => {
    render(<Header />);
    const logoutButton = await screen.findByText("ログアウト");
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("ログアウト実行中にローディングが表示される", async () => {
    render(<Header />);
    const logoutButton = await screen.findByText("ログアウト");
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    expect(await screen.findByText("ログアウト中...")).toBeInTheDocument();
  });

  it("ログアウトが失敗した場合に,エラーメッセージが表示される", async () => {
    mockSignOut.mockResolvedValue({ error: { message: "失敗" } });
    render(<Header />);
    const logoutButton = await screen.findByText("ログアウト");
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "ログアウトに失敗しました: 失敗"
      );
    });
  });
});
