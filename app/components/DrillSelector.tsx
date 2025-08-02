import { useEffect } from "react";
import { motion } from "motion/react";
import { useProperties } from "../context/PropertiesContext";
import Popup from "./Popup";

export default function DrillSelector() {
  const gameDrillSet = require("../gameDrillSet.json");

  const {
    allowedDrills,
    drillSelected,
    setDrillSelected,
    setAssemblerBrowserOpen,
    drillBrowserOpen,
    setDrillBrowserOpen,
  } = useProperties();

  // Compute the list of selectable assemblers
  const itemList = allowedDrills;

  // Ensure assemblerSelected is always valid when allowedDrills changes
  useEffect(() => {
    if (!itemList.includes(drillSelected)) {
      setDrillSelected(itemList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedDrills]);

  const currentIndex = itemList.indexOf(drillSelected);

  const handleItemScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    const nextIndex =
      (currentIndex + direction + itemList.length) % itemList.length;
    setDrillSelected(itemList[nextIndex]);
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
        onClick={() => setDrillBrowserOpen(!drillBrowserOpen)}
        className="bg-[#313137] rounded-xl drop-shadow-md flex items-center justify-center cursor-pointer"
      >
        <Popup></Popup>
        <img
          src={
            gameDrillSet[drillSelected]?.imageURL ||
            "https://wiki.factorio.com/images/Electricity-icon-unplugged.png"
          }
          alt="itemimg"
          className={
            gameDrillSet[drillSelected]?.imageURL
              ? "w-2/3"
              : "w-1/2 animate-pulse"
          }
        />
      </motion.div>
    </>
  );
}
