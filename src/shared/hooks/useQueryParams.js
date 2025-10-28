import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useQueryParams() {
  const loc = useLocation();
  const nav = useNavigate();
  const params = useMemo(() => new URLSearchParams(loc.search), [loc.search]);

  function setParams(next) {
    const p = new URLSearchParams(loc.search);
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") p.delete(k);
      else p.set(k, v);
    });
    nav({ search: p.toString() }, { replace: true });
  }

  return [params, setParams];
}
