import Link from "next/link";

const SafekeepingCalculationPage = () => {
  return (
    <div className="h-screen-vh bg-blue-200 flex justify-center items-center">
      <div className="flex flex-col gap-24 text-center max-w-[900px] w-[80%] h-[80%] bg-white rounded-xl p-4 ">
        <div className="flex flex-col gap-20 h-full overflow-y-scroll">
          <div>
            <h1 className="text-4xl text-gray-800 mt-4 font-bold">金庫管理</h1>
          </div>
          <div>
            <ul className="flex flex-col gap-8 text-3xl text-blue-700">
              <li className="underline underline-offset-4 hover:text-blue-900">
                <Link href="/safe/input">金庫内金額の入力</Link>
              </li>
              <li className="underline underline-offset-4 hover:text-blue-900">
                <Link href="/safe/history">金庫内金額の表示</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafekeepingCalculationPage;
