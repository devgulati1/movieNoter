import { useEffect, useState } from "react";
export function useLocalStorage(initalVal, key) {
  console.log("CALLING USELOCAL HOOKS ");
  const [val, setVal] = useState(() => {
    let localVal = localStorage.getItem(`${key}`);
    return localVal ? JSON.parse(localVal) : initalVal;
  });
  useEffect(() => {
    localStorage.setItem(`${key}`, JSON.stringify(val));
  }, [val]);
  return [val, setVal];
}
