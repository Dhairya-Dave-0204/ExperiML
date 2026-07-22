import React from 'react'
import { Outlet } from "react-router-dom";

import { Navbar, Footer } from "@/components/components.index"

function PublicLayout() {
  return (
    <>
        <Navbar />
        <main>
            <Outlet />
        </main>
        <Footer />
    </>
  )
}

export default PublicLayout