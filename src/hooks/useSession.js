import { useState, useCallback } from 'react';
import axios from 'axios';

const API = '/api/sessions';

export function useSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API);
      return res.data;
    } catch (e) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSession = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/${id}`);
      return res.data;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(API, data);
      return res.data;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSession = useCallback(async (id, data) => {
    try {
      const res = await axios.put(`${API}/${id}`, data);
      return res.data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  const deleteSession = useCallback(async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  const saveProductData = useCallback(async (sessionId, productId, data) => {
    try {
      const res = await axios.put(`${API}/${sessionId}/products/${productId}`, data);
      return res.data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  const updateProductStatus = useCallback(async (sessionId, productId, status, completedBy = '') => {
    try {
      const res = await axios.patch(`${API}/${sessionId}/products/${productId}/status`, { status, completedBy });
      return res.data;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  return {
    loading,
    error,
    fetchSessions,
    fetchSession,
    createSession,
    updateSession,
    deleteSession,
    saveProductData,
    updateProductStatus
  };
}

export function calcCompleteness(productData) {
  if (!productData) return 0;
  let score = 0;
  const checks = [
    productData.northStar?.currentValue,
    productData.revenue?.total,
    productData.northStar?.executiveHighlight,
    productData.traffic?.totalSessions,
    productData.productDev?.features?.length > 0,
    productData.marketing?.highlights,
  ];
  checks.forEach(c => { if (c) score++; });
  return Math.round((score / checks.length) * 100);
}
