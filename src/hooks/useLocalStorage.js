// src/hooks/useLocalStorage.js
import { useState, useEffect } from "react";

/**
 * useLocalStorage - Persist state to localStorage
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value
 * @returns [storedValue, setValue]
 */
export default function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage (lazy init)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("useLocalStorage error reading key:", key, error);
      return initialValue;
    }
  });

  // Update localStorage whenever state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn("useLocalStorage error setting key:", key, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
