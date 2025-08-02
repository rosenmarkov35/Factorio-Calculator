import { useEffect } from "react";
import { motion } from "motion/react";
import { useProperties } from "../context/PropertiesContext";
import Popup from "./Popup";

export default function SmelterSelector() {
  const gameSmelterSet = require("../gameSmelterSet.json");

  const {
    allowedSmelters,
    smelterSelected,
    setSmelterSelected,
    setAssemblerBrowserOpen,
    assemblerBrowserOpen,
    smelterBrowserOpen,
    setDrillBrowserOpen,
    setSmelterBrowserOpen,
    setSolverData
  } = useProperties();

  // Compute the list of selectable assemblers
  const itemList = allowedSmelters

  // Ensure assemblerSelected is always valid when allowedSmelters changes
  useEffect(() => {
    if (!itemList.includes(smelterSelected)) {
      setSmelterSelected(itemList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedSmelters]);

  useEffect(() => {
    setSolverData((prev) => ({...prev, machineSpeed: gameSmelterSet[smelterSelected]?.craftingSpeed[0] || 1}));
  }, [smelterSelected]);

  const currentIndex = itemList.indexOf(smelterSelected);

  const handleItemScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    const nextIndex =
      (currentIndex + direction + itemList.length) % itemList.length;
    setSmelterSelected(itemList[nextIndex]);
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
        onClick={() => setSmelterBrowserOpen(!smelterBrowserOpen)}
        className="bg-[#313137] rounded-xl drop-shadow-md flex items-center justify-center cursor-pointer"
      >
      <Popup></Popup>
        <img
          src={
            gameSmelterSet[smelterSelected]?.imageURL || "https://wiki.factorio.com/images/Electricity-icon-unplugged.png"
          }
          alt="itemimg"
          className={gameSmelterSet[smelterSelected]?.imageURL ? "w-2/3" : "w-1/2 animate-pulse"}
        />
      </motion.div>
    </>
  );
}
