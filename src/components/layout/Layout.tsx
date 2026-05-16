import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileQuickBar } from "./MobileQuickBar";

export function Layout() {
  return (
    <div className="app-layout">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MobileQuickBar />
    </div>
  );
}
