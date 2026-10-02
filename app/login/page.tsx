import LoginPage from "@/components/Ulol/LoginPage";
import { Suspense } from "react";

export default function LoginRoute() {
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}
