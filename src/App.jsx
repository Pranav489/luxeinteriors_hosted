import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import AboutUsPage from "./pages/AboutUs/AboutUsPage";
import PageNotFound from "./pages/ErrorPages/NotFound";
import ProductsPage from "./pages/Products/ProductsPage";
import ThankYouPage from "./pages/ThankYou/ThankYouPage";
import { useSEO } from "./hooks/useSEO";

// SEO Wrapper Components
const SEOWrapper = ({ children, page = null }) => {
  useSEO(page);
  return children;
};

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <SEOWrapper page="home">
              <Home />
            </SEOWrapper>
          }
        />
        <Route
          path="/aboutus"
          element={
            <SEOWrapper page="about">
              <AboutUsPage />
            </SEOWrapper>
          }
        />
        {/* <Route
          path="/services"
          element={
            <SEOWrapper page="services">
              <ProductsPage />
            </SEOWrapper>
          }
        /> */}
        {/* <Route path="/services/:category" element={<ProductsPage />} /> */}
        <Route
          path="/thankyou"
          element={
            <SEOWrapper page="thankyou">
              <ThankYouPage />
            </SEOWrapper>
          }
        />
        <Route
          path="*"
          element={
            <SEOWrapper page="404">
              <PageNotFound />
            </SEOWrapper>
          }
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
