import { getExpiryProductList } from "../lib/getExpiryProductList";
import { expiryMenuList } from "../lib/expiryMenuList";
import SheetMenu from "@/components/sheet/SheetMenu";
import ProductListClient from "./ProductListClient";

const ProductListPage = async () => {
  const raw = await getExpiryProductList();
  const initial = raw.map((r) => ({
    ...r,
    expiryDate: new Date(r.expiryDate).toISOString(),
  }));

  return (
    <main className="h-screen-vh bg-black px-4 py-8 text-white overflow-hidden">
      <div className="mx-auto h-full w-full max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="mt-1 text-2xl font-bold">鮮度商品一覧</h1>
          </div>

          <div className="text-white">
            <SheetMenu menuList={expiryMenuList} />
          </div>
        </div>

        <section className="mt-2 h-[96%] rounded-xl border border-gray-700 bg-gray-900">
          <ProductListClient initial={initial} />
        </section>
      </div>
    </main>
  );
};

export default ProductListPage;
