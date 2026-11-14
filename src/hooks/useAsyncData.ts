import { useEffect, useState, type DependencyList } from "react";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Runs an async loader (for example a Firestore query) and tracks loading / error / data.
export const useAsyncData = <T,>(loader: () => Promise<T>, deps: DependencyList) => {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    loader()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Error inesperado.";
          setState({ data: null, loading: false, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const reload = () => setVersion((v) => v + 1);

  return { ...state, reload };
};
