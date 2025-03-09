import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import CreateForm from "@/components/form/CreateForm";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe("CreateForm", () => {
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    (global.fetch as jest.Mock).mockClear();
  });

  it("フォームが正しく表示される", () => {
    render(<CreateForm type="test_type" />);

    expect(screen.getByLabelText("お客様名")).toBeInTheDocument();
    expect(screen.getByLabelText("電話番号")).toBeInTheDocument();
    expect(screen.getByLabelText("商品名")).toBeInTheDocument();
    expect(screen.getByLabelText("合計金額")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "登録する" })
    ).toBeInTheDocument();
  });

  it("未入力のまま送信するとエラーメッセージが表示される", async () => {
    render(<CreateForm type="test_type" />);

    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await screen.findByText("名前を入力してください");
    await screen.findByText("商品名を入力してください");
    await screen.findByText("価格を入力してください");
  });

  it("正しいデータを入力するとAPIに送信されページ遷移する", async () => {
    render(<CreateForm type="test_type" />);

    fireEvent.change(screen.getByLabelText("お客様名"), {
      target: { value: "テストユーザー" },
    });
    fireEvent.change(screen.getByLabelText("電話番号"), {
      target: { value: "09012345678" },
    });
    fireEvent.change(screen.getByLabelText("商品名"), {
      target: { value: "テスト商品" },
    });
    fireEvent.change(screen.getByLabelText("合計金額"), {
      target: { value: "3000" },
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    fireEvent.click(screen.getByRole("button", { name: "登録する" }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/reservation",
      expect.objectContaining({ method: "POST" })
    );

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith("/admin/test_type/list")
    );
  });

  it("APIが失敗した場合、エラーメッセージが表示される", async () => {
    render(<CreateForm type="test-type" />);

    fireEvent.change(screen.getByLabelText("お客様名"), {
      target: { value: "テストユーザー" },
    });
    fireEvent.change(screen.getByLabelText("商品名"), {
      target: { value: "テスト商品" },
    });
    fireEvent.change(screen.getByLabelText("合計金額"), {
      target: { value: "5000" },
    });

    // ✅ API 失敗時のレスポンスをモック
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms 待機
        return { message: "登録できませんでした" };
      },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "登録する" }));
    });

    // ✅ エラーメッセージが表示されるまで待つ
    await waitFor(() => {
      const errorMessage = screen.queryByText("登録できませんでした");
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
