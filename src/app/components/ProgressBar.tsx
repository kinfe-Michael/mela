// components/ProgressBar.tsx
"use client";

import NProgress from 'nprogress';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter from next/navigation for App Router

// Import NProgress styles (you might need to adjust the path based on your node_modules)
import 'nprogress/nprogress.css';

// Configure NProgress (optional, but good for customization)
NProgress.configure({
  showSpinner: false, // Don't show the default spinner
  trickleSpeed: 200,  // How fast the bar moves
  minimum: 0.1,       // Minimum percentage of the bar
});

const ProgressBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter(); // Get the router instance

  useEffect(() => {
    // Manually hook into navigation start/end.
    // In App Router, we don't have router.events like in Pages Router.
    // Instead, we'll rely on a global state or direct calls from custom Link/Router.
    // For now, this component primarily provides the NProgress styles.
    // The actual start/done calls will be in our custom Link and useRouter.

    // This useEffect is mainly to ensure NProgress is initialized and its styles are loaded.
    // The actual progress bar animation will be controlled by the custom Link/useRouter.

    // When the path changes, we assume navigation is complete or new page is loaded.
    // This is a fallback to ensure the bar completes even if start() wasn't called
    // or if there was an error.
    NProgress.done();

    // Cleanup function for when the component unmounts
    return () => {
      NProgress.done(); // Ensure NProgress is stopped if component unmounts mid-progress
    };
  }, [pathname]); // Re-run when pathname changes to ensure NProgress.done() is called

  return null; // This component doesn't render any visible DOM elements directly
};

export default ProgressBar;
