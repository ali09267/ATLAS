import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AtlasBackground from "./AtlasBackground";
import "../styles/UserLayout.css";

function UserLayout({ allProducts, search, setSearch }) {
  const location = useLocation();

  return (
    <div className="atlas-user-layout">
      <AtlasBackground />

      <Navbar allProducts={allProducts} search={search} setSearch={setSearch} />

      <main className="atlas-page-content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            className="atlas-route-transition"
            initial={{
              opacity: 0,
              x: "100%",
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: "-100%",
            }}
            transition={{
              duration: 0.42,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Outlet
              context={{
                allProducts,
                search,
              }}
            />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default UserLayout;
