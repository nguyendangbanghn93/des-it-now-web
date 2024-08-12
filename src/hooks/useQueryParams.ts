import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import qs from "qs";

type SetQueryParams<T> = (
  params: Partial<T> | ((prevParams: T) => Partial<T>)
) => void;

export function useQueryParams<T extends Record<string, any>>(
  initState: T
): [T, SetQueryParams<T>] {
  const [searchParams, setSearchParams] = useSearchParams();

  const queries = {
    ...(initState || {}),
    ...qs.parse(searchParams.toString()),
  } as T;

  const setQueries: SetQueryParams<T> = useCallback(
    (newParams) => {
      const currentParams = qs.parse(searchParams.toString());

      const updatedParams =
        typeof newParams === "function"
          ? { ...newParams(currentParams as T) }
          : { ...newParams };

      setSearchParams(qs.stringify(updatedParams));
    },
    [searchParams, setSearchParams]
  );

  return [queries, setQueries];
}
