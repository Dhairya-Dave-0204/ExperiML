import { Routes, Route } from "react-router-dom";

import { Home }  from "@/pages/page.index";


export default function AppRoutes(){

    return (

        <Routes>

            <Route 
                path="/"
                element={<Home />}
            />

        </Routes>

    );

}