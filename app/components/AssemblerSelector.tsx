import { useEffect } from "react";
import { motion } from "motion/react";
import { useProperties } from "../context/PropertiesContext";
import ItemNode from "./ItemNode";
import Popup from "./Popup";

export default function AssemblerSelector() {
  const gameAssemblerSet = require("../gameAssemblerSet.json");

  const {
    assemblerSelected,
    setAssemblerSelected,
    setAssemblerBrowserOpen,
    assemblerBrowserOpen,
    setSolverData
  } = useProperties();

  // Use all assembler keys for selection
  const itemList = Object.keys(gameAssemblerSet);

  useEffect(() => {
    setSolverData((prev) => ({
      ...prev,
      machineSpeed: gameAssemblerSet[assemblerSelected]?.craftingSpeed[0] || 1
    }));
  }, [assemblerSelected]);


  // Ensure assemblerSelected is always valid when itemList changes
  useEffect(() => {
    if (!itemList.includes(assemblerSelected)) {
      setAssemblerSelected(itemList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemList]);

  const currentIndex = itemList.indexOf(assemblerSelected);

  const handleItemScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    const nextIndex =
      (currentIndex + direction + itemList.length) % itemList.length;
    setAssemblerSelected(itemList[nextIndex]);
  };

  return (
    <>
      <motion.div
        whileHover={{
          rotateZ: 2,
          scale: 1.05,
          backgroundColor: "#3a3a3f",
          boxShadow: "0px 0px 9px 0px rgba(0,0,0,0.4)",
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        onWheel={handleItemScroll}
        onClick={() => setAssemblerBrowserOpen(!assemblerBrowserOpen)}
        className="bg-[#313137] rounded-xl drop-shadow-md flex items-center justify-center cursor-pointer"
      >
        <Popup></Popup>
        <img
          src={
            gameAssemblerSet[assemblerSelected]?.imageURL ||
            "https://wiki.factorio.com/images/Electricity-icon-unplugged.png"
          }
          alt="itemimg"
          className={
            gameAssemblerSet[assemblerSelected]?.imageURL
              ? "w-2/3"
              : "w-1/2 animate-pulse"
          }
        />
      </motion.div>
    </>
  );
}
