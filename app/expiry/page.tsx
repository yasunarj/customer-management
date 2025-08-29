import Link from "next/link";

const ExpiryPage = () => {
  return (
    <div className="h-screen-vh bg-yellow-200 flex justify-center items-center">
      <div className="flex flex-col gap-24 text-center max-w-[900px] w-[90%] h-[95%] bg-white rounded-xl p-4">
        <div className="flex flex-col gap-20 h-full overflow-y-scroll items-center mt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl text-gray-800 font-bold">鮮度商品管理</h1>
            <p className="text-2xl">(長期)</p>
          </div>
          <div>
            <ul className="flex flex-col gap-8 text-3xl text-blue-700">
              <li className="underline underline-offset-4 hover:text-blue-900">
                <Link href="/expiry/input">商品の登録</Link>
              </li>
              <li className="underline underline-offset-4 hover:text-blue-900">
                <Link href="/expiry/productList">登録商品の一覧</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiryPage;
