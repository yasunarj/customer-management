import { expiryMenuList } from "../../lib/expiryMenuList";
import SheetMenu from "@/components/sheet/SheetMenu";
import { getProductDetailData } from "../../lib/getProductDetailData";
import ProductDetailClient from "./ProductDetailClient";

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
  const initial = {
    ...productData,
    expiryDate: new Date(productData.expiryDate).toISOString(),
  };

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
          <ProductDetailClient id={productId} initial={initial} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
