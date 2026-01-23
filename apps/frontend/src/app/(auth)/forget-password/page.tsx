import { Suspense } from "react";
import ForgetPassword from "./ForgetPassword";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ForgetPassword />
    </Suspense>
  );
}
