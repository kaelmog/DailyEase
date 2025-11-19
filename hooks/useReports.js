import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function useReports(params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const paramString = JSON.stringify(params);

  useEffect(() => {
    mounted.current = true;

    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: rows, error } = await supabase
          .from('reports')
          .select('id,title,amount,created_at,user_id')
          .limit(100)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (mounted.current) setData(rows || []);
      } catch (err) {
        console.error('[useReports] fetch error', err);
        if (mounted.current) setError(err);
      } finally {
        if (mounted.current) setLoading(false);
      }
    };

    fetchReports();

    return () => { mounted.current = false; };
  }, [paramString]);

  return { data, loading, error };
}
