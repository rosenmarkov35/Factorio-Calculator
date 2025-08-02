import { useEffect } from "react";
import { motion } from "motion/react";
import { useProperties } from "../context/PropertiesContext";

export default function RecipesBrowser() {
  const gameItemSet = require("../gameItemSet.json");
  const gameRecipeSet = require("../gameRecipesSet.json");
  const { itemSelected, recipeSelected, recipeToggled, setRecipeToggled, setRecipeSelected } = useProperties();

  const itemList = gameItemSet[itemSelected]?.recipes || [];

  useEffect(() => {
    if (itemList.length === 0) return;
    if (!itemList.includes(recipeSelected)) {
      setRecipeSelected(itemList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemSelected, itemList.length]);

  const currentIndex = itemList.indexOf(recipeSelected);

  const handleItemScroll = (e: React.WheelEvent) => {
    if (itemList.length === 0) return;
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    const nextIndex =
      (currentIndex + direction + itemList.length) % itemList.length;
    setRecipeSelected(itemList[nextIndex]);
  };

  const hasRecipe = !!gameRecipeSet[recipeSelected];

  return (
    <>
      <motion.div
        onClick={() => setRecipeToggled(!recipeToggled)}
        whileHover={{
          rotateZ: 2,
          scale: recipeToggled ? 1.05 : 0.9,
          backgroundColor: "#3a3a3f",
          boxShadow: "0px 0px 9px 0px rgba(0,0,0,0.4)",
        }}
        animate={{
          opacity: hasRecipe && itemList.length > 0 ? 1 : 0,
          rotateZ: hasRecipe && itemList.length > 0 ? 0 : 360,
          scale: hasRecipe && itemList.length > 0
            ? (recipeToggled ? 1 : 0.8)
            : 0,
          filter: recipeToggled ? "brightness(1)" : "brightness(0.7)",
          pointerEvents: hasRecipe && itemList.length > 0 ? "auto" : "none",
        }}
        transition={{ duration: 0.15 }}
        onWheel={handleItemScroll}
        className="cursor-pointer rounded-xl drop-shadow-md flex items-center justify-center bg-secondary"
      >
        {hasRecipe && itemList.length > 0 && (
          <img
            className="w-2/3"
            src={gameRecipeSet[recipeSelected].imageURL}
            alt="itemimg"
          />
        )}
      </motion.div>
    </>
  );
}
