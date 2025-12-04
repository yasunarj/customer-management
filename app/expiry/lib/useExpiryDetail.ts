"use client";
import useSWR from "swr";
import { ExpiryItem } from "./types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export function useExpiryDetail(id: number, initial?: ExpiryItem) {
  const { data, error, isValidating } = useSWR<ExpiryItem>(
    id ? `/api/expiry/${String(id)}` : null,
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


// 