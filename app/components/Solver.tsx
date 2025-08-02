import { useEffect } from "react";
import Info from "./Info";
import { useProperties } from "../context/PropertiesContext";

export default function Solver() {
  const { solverData, setSolverData } = useProperties();

  // Ensure machinesValue is correct on init and when dependencies change
  useEffect(() => {
    const {
      itemsPerSecond,
      recipeTime,
      machineSpeed,
      quantity,
      machinesValue,
    } = solverData;
    const correctMachinesValue = Number(
      ((itemsPerSecond * recipeTime) / (machineSpeed * quantity)).toFixed(2)
    );
    if (
      machinesValue !== correctMachinesValue &&
      isFinite(correctMachinesValue)
    ) {
      setSolverData((prev) => ({
        ...prev,
        machinesValue: correctMachinesValue,
      }));
    }
  }, [
    solverData.itemsPerSecond,
    solverData.recipeTime,
    solverData.machineSpeed,
    solverData.quantity,
    solverData.machinesValue,
    setSolverData,
  ]);



  const handleDynamicChange = (e) => {
    const { name, value } = e.target;
    // Convert input to a number safely
    const numericValue = Number(
      value.replace(",", ".").replace(/[^0-9.]/g, "")
    );

    setSolverData((prev) => {
      const { recipeTime, machineSpeed, quantity, machinesValue } = prev;

      let updatedValues = { [name]: numericValue };

      switch (name) {
        case "itemsPerSecond":
          updatedValues.itemsPerMinute = Number((numericValue * 60).toFixed(2));
          updatedValues.machinesValue = Number(
            ((numericValue * recipeTime) / (machineSpeed * quantity)).toFixed(2)
          );
          break;

        case "itemsPerMinute":
          updatedValues.itemsPerSecond = Number((numericValue / 60).toFixed(2));
          updatedValues.machinesValue = Number(
            (
              (numericValue / 60) *
              (recipeTime / (machineSpeed * quantity))
            ).toFixed(2)
          );
          break;

        case "machinesValue":
          updatedValues.itemsPerSecond = Number(
            ((numericValue * machineSpeed * quantity) / recipeTime).toFixed(2)
          );
          updatedValues.itemsPerMinute = Number(
            (
              ((numericValue * machineSpeed * quantity) / recipeTime) *
              60
            ).toFixed(2)
          );
          break;

        case "quantity":
          updatedValues.itemsPerSecond = Number(
            (
              (machinesValue * machineSpeed * numericValue) /
              recipeTime
            ).toFixed(2)
          );
          updatedValues.itemsPerMinute = Number(
            (
              ((machinesValue * machineSpeed * numericValue) / recipeTime) *
              60
            ).toFixed(2)
          );
          break;

        case "recipeTime":
        case "machineSpeed":
          updatedValues.itemsPerSecond = Number(
            ((machinesValue * machineSpeed * quantity) / numericValue).toFixed(
              2
            )
          );
          updatedValues.itemsPerMinute = Number(
            (
              ((machinesValue * machineSpeed * quantity) / numericValue) *
              60
            ).toFixed(2)
          );
          updatedValues.machinesValue = Number(
            (
              (prev.itemsPerSecond * numericValue) /
              (machineSpeed * quantity)
            ).toFixed(2)
          );
          break;
      }

      return { ...prev, ...updatedValues };
    });
  };

  return (
    <>
      <div className="bg-primary p-2 rounded-lg m-2 text-tetriary text-md flex justify-evenly items-center">
        Items / s:
        <input
          className="bg-secondary bg-opacity-20 hover:bg-opacity-60 focus:bg-opacity-100 p-1 rounded-md mx-3 text-tetriary caret-accent max-w-12 focus:outline-accent focus:outline-1 outline outline-transparent outline-1 duration-[470ms] ease-in-out transition-all"
          onChange={handleDynamicChange}
          name="itemsPerSecond"
          type="text"
          value={solverData.itemsPerSecond}
        />
        Items / min:
        <input
          className="bg-secondary bg-opacity-20 hover:bg-opacity-60 focus:bg-opacity-100 p-1 rounded-md mx-3 text-tetriary caret-accent max-w-12 focus:outline-accent focus:outline-1 outline outline-transparent outline-1 duration-[470ms] ease-in-out transition-all"
          onChange={handleDynamicChange}
          name="itemsPerMinute"
          type="text"
          value={solverData.itemsPerMinute}
        />
        <div
          className={`group flex items-center transition-all ${
            solverData.editable ? "opacity-100" : "opacity-30"
          }`}
        >
          <label
            className={`text-opacity-55 group-focus-within:text-opacity-100 transition-all duration-300`}
          >
            Quantity:
            <input
              className="bg-secondary mx-2 bg-opacity-20 hover:bg-opacity-60 focus:bg-opacity-100 p-1 rounded-md text-tetriary caret-accent max-w-12 focus:outline-accent focus:outline-1 outline-transparent outline-1 duration-[470ms] ease-in-out transition-all"
              onChange={handleDynamicChange}
              name="quantity"
              type="text"
              value={solverData.quantity}
            />
          </label>
          <Info
            helpText={"The quantity of items crafted each time."}
            customWidth="w-[170px]"
          ></Info>
        </div>
      </div>
      <div className="m-2 bg-primary rounded-lg p-3 flex justify-evenly items-center">
        <div className="group">
          <label className="text-accent font-bold text-opacity-55 group-focus-within:text-opacity-100 transition-all duration-300">
            Machines:
            <input
              className="bg-secondary bg-opacity-60 mx-2 hover:bg-opacity-80 focus:bg-opacity-100 p-1 rounded-md text-tetriary caret-accent max-w-12 focus:outline-accent focus:outline-1 outline outline-transparent outline-1 duration-[470ms] ease-in-out transition-all"
              onChange={handleDynamicChange}
              name="machinesValue"
              type="text"
              value={solverData.machinesValue}
            />
          </label>
        </div>

        <div
          className={`group flex items-center transition-all ${
            solverData.editable ? "opacity-100" : "opacity-30"
          }`}
        >
          <label className="text-accent font-bold text-opacity-55 group-focus-within:text-opacity-100 transition-all duration-300">
            Recipe Time:
            <input
              disabled={!solverData.editable}
              className="bg-secondary bg-opacity-60 mx-2 hover:bg-opacity-80 focus:bg-opacity-100 p-1 rounded-md text-tetriary caret-accent max-w-12 focus:outline-accent focus:outline-1 outline outline-transparent outline-1 duration-[470ms] ease-in-out transition-all"
              onChange={handleDynamicChange}
              name="recipeTime"
              type="text"
              value={solverData.recipeTime}
            />
          </label>
          <Info
            helpText={
              "The time it takes to craft the item with a speed of 1.00"
            }
            customWidth="w-[170px]"
          ></Info>
        </div>

        <div
          className={`group flex items-center transition-all ${
            solverData.editable ? "opacity-100" : "opacity-30"
          }`}
        >
          <label className="text-accent font-bold text-opacity-55 group-focus-within:text-opacity-100 transition-all duration-300">
            Machine Speed:
          </label>
          <input
            disabled={!solverData.editable}
            className="bg-secondary bg-opacity-60 mx-2 hover:bg-opacity-80 focus:bg-opacity-100 p-1 rounded-md text-tetriary caret-accent max-w-12 focus:outline-accent focus:outline-1 outline outline-transparent outline-1 duration-[470ms] ease-in-out transition-all"
            onChange={handleDynamicChange}
            name="machineSpeed"
            type="text"
            value={solverData.machineSpeed}
          />
          <Info
            helpText={
              "The speed at which the machines operate. Assemblers 1 - 0.5 | 2 - 0.75 | 3 - 1.25"
            }
            customWidth="w-[170px]"
          ></Info>
        </div>
        <button
          onClick={() =>
            setSolverData((prev) => ({ ...prev, editable: !prev.editable }))
          }
          className={`${
            solverData.editable ? `opacity-100` : `opacity-70`
          } transition-all ml-2 w-5 cursor-pointer h-4 border-4 bg-secondary border-accent rounded-md`}
        ></button>
      </div>
    </>
  );
}
