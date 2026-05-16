import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/pages/HomePage";
import { RestaurantPage } from "@/pages/RestaurantPage";
import { MenuPage } from "@/pages/MenuPage";
import { EventsPage } from "@/pages/EventsPage";
import { SuitesPage } from "@/pages/SuitesPage";
import { SaunaPage } from "@/pages/SaunaPage";
import { HotelPage } from "@/pages/HotelPage";
import { ContactPage } from "@/pages/ContactPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/restaurant" element={<RestaurantPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/suites" element={<SuitesPage />} />
          <Route path="/sauna" element={<SaunaPage />} />
          <Route path="/hotel" element={<HotelPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
