"use client";

import Authpage from "./authpage/page";
import { useSession } from "next-auth/react";
import Predict from "./predict/page";

export default function Home() {
  

 const {data:session} = useSession();
  if (!session) {
    return <>
      <Authpage/>
    </>;
  }

  return (
    <Predict/>
  );
}
