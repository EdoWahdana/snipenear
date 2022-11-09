import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Header({ title }) {
  const router = useRouter();
  return (
    <Head>
      <title>{title}</title>
      <link rel="EverSnipe" href="logo-white-new.png" />
    </Head>
  );
}
