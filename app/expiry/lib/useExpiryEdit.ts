"use client";

import useSWR from "swr";
import { ExpiryItem } from "./types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export function useExpiryEdit(id: number, initial: ExpiryItem) {
  const { data, error, isValidating, mutate } = useSWR<ExpiryItem>(
    id ? `/api/expiry/${id}` : null,
    fetcher,
    { fallbackData: initial }
  );

  return {
    item: data,
    loading: !data && !error,
    error,
    isValidating,
    mutate,
  };
}
