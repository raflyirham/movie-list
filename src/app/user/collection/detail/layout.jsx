import { Suspense } from "react";

export default function CollectionDetailLayout({ children }) {
  return (
    <div>
      <Suspense fallback={<p className="p-6">Loading...</p>}>
        {children}
      </Suspense>
    </div>
  );
}
