import { useProperties } from "../context/PropertiesContext";
import { motion } from "motion/react";

function IngredientNode({
  ingredientKey,
  value,
  idx,
  level = 0,
  solverData,
  gameItemSet,
}) {
  const ingredient = gameItemSet[ingredientKey];
  const subIngredients = gameItemSet[ingredientKey]?.ingredients;
  const assemblerSet = require("../gameAssemblerSet.json");
  const { assemblerSelected } = useProperties();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -190 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{
          duration: 0.1,
          delay: idx * 0.05,
          type: "spring",
          stiffness: 50,
        }}
        key={ingredientKey + "-" + level}
        className="flex items-center bg-secondary px-4 py-2 text-lg font-bold rounded-2xl"
        style={{
          boxShadow: "1px 2px 4px 0px rgba(0,0,0,0.65) inset",
          marginLeft: `${level * 32}px`,
          transform: `scale(${1 - level * 0.1})`, // Correct way to scale
          filter: `brightness(${Math.max(0.4, 1 - level * 0.1)})`, // Optional: dim deeper levels
        }}
      >
        <motion.img
          whileHover={{ scale: 1.2, rotateZ: 4 }}
          className="w-12 drop-shadow-lg mr-4"
          src={
            ingredient?.imageURL ||
            "https://wiki.factorio.com/images/Danger-icon.png"
          }
          alt={ingredientKey}
        />
        <p className="text-shadow-lg text-sm">{`${(
          (value * solverData.itemsPerMinute) /
          solverData.quantity
        ).toFixed(2)} / min`}</p>
        <img
          className="w-10 ml-5"
          src={assemblerSet[assemblerSelected].imageURL}
          alt=""
        />
      </motion.div>
      {subIngredients &&
        Object.entries(subIngredients).length > 0 &&
        Object.entries(subIngredients).map(([subKey, subValue], subIdx) => (
          <IngredientNode
            key={ingredientKey + "-" + subKey + "-" + level}
            ingredientKey={subKey}
            value={subValue}
            idx={subIdx}
            level={level + 1}
            solverData={solverData}
            gameItemSet={gameItemSet}
          />
        ))}
    </>
  );
}

export default function IngredientsDisplay() {
  const gameItemSet = require("../gameItemSet.json");
  const { itemSelected, solverData } = useProperties();

  const ingredients = gameItemSet[itemSelected]?.ingredients;

  if (!ingredients || Object.keys(ingredients).length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gapx-4 gap-y-2">
      {Object.entries(ingredients).map(([key, value], idx) => (
        <IngredientNode
          key={key}
          ingredientKey={key}
          value={value}
          idx={idx}
          level={0}
          solverData={solverData}
          gameItemSet={gameItemSet}
        />
      ))}
    </div>
  );
}
