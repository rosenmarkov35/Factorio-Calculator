import { motion } from "motion/react";
import { useProperties } from "../context/PropertiesContext";
import ItemNode from "./ItemNode";
import { useEffect, useState } from "react";

export default function ItemBrowser() {
  const gameItemSet = require("../gameItemSet.json");
  const gameRecipeSet = require("../gameRecipesSet.json");
  const [searchTerm, setSearchTerm] = useState("");

  // #TODO: COME UP WITH A WAY TO DISPLAY INGREDIENT CRAFTING RECIPES AND PREFERED SMELTERS/MACHINES FOR EACH ITEM
  // #TODO: COME UP WITH A WAY TO DISPLAY INGREDIENT CRAFTING RECIPES AND PREFERED SMELTERS/MACHINES FOR EACH ITEM
  // #TODO: COME UP WITH A WAY TO DISPLAY INGREDIENT CRAFTING RECIPES AND PREFERED SMELTERS/MACHINES FOR EACH ITEM
  // #TODO: COME UP WITH A WAY TO DISPLAY INGREDIENT CRAFTING RECIPES AND PREFERED SMELTERS/MACHINES FOR EACH ITEM
  // #TODO: COME UP WITH A WAY TO DISPLAY INGREDIENT CRAFTING RECIPES AND PREFERED SMELTERS/MACHINES FOR EACH ITEM

  const {
    setSolverData,
    itemSelected,
    recipeSelected,
    recipeToggled,
    setRecipeToggled,
    setItemSelected,
    setAllowedSmelters,
    setAllowedDrills,
    setAllowedMachines,
    itemBrowserOpen,
    setItemBrowserOpen,
  } = useProperties();

  // Update allowed machines and smelters when itemSelected changes
  useEffect(() => {
    setAllowedDrills(gameItemSet[itemSelected]?.allowedDrills ?? []);
    setAllowedMachines(gameItemSet[itemSelected]?.allowedMachines ?? []);
    setAllowedSmelters(gameItemSet[itemSelected]?.allowedSmelters ?? []);
    setRecipeToggled(false);
    setSolverData((prev) => ({
      ...prev,
      quantity: gameItemSet[itemSelected]?.outputQuantity ?? 1,
      recipeTime: gameItemSet[itemSelected]?.craftingTime ?? 0,
    }));
  }, [itemSelected]);

  useEffect(() => {
    if (recipeToggled) {
      setSolverData((prev) => ({
        ...prev,
        quantity: gameRecipeSet[recipeSelected]?.outputQuantity ?? 1,
        recipeTime: gameRecipeSet[recipeSelected]?.craftingTime ?? 0,
      }));
    } else {
      setSolverData((prev) => ({
        ...prev,
        quantity: gameItemSet[itemSelected]?.outputQuantity ?? 1,
        recipeTime: gameItemSet[itemSelected]?.craftingTime ?? 0,
      }));
    }
  }, [recipeSelected, recipeToggled]);

  // HANDLE ITEM SEARCHING

  useEffect(() => {
    if (!itemBrowserOpen) setSearchTerm("");
  }, [itemBrowserOpen]);

  // Handle key presses for ingredient browser
  useEffect(() => {
    // Only add the listener if any browser is open
    if (!itemBrowserOpen) return;

    const handleKeyDown = (e) => {
      if (e.key.length === 1 && /^[a-zA-Z0-9_]$/.test(e.key)) {
        setSearchTerm((prev) => prev + e.key);
      }
      if (e.key === "Backspace") {
        setSearchTerm((prev) => prev.slice(0, -1));
      }
      if (e.key === "Escape") {
        setItemBrowserOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [itemBrowserOpen]);

  const handleItemScroll = (e: React.WheelEvent) => {
    e.preventDefault();

    const itemList = Object.keys(gameItemSet);
    const currentIndex = itemList.indexOf(itemSelected);
    const direction = e.deltaY > 0 ? -1 : 1;
    const nextIndex =
      (currentIndex + direction + itemList.length) % itemList.length;

    setItemSelected(itemList[nextIndex]);
  };

  const columns = 18;
  const itemKeys = Object.keys(gameItemSet).filter((k) => k !== "break"); // Exclude any "break" keys in data
  const breakIndices = [4, 8, 12, 16, 22, 26, 29, 39, 42, 50, 58, 68, 71]; // Insert a break after these indices
  let gridItems = [];
  let colIndex = 0;

  const filteredKeys = itemKeys.filter((key) =>
    key.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  gridItems = [];
  colIndex = 0;

  const keysToShow = searchTerm ? filteredKeys : itemKeys;

  keysToShow.forEach((key, idx) => {
    if (!searchTerm && breakIndices.includes(idx)) {
      const remaining = columns - (colIndex % columns || columns);
      if (remaining !== columns) {
        gridItems.push(
          <div
            key={`break-${idx}`}
            style={{ gridColumn: `span ${remaining}` }}
          />
        );
      }
      colIndex = 0;
    }
    gridItems.push(<ItemNode key={key} itemName={key} />);
    colIndex++;
  });

  return (
    <>
      {/* Item browser Node */}
      <motion.div
        whileHover={{
          rotateZ: 2,
          scale: !recipeToggled ? 1.05 : 0.9,
          backgroundColor: "#3a3a 3f",
          boxShadow: "0px 0px 9px 0px rgba(0,0,0,0.4)",
        }}
        animate={{
          scale: !recipeToggled ? 1 : 0.8,

          filter: !recipeToggled ? "brightness(1)" : "brightness(0.7)",
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        onWheel={handleItemScroll}
        onClick={() =>
          !recipeToggled
            ? setItemBrowserOpen(!itemBrowserOpen)
            : setRecipeToggled(!recipeToggled)
        }
        className="bg-secondary rounded-xl drop-shadow-md flex items-center justify-center cursor-pointer"
      >
        <img
          src={gameItemSet[itemSelected].imageURL || "default-image-url"}
          alt="itemimg"
          className="w-2/3"
        ></img>
      </motion.div>

      <div
        className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-40"
        style={{ pointerEvents: itemBrowserOpen ? "auto" : "none" }}
      >
        {/* Background overlay */}
        <div
          className={`absolute top-0 left-0 w-full h-full bg-black transition-opacity duration-200 ${
            itemBrowserOpen ? "opacity-40" : "opacity-0"
          }`}
          onClick={() => setItemBrowserOpen(false)}
          style={{ zIndex: 1 }}
        />
        {/* Modal content */}
        <div
          className={`relative bg-zinc-900 rounded-2xl transition-all duration-200 ease-in-out ${
            itemBrowserOpen
              ? "opacity-100 pointer-events-auto"
              : "pointer-events-none opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{ zIndex: 2 }}
        >
          <div
            style={{
              gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
            }}
            className="auto-rows-[55px] grid gap-2 p-4 outline-2 outline-amber-400 bg-primary rounded-2xl z-[1] h-[80vh] w-[90vw] max-h-[80vh] overflow-y-auto overflow-x-hidden"
          >
            {gridItems.filter((item) =>
              item.key.toLowerCase().startsWith(searchTerm.toLowerCase())
            )}
            <section className="cursor-default text-sm absolute px-2 py-1 left-6 max-w-[20vw] overflow-clip rounded-lg -top-4 bg-primary border-2 border-accent">
              {searchTerm || "Type to search"}
            </section>
            <section className="cursor-default absolute px-2 py-1 right-2 text-xs rounded-lg -top-3 bg-primary border-2 border-accent">
              Esc to close
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
