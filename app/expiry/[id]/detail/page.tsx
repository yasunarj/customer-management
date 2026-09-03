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
      <main className="h-screen-vh bg-black px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="rounded-xl border border-gray-700 bg-gray-900 p-6 text-center text-gray-400">
            データがありません
          </p>
        </div>
        データがありません
      </main>
    );
  }
  const initial = {
    ...productData,
    expiryDate: new Date(productData.expiryDate).toISOString(),
  };

  return (
    <div className="h-screen-vh bg-black px-4 py-4 text-white">
      <div className="mx-auto w-full h-[98%] max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="mt-1 text-2xl font-bold">商品詳細データ</h1>
          </div>

          <div className="text-white">
            <SheetMenu menuList={expiryMenuList} />
          </div>

        </div>
          <section className="mt-2 h-[96%] rounded-xl border border-gray-700 bg-gray-900">
            <ProductDetailClient id={productId} initial={initial} />
          </section>
      </div>
    </div>
  );
};

export default ProductDetailPage;
