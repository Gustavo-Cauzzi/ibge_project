import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Form } from "../pages/form";
import { Home } from "../pages/home";
import { BaseLayout } from "./layouts/BaseLayout";

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route path="/form" element={<Form />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
