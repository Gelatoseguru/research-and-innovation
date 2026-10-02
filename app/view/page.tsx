import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/footer";
import View from "@/components/Ulol/ViewPage";
import { Suspense } from "react";



export default function ProgramsRoute() {
  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <View />
      </Suspense>
      <Footer />
    </>
  );
}
