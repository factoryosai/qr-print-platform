'use client';

import { usePathname } from 'next/navigation';

export default function CssLoader() {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  if (!isLanding) return null;

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://qrtoprint.in/assets/front-redesign.css?v=1" />
      <link rel="stylesheet" href="https://qrtoprint.in/assets/proof-redesign.css?v=2" />
      <style dangerouslySetInnerHTML={{ __html: `
        /* Override globals.css background for the landing page */
        body { background: #ffffff !important; color: #212529 !important; font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif !important; }
        * { box-sizing: border-box; }
      `}} />
    </>
  );
}
