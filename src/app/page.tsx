"use client";

import dynamic from "next/dynamic";

const MapCompare = dynamic(() => import("../components/MapCompare"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <MapCompare />
    </>
  );
}

// "use client";

// import MapCompare from "@/components/MapCompare";

// export default function Home() {
//   return (
//     <>
//      <MapCompare />
//     </>
//   );
// }