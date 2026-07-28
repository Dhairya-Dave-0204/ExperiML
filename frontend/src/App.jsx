import './App.css'
import { AppRoutes } from "@/routes/routes.index"

import { ScrollToTop } from "@/components/components.index"

function App() {

  return (
    <>
      <ScrollToTop />

      <AppRoutes />
    </>
  )
}

export default App
