import InputForm from "../components/InputForm";

const SafekeepingCalculationInputPage = () => {
  return (
    <div className="flex justify-center items-center h-screen-vh bg-blue-200 overflow-y-hidden">
      <div className="bg-white max-w-[900px] w-[90%] h-[98%] rounded-xl p-2 shadow-2xl">
        {/* タイトル */}
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl mt-2 font-bold text-gray-800">
            金額入力フォーム
          </h1>
          <p>入力後、送信ボタンを押してください</p>
        </div>
        {/* 計算入力セクション */}
        <div className="h-[100%]">
          <InputForm />
        </div>
      </div>
    </div>
  );
};

export default SafekeepingCalculationInputPage;
