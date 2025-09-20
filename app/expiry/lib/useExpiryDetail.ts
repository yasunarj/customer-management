"use client";
import useSWR from "swr";
import { ExpiryItem } from "./types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export function useExpiryDetail(id: number, initial?: ExpiryItem) {
  const { data, error, isValidating } = useSWR<ExpiryItem>(
    id ? `/api/expiry/${id}` : null,
    fetcher,
    { fallbackData: initial }
  );

  return {
    item: data,
    loading: !data && !error,
    error,
    isValidating,
  };
}


// 理解を深めるために今回書いたuseSWRのファイルを
// 先ほど書いた
// こちらのファイルと照らし合わせて質問をさせてください。

// "use client";
// import useSWR from "swr";
// import { ExpiryItem } from "../lib/types";

// const fetcher = async (url: string) => {
//   const res = await fetch(url);
//   return res.json();
// };

// export function useExpiryList(initial?: ExpiryItem[]) {
//   const key = "/api/expiry?limit=50";
//   const { data, error, isValidating, mutate } = useSWR<{
//     items: ExpiryItem[];
//     nextCursor: number | null;
//   }>(key, fetcher, {
//     revalidateOnFocus: false,
//     keepPreviousData: true,
//     fallbackData: initial ? { items: initial, nextCursor: null } : undefined,
//   });

//   return {
//     items: data?.items ?? [],
//     loading: !data && !error,
//     error,
//     isValidating,
//     mutate,
//   };
// }

// ・今回はkeyを作りませんでしたが、id ? `/api/expiry/${id}` : null,これをfetcherの引数として使用しているということですよね？
// ・前回はnextCursorを使用していましたが、今回は１件に絞られていることから不要ということでしょうか？
// ・fallbackDataは初期表示状態ということでしたでしょうか？