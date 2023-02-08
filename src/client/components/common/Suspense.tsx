import {
  Suspense as ReactSuspense,
  useEffect,
  useState,
  type ComponentProps,
} from "react";

function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

export default function Suspense(props: ComponentProps<typeof ReactSuspense>) {
  const isMounted = useMounted();

  if (isMounted) {
    return <ReactSuspense {...props} />;
  }
  return <>{props.fallback}</>;
}
