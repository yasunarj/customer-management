import SafeCheckDeleteButton from "@/app/safe/components/SafeCheckDeleteButton";
import { getSafeCheckDetailData } from "@/app/safe/lib/getSafeCheckDetailData";
import { safeMenuList } from "@/app/safe/lib/safeMenuList";
import SheetMenu from "@/components/sheet/SheetMenu";
import SafeCheckEditButton from "@/app/safe/components/SafeCheckEditButton";
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
      <main className="h-screen-vh bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="rounded-xl border border-gray-700 bg-gray-900 p-6 text-center text-gray-700">
            データがありません
          </p>
        </div>
      </main>
    );
  }

  const safeCheckItems = [
    {
      label: "バラ",
      value: safeCheckDetailData.bara,
    },
    {
      label: "一万円",
      value: safeCheckDetailData.yen10000,
    },
    {
      label: "五千円",
      value: safeCheckDetailData.yen5000,
    },
    {
      label: "一千円",
      value: safeCheckDetailData.yen1000,
    },
    {
      label: "500円",
      value: safeCheckDetailData.yen500,
    },
    {
      label: "100円",
      value: safeCheckDetailData.yen100,
    },
    {
      label: "50円",
      value: safeCheckDetailData.yen50,
    },
    {
      label: "10円",
      value: safeCheckDetailData.yen10,
    },
    {
      label: "5円",
      value: safeCheckDetailData.yen5,
    },
    {
      label: "1円",
      value: safeCheckDetailData.yen1,
    },
  ];

  return (
    <main className="h-screen-vh overflow-hidden bg-black px-4 py-4 text-white">
      <div className="mx-auto w-full max-4xl">
        <div className="flex items-center justify-between gap-4 mt-1">
          <div>
            <h1 className="text-2xl font-bold">
              {safeCheckDetailData.date
                ? new Date(safeCheckDetailData.date).toLocaleDateString("ja-JP")
                : ""}{" "}
              精算データ
            </h1>
          </div>
          <div className="text-white">
            <SheetMenu menuList={safeMenuList} />
          </div>
        </div>

        <section className="mt-4 rounded-xl border border-gray-700 bg-gray-900 p-4 sm:p-6">
          <div className="mx-auto max-w-xl space-y-3">
            {safeCheckItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-4 py3"
              >
                <span className="text-gray-300">{item.label}</span>

                <span>
                  {item.value !== null
                    ? item.value.toLocaleString("ja-JP")
                    : "0"}
                  円
                </span>
              </div>
            ))}

            <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-800 px-4 py-4">
              <span className="font-semibold text-gray-200">合計金額</span>
              <span
                className={`text-xl font-bold ${safeCheckDetailData.total !== 30000 ? "text-green-500" : "text-red-500"}`}
              >
                {safeCheckDetailData.total.toLocaleString("ja-JP")}円
              </span>
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <SafeCheckEditButton id={safeCheckDataId} />
              <SafeCheckDeleteButton id={safeCheckDataId} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SafeCheckDetailPage;
// <div className="h-screen-vh overflow-hidden bg-black">
//   <div className="bg-white w-[90%] h-[95%] rounded-xl overflow-y-scroll shadow-2xl">
//     <div className="h-full flex flex-col">
//       <h1 className="relative text-gray-800 text-2xl text-center font-bold mt-4">
//         {safeCheckDetailData.date
//           ? new Date(safeCheckDetailData.date).toLocaleDateString("ja-JP")
//           : ""}{" "}
//         精算データ
//         <div className="absolute top-1 right-4">
//           <SheetMenu menuList={safeMenuList} />
//         </div>
//       </h1>
//       <div className="border-2 border-gray-400 w-[90%] max-w-[520px] mx-auto my-4 flex-1 overflow-y-scroll flex flex-col">
//         <div className="flex flex-col justify-between w-full max-w-[400px] mx-auto  px-4 text-[18px] mt-2 sm:mt-4 flex-1 gap-2">
//           <div className="flex justify-between">
//             <h3>バラ</h3>
//             <p>{safeCheckDetailData.bara}</p>
//           </div>
//           <div className="flex justify-between">
//             <h3>一万円</h3>
//             <p>{safeCheckDetailData.yen10000}</p>
//           </div>
//           <div className="flex justify-between">
//             <h3>五千円</h3>
//             <p>{safeCheckDetailData.yen5000}</p>
//           </div>
//           <div className="flex justify-between">
//             <h3>一千円</h3>
//             <p>{safeCheckDetailData.yen1000}</p>
//           </div>
//           <div className="flex justify-between">
//             <h3>500円</h3>
//             <p>{safeCheckDetailData.yen500}</p>
//           </div>
//           <div className="flex justify-between">
//             <h3>100円</h3>
//             <p>{safeCheckDetailData.yen100}</p>
//           </div>
//           <div className="flex justify-between">
//             <h3>50円</h3>
//             <p>{safeCheckDetailData.yen50}</p>
//           </div>
//           <div className="flex justify-between">
//             <h3>10円</h3>
//             <p>{safeCheckDetailData.yen10}</p>
//           </div>
//           <div className="flex justify-between">
//             <h3>5円</h3>
//             <p>{safeCheckDetailData.yen5}</p>
//           </div>
//           <div className="flex justify-between">
//             <h3>1円</h3>
//             <p>{safeCheckDetailData.yen1}</p>
//           </div>
//           <div className="flex justify-between">
//             <h3>合計金額</h3>
//             <p
//               className={`${
//                 safeCheckDetailData.total !== 300000
//                   ? "text-red-600"
//                   : "text-blue-600"
//               }`}
//             >
//               {safeCheckDetailData.total}
//             </p>
//           </div>
//           <div className="flex justify-center gap-8 my-2 max-w-[400px] mx-auto">
//             <SafeCheckEditButton id={safeCheckDataId} />
//             <SafeCheckDeleteButton id={safeCheckDataId} />
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
