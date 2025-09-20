"use client";
import useSWR from "swr";
import { ExpiryItem } from "../lib/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export function useExpiryList(initial?: ExpiryItem[]) {
  const key = "/api/expiry?limit=50";
  const { data, error, isValidating, mutate } = useSWR<{
    items: ExpiryItem[];
    nextCursor: number | null;
  }>(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
    fallbackData: initial ? { items: initial, nextCursor: null } : undefined,
  });

  return {
    items: data?.items ?? [],
    loading: !data && !error,
    error,
    isValidating,
    mutate,
  };
}


