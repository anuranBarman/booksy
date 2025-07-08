// src/components/Layout.tsx
import { Header } from "@/componentsLocal/Header"
import React from "react"

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="p-4">{children}</main>
    </>
  )
}