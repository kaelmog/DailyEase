"use client";
import useSWR from "swr";

export default function useReports(token) {
  const fetcher = (url) =>
    fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) =>
      r.json()
    );

  const { data, error, mutate } = useSWR(
    token ? "/api/reports/list" : null,
    fetcher
  );

  return {
    reports: data?.reports || [],
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}
