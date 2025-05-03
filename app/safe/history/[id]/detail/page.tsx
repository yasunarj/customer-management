import SafeCheckDeleteButton from "@/app/safe/components/SafeCheckDeleteButton";
import { getSafeCheckDetailData } from "@/app/safe/lib/getSafeCheckDetailData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
type SafeCheckDetailPage = {
  params: Promise<{ id: string }>;
};

const SafeCheckDetailPage = async (props: SafeCheckDetailPage) => {
  const params = await props.params;
  const { id } = params;
  const safeCheckDataId = parseInt(id, 10);
  const safeCheckDetailData = await getSafeCheckDetailData(safeCheckDataId);

  if (!safeCheckDetailData) {
    return (
      <div className="text-2xl mt-4 text-center h-screen-vh">
        データがありません
      </div>
    );
  }

  return (
    <div className="h-screen-vh overflow-hidden bg-blue-200 flex justify-center items-center">
      <div className="bg-white w-[90%] h-[95%] rounded-xl overflow-y-scroll shadow-2xl">
        <h1 className="text-gray-800 text-2xl text-center font-bold mt-4">
          {safeCheckDetailData.date
            ? new Date(safeCheckDetailData.date).toLocaleDateString("ja-JP")
            : ""}{" "}
          精算データ
        </h1>
        <div className="border-2 border-gray-400 w-[90%] max-w-[520px] h-[88%] mx-auto mt-4">
          <div className="flex flex-col justify-between  max-w-[400px] h-[88%] mx-auto  px-4 text-[18px] mt-2 sm:mt-4 border-2">
            <div className="flex justify-between">
              <h3>バラ</h3>
              <p>{safeCheckDetailData.bara}</p>
            </div>
            <div className="flex justify-between">
              <h3>一万円</h3>
              <p>{safeCheckDetailData.yen10000}</p>
            </div>
            <div className="flex justify-between">
              <h3>五千円</h3>
              <p>{safeCheckDetailData.yen5000}</p>
            </div>
            <div className="flex justify-between">
              <h3>一千円</h3>
              <p>{safeCheckDetailData.yen1000}</p>
            </div>
            <div className="flex justify-between">
              <h3>500円</h3>
              <p>{safeCheckDetailData.yen500}</p>
            </div>
            <div className="flex justify-between">
              <h3>100円</h3>
              <p>{safeCheckDetailData.yen100}</p>
            </div>
            <div className="flex justify-between">
              <h3>50円</h3>
              <p>{safeCheckDetailData.yen50}</p>
            </div>
            <div className="flex justify-between">
              <h3>10円</h3>
              <p>{safeCheckDetailData.yen10}</p>
            </div>
            <div className="flex justify-between">
              <h3>5円</h3>
              <p>{safeCheckDetailData.yen5}</p>
            </div>
            <div className="flex justify-between">
              <h3>1円</h3>
              <p>{safeCheckDetailData.yen1}</p>
            </div>
            <div className="flex justify-between">
              <h3>合計金額</h3>
              <p
                className={`${
                  safeCheckDetailData.total !== 300000
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {safeCheckDetailData.total}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-4 max-w-[400px] mx-auto">
            <Link
              href={`/safe/history/${safeCheckDataId}/edit`}
              className="w-[30%]"
            >
              <Button className="text-lg w-[100%]">編集</Button>
            </Link>
            <SafeCheckDeleteButton id={safeCheckDataId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeCheckDetailPage;
