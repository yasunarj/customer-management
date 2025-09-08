import { expiryMenuList } from "../../lib/expiryMenuList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SheetMenu from "@/components/sheet/SheetMenu";
import { getProductDetailData } from "../../lib/getProductDetailData";
import ProductDeleteButton from "../../components/ProductDeleteButton";

type ProductDetailProps = {
  params: Promise<{ id: string }>;
};

const ProductDetailPage = async (props: ProductDetailProps) => {
  const params = await props.params;
  const { id } = params;
  const productId = parseInt(id, 10);
  const productData = await getProductDetailData(productId);

  if (!productData) {
    return (
      <div className="text-2xl mt-4 text-center h-screen-vh">
        データがありません
      </div>
    );
  }

  return (
    <div className="h-screen-vh overflow-hidden bg-yellow-200 flex justify-center items-center">
      <div className="bg-white w-[90%] h-[95%] rounded-xl overflow-y-scroll shadow-2xl">
        <div className="h-full flex flex-col">
          <h1 className="relative text-gray-800 text-2xl text-center font-bold mt-4">
            商品詳細データ
            <div className="absolute top-1 right-4">
              <SheetMenu menuList={expiryMenuList} />
            </div>
          </h1>
          <div className="border-2 border-gray-400 w-[90%] max-w-[520px] mx-auto my-4 flex-1 overflow-y-scroll flex flex-col">
            <div className="flex flex-col justify-between w-full max-w-[400px] mx-auto py-4 px-4 flex-1 gap-2">
              <div className="border-b-2">
                <h3 className="text-lg text-gray-800 font-bold">商品名</h3>
                <p className="text-end text-sm">{productData.productName}</p>
              </div>
              <div className="border-b-2 flex justify-between items-center">
                <h3 className="text-lg text-gray-800 font-bold">消費期限</h3>
                <p
                  className={`text-end ${
                    new Date() > new Date(productData.expiryDate)
                      ? "text-red-700"
                      : ""
                  }`}
                >
                  {new Date(productData.expiryDate).toLocaleDateString("ja-JP")}
                </p>
              </div>
              <div className="border-b-2 flex justify-between items-center">
                <h3 className="text-lg text-gray-800 font-bold">個数</h3>
                <p className="text-end">{productData.quantity}</p>
              </div>
              <div className="border-b-2 flex justify-between items-center">
                <h3 className="text-lg text-gray-800 font-bold">分類No</h3>
                <p className="text-end">{productData.category}</p>
              </div>
              <div className="border-b-2 flex justify-between items-center">
                <h3 className="text-lg text-gray-800 font-bold">ゴンドラNo</h3>
                <p className="text-end">{productData.gondolaNo}</p>
              </div>
              <div className="border-b-2 flex justify-between items-center">
                <h3 className="text-lg text-gray-800 font-bold">登録者</h3>
                <p className="text-end">{productData.manager}</p>
              </div>
            </div>

            <div className="w-full flex justify-center gap-8 my-2 max-w-[400px] mx-auto">
              <Link
                href={`/expiry/${productId}/edit`}
                className="w-[40%] bg-red-700 rounded-xl"
              >
                <Button className="text-lg w-[100%]">編集</Button>
              </Link>
              <ProductDeleteButton id={productId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
