import emotionStyled from "@emotion/styled";
import {Outlet} from "@remix-run/react";
import {AuthLayout} from "~/components/layout/AuthLayout";

export default function Auth() {
  return (
    <AuthLayout>
      <Outlet/>
    </AuthLayout>
  )
}