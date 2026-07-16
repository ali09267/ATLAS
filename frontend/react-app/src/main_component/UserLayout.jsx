import Navbar from "./Navbar"; // or wherever your navbar is
import { Outlet } from "react-router-dom";

export default function UserLayout({
  allProducts,
  search,
  setSearch,
}) {
  return (
    <>
    <Navbar
        allProducts={allProducts}
        search={search}
        setSearch={setSearch}
      />

      <Outlet
        context={{
          allProducts,
          search,
        }}
      />
    </>
  );
}