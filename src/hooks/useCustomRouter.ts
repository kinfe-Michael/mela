// hooks/useCustomRouter.ts
"use client";

import { useRouter as useNextRouter } from 'next/navigation';
import NProgress from 'nprogress';

// Infer the type of the router object returned by next/navigation's useRouter
type AppRouterInstance = ReturnType<typeof useNextRouter>;

// Define a custom interface that extends the inferred type,
// specifically overriding push and replace to match our custom implementation.
interface CustomRouter extends AppRouterInstance {
  push: (href: string, options?: Parameters<AppRouterInstance['push']>[1]) => void;
  replace: (href: string, options?: Parameters<AppRouterInstance['replace']>[1]) => void;
  // Add other methods if you plan to wrap them similarly
}

export const useCustomRouter = (): CustomRouter => {
  const router = useNextRouter();

  const push: CustomRouter['push'] = (href, options) => {
    NProgress.start(); // Start NProgress before navigation
    router.push(href, options);
  };

  const replace: CustomRouter['replace'] = (href, options) => {
    NProgress.start(); // Start NProgress before navigation
    router.replace(href, options);
  };

  return {
    ...router,
    push,
    replace,
  };
};
