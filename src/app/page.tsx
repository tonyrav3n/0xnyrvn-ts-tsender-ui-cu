'use client';

import dynamic from 'next/dynamic';

const AirdropForm = dynamic(() => import('@/components/AirdropForm'), {
  ssr: false,
});

export default function Home() {
  return (
      <div>
        <div className="mt-8">
          <AirdropForm/>
        </div>
      </div>
  );
}
