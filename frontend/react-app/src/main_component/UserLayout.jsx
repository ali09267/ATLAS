import Navbar from "./Navbar"; // or wherever your navbar is
import { Outlet, useLocation } from "react-router-dom"; //place holder for dynamic load of child components based on the route. It will render the component that matches the current route.
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../styles/UserLayout.css";

function UserLayout({
  allProducts, //products data fetched from the backend
  search, //search query state
  setSearch, //what user currently typed in the search bar
}) {
  const location = useLocation(); //get the current route location to trigger animations when the route changes

  const DOT_COUNT = 200;
  const [dots] = useState(() =>
    Array.from({ length: DOT_COUNT }, (_, index) => {
      const size = Math.random() * 3 + 2;

      return {
        id: index, //1,2,3,...,200

        top: `${Math.random() * 100}%`, //1-100% of the screen height

        left: `${Math.random() * 100}%`, //1-100% of the screen width

        size: `${size}px`, //2-5px

        delay: `${Math.random() * -12}s`, //different delay for each dot to create a more natural effect(0 to -12 seconds) preventing all dots from starting their animation at the same time

        duration: `${Math.random() * 8 + 8}s`, //8-16 seconds for each dot to complete its animation cycle, creating a more dynamic and less uniform effect
      };
    }),
  );
  return (
    <>
      <div className="atlas-user-layout">
        <div className="atlas-background">
          <div className="atlas-glow atlas-glow-purple"></div>

          <div className="atlas-glow atlas-glow-blue"></div>

          <div className="atlas-dots">
            {dots.map((dot) => (
              <span
                key={dot.id}
                style={{
                  top: dot.top,
                  left: dot.left,
                  width: dot.size,
                  height: dot.size,
                  animationDelay: dot.delay,
                  animationDuration: dot.duration,
                }}
              />
            ))}
          </div>
        </div>

        <Navbar
          allProducts={allProducts}
          search={search}
          setSearch={setSearch}
        />

        {/*outlet main wrapper*/}
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
    </>
  );
}

export default UserLayout;
