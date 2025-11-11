"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useSupabaseData() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            "id, name, unit, sort_order, product_categories(id, name, sort_order)"
          )
          .order("sort_order", {
            ascending: true,
            referencedTable: "product_categories",
          })
          .order("sort_order", { ascending: true });

        if (error) throw error;
        if (!mounted) return;

        setProducts(data || []);

        const catMap = {};
        (data || []).forEach((p) => {
          const c = p.product_categories;
          if (c && !catMap[c.id]) catMap[c.id] = c;
        });
        const cats = Object.values(catMap).sort(
          (a, b) => a.sort_order - b.sort_order
        );
        setCategories(cats);
      } catch (err) {
        setError(err);
        console.error("useSupabaseData:", err);
      } finally {
        setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  return { products, categories, loading, error };
}
