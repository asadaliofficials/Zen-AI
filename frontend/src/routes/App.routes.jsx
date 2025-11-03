// src/routes/App.routes.js or wherever your file is
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "../components/AuthPage";
import HomeWrapper from "../components/HomeWrapper";
import NotFound from "../components/NotFound";
import HomeSandbox from "../components/sandbox/Home.sandbox";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeWrapper />} />
        <Route path="/chat/:id" element={<HomeWrapper />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/c/read/:id" element={<HomeSandbox />} />
        <Route path="/m/read/:id" element={<HomeSandbox />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
