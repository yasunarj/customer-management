import { getExpiryProductList } from "../lib/getExpiryProductList";
import { expiryMenuList } from "../lib/expiryMenuList";
import SheetMenu from "@/components/sheet/SheetMenu";
import ProductListClient from "./ProductListClient";

const ProductListPage = async () => {
  const raw = await getExpiryProductList();
  const initial = raw.map(r => ({
    ...r,
    expiryDate: new Date(r.expiryDate).toISOString(),
  }))

  return (
    <div className="h-screen-vh overflow-hidden bg-yellow-200 flex justify-center items-center">
      <div className="bg-white w-[98%] h-[98%] max-w-[900px] rounded-xl shadow-2xl">
        <h1 className="relative text-2xl text-gray-800 font-bold text-center mt-4">
          鮮度商品一覧
          <div className="absolute top-1 right-4">
            <SheetMenu menuList={expiryMenuList} />
          </div>
        </h1>

        <ProductListClient initial={initial} />
      </div>
    </div>
  );
};

export default ProductListPage;
