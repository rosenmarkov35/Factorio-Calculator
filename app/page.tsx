"use client";

import Image from "next/image";
import ItemBrowser from "./components/ItemBrowser";
import { PropertiesProvider } from "./context/PropertiesContext";
import JSONCreator from "./components/JSONCreator";
import { useState } from "react";
import Solver from "./components/Solver";
import AssemblerSelector from "./components/AssemblerSelector";
import SmelterSelector from "./components/SmelterSelector";
import DrillSelector from "./components/DrillSelector";
import RecipesBrowser from "./components/RecipesBrowser";
import IngredientsDisplay from "./components/IngredientsDisplay";

export default function Home() {
  const [devMode, setDevMode] = useState(false);

  return (
    <PropertiesProvider>
      <div className="bg-zinc-900 w-[100vw] h-[100vh] p-4">
        <section className="grid grid-rows-3 grid-cols-7 gap-3 h-full">
          {/* MAIN CONFIG SECTION */}
          <section className="col-span-2 row-span-1 bg-zinc-800 rounded-2xl p-3 gap-4 grid grid-rows-3 grid-cols-5">
            <div className="col-span-full grid grid-cols-5 grid-rows-1 gap-3 row-span-1">
              <ItemBrowser></ItemBrowser>
              <AssemblerSelector></AssemblerSelector>
              <SmelterSelector></SmelterSelector>
              <DrillSelector></DrillSelector>
            </div>
            <div className="col-span-full grid grid-cols-5 grid-rows-1 gap-3 row-span-1">
              <RecipesBrowser></RecipesBrowser>
            </div>
          </section>
          {/* MAIN CONFIG SECTION */}

          <div className="col-span-3 row-span-1 bg-zinc-800 rounded-2xl p-3">
            <Solver></Solver>
          </div>
          <div className="col-span-2 row-span-3 bg-zinc-800 rounded-2xl p-3">
            <button
              onClick={() => setDevMode(!devMode)}
              className="px-6 py-2 text-l font-bold text-tetriary active:text-accent outline-primary outline-3 rounded-lg"
            >
              Dev Mode
            </button>
            {devMode && <JSONCreator />}
          </div>
          <div className="col-span-5 row-span-2 bg-zinc-800 rounded-2xl p-3 overflow-scroll">
            <IngredientsDisplay></IngredientsDisplay>
          </div>
        </section>
      </div>
    </PropertiesProvider>
  );
}
