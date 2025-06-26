// Memory optimization utilities
import { useState, useEffect, useMemo, useCallback } from "react";

export const memoryOptimizations = {
  // Debounce function to reduce excessive state updates
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function for scroll/resize events
  throttle: (func, limit) => {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Lazy load images
  lazyLoadImage: (
    src,
    placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PC9zdmc+"
  ) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });
  },

  // Memory-efficient data chunking
  chunkArray: (array, chunkSize = 50) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  },

  // Clean up event listeners
  cleanup: (element, eventType, handler) => {
    element.removeEventListener(eventType, handler);
  },

  // Memory-efficient object comparison
  shallowEqual: (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (obj1[key] !== obj2[key]) return false;
    }
    return true;
  },

  // Memoization helper
  memoize: (fn, getKey = JSON.stringify) => {
    const cache = new Map();
    return (...args) => {
      const key = getKey(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(...args);
      cache.set(key, result);
      return result;
    };
  },

  // Clear cache when memory pressure is high
  clearCache: () => {
    if (typeof window !== "undefined" && "gc" in window) {
      window.gc();
    }
  },

  // Optimize React state updates
  batchStateUpdates: (updates) => {
    return (prevState) => {
      return updates.reduce((newState, update) => {
        if (typeof update === "function") {
          return { ...newState, ...update(newState) };
        }
        return { ...newState, ...update };
      }, prevState);
    };
  },
};

// React-specific memory optimizations
export const reactOptimizations = {
  // Custom hook for memory-efficient API calls
  useOptimizedAPI: (apiCall, deps = []) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const memoizedCall = useMemo(
      () => memoryOptimizations.memoize(apiCall),
      [apiCall]
    );

    useEffect(() => {
      let isMounted = true;
      setLoading(true);

      memoizedCall()
        .then((result) => {
          if (isMounted) {
            setData(result);
            setError(null);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }, [memoizedCall, ...deps]);

    return { data, loading, error };
  },

  // Memory-efficient state management
  useOptimizedState: (initialState) => {
    const [state, setState] = useState(initialState);

    const optimizedSetState = useCallback((update) => {
      setState((prev) => {
        const newState = typeof update === "function" ? update(prev) : update;
        return memoryOptimizations.shallowEqual(prev, newState)
          ? prev
          : newState;
      });
    }, []);

    return [state, optimizedSetState];
  },
};

export default memoryOptimizations;
