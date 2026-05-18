// import GlobeComponent from "@/src/components/GlobeComponent";

// export default function Home() {
//   return (
//     <div className="">
//       <GlobeComponent />
//     </div>
//   );
// }
'use client';

import dynamic from 'next/dynamic';

const GlobeComponent = dynamic(
  () => import('../src/components/GlobeComponent'),
  {
    ssr: false,
  }
);

export default function Home() {
  return <GlobeComponent />;
}