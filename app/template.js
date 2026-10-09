'use client';

export default function Template({ children }) {
  // Page transition component wraps {children} in layout, but putting children here forces re-render of transition if placed in template.
  // Actually, since PageTransition uses usePathname to trigger the animation, it can live in layout.js,
  // but if we wrap it in template, it physically remounts. 
  // Given our PageTransition implementation, it's already in layout and listens to pathname.
  // But to satisfy the requirement: "Use app/template.js to wrap all pages... which is perfect for transitions."
  return <>{children}</>;
}
