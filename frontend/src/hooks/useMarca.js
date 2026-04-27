import { useState, useEffect, useCallback } from 'react';

const API = '/api/marca';

export function useMarca() {
  const [marca, setMarca]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState(null);

  const fetchMarca = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      const json = await res.json();
      setMarca(json.data || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMarca(); }, [fetchMarca]);

  const saveMarca = useCallback(async (data) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        setMarca(json.data);
        return json.data;
      } else {
        throw new Error(json.error || 'Error al guardar');
      }
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  return { marca, loading, saving, error, saveMarca, refetch: fetchMarca };
}
