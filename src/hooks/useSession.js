import { useState, useCallback } from 'react';
import {
  fetchAllSessions,
  fetchSessionById,
  createNewSession,
  updateExistingSession,
  deleteExistingSession,
  saveProductDataToSession,
  updateProductStatusInSession
} from '../api/sessions';

export function useSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const sessions = await fetchAllSessions();
      return sessions;
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
      const session = await fetchSessionById(id);
      return session;
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
      const session = await createNewSession(data);
      return session;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSession = useCallback(async (id, data) => {
    try {
      const session = await updateExistingSession(id, data);
      return session;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  const deleteSession = useCallback(async (id) => {
    try {
      await deleteExistingSession(id);
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }, []);

  const saveProductData = useCallback(async (sessionId, productId, data) => {
    try {
      const session = await saveProductDataToSession(sessionId, productId, data);
      return session;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  const updateProductStatus = useCallback(async (sessionId, productId, status, completedBy = '') => {
    try {
      const session = await updateProductStatusInSession(sessionId, productId, status, completedBy);
      return session;
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
