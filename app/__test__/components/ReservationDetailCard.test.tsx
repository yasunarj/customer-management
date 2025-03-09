import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ReservationDetailCard from "@/components/detail/reservationCard";
import { updateReservation } from "@/utils/api";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";
import { Reservation } from "@/types/reservation";
import DeleteButton from "@/components/button/DeleteButton";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/utils/api", () => ({
  updateReservation: jest.fn().mockResolvedValue(undefined),
}));

describe("ReservationDetailCard", () => {
  let mockPush: jest.Mock;
  let mockRefresh: jest.Mock;

  const mockReservation: Reservation = {
    id: 1,
    customer: { id: 1, name: "テストユーザー", phone: "09012345678" },
    productName: "テスト商品",
    price: 1000,
    reservationDate: new Date("2025-1-1"),
    deliveryDate: new Date("2025-1-5"),
    type: "test_type",
  };
  beforeEach(() => {
    mockPush = jest.fn();
    mockRefresh = jest.fn();
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    window.alert = jest.fn();
    window.confirm = jest.fn();
  });

  it("初期表示が正しく表示されているか", () => {
    render(
      <ReservationDetailCard
        reservationData={mockReservation}
        decodeType="test_type"
      />
    );

    expect(screen.getByText("テストユーザー")).toBeInTheDocument();
    expect(screen.getByText("09012345678")).toBeInTheDocument();
    expect(screen.getByText("・テスト商品")).toBeInTheDocument();
    expect(screen.getByText("¥1000")).toBeInTheDocument();
    expect(screen.getByText("2025/1/1")).toBeInTheDocument();
    expect(screen.getByText("2025/1/5")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "編集" })).toBeInTheDocument();
  });

  it("編集ボタンを押すとフォームが表示される", async () => {
    render(
      <ReservationDetailCard
        reservationData={mockReservation}
        decodeType="test_type"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "編集" }));

    expect(screen.getByLabelText("お名前")).toHaveValue("テストユーザー");
    expect(screen.getByLabelText("電話番号")).toHaveValue("09012345678");
    expect(screen.getByLabelText("商品名")).toHaveValue("テスト商品");
    expect(screen.getByLabelText("合計金額")).toHaveValue("1000");
  });

  it("保存ボタンを押すとupdateReservationが呼ばれる", async () => {
    render(
      <ReservationDetailCard
        reservationData={mockReservation}
        decodeType="test_type"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "編集" }));
    fireEvent.change(screen.getByRole("textbox", { name: "商品名" }), {
      target: {
        value: "編集後の商品名",
      },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "保存" }));
    });

    expect(updateReservation).toHaveBeenCalledWith(
      "1",
      expect.objectContaining({ productName: "編集後の商品名" })
    );

    expect(window.alert).toHaveBeenCalledWith("登録しました");
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it("キャンセルボタンを押すと編集モードがキャンセルされる", async () => {
    render(
      <ReservationDetailCard
        reservationData={mockReservation}
        decodeType="test-type"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "編集" }));
    fireEvent.change(screen.getByRole("textbox", { name: "商品名" }), {
      target: { value: "編集後の商品" },
    });

    expect(screen.getByRole("textbox", { name: "商品名" })).toHaveValue(
      "編集後の商品"
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "戻る" }));
    });

    await waitFor(() => {
      expect(screen.getByText("・テスト商品")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("textbox", { name: "商品名" })
    ).not.toBeInTheDocument();
  });

  it("削除ボタンを押すと削除処理が実行される", async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);

    render(<DeleteButton id={1} type="test_type" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "削除" }));
    });

    expect(window.confirm).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/reservation/1`),
      expect.objectContaining({ method: "DELETE" })
    );

    expect(window.alert).toHaveBeenCalledWith("データを削除しました");
    expect(mockPush).toHaveBeenCalledWith("/admin/test_type/list");
  });

  it("削除確認をキャンセルした場合に、削除処理が実行されない", () => {
    render(<DeleteButton id={1} type="test_type" />);

    (window.confirm as jest.Mock).mockReturnValue(false);

    fireEvent.click(screen.getByRole("button", { name: "削除" }));

    expect(window.confirm).toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("削除APIが失敗した場合、エラーメッセージが表示される", async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "データが削除できませんでした" }),
    });

    render(<DeleteButton id={1} type="test_type" />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "削除" }));
    });

    expect(window.alert).toHaveBeenCalledWith("データが削除できませんでした");
    expect(mockPush).not.toHaveBeenCalled();
  });
});
