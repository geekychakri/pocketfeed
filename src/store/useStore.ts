// useStore.ts
import { useEffect, useState } from "react";

const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    // https://github.com/pmndrs/zustand/issues/938#issuecomment-2466436080 //TODO:
    setData(() => result);
  }, [result]);

  return data;
};

export default useStore;
