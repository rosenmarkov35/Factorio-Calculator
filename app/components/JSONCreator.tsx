import { useState, useEffect } from "react";

const INITIAL_JSON_OBJECT = {
  itemName: "", // The name of the item
  craftingTime: "1", // The time it takes to create the item
  outputQuantity: "1", // The quantity that is crafted
  ingredients: {}, // The ingredients that are needed for the item
  allowedDrills: [], // The drills that can be used to mine the item
  allowedMachines: [], // The machines that can be used to craft the item
  allowedSmelters: [], // The smelters that can be used to smelt the item
  craftingCategory: "Smelting", // The type of machine that is used to produce the item
  imageURL: "https://wiki.factorio.com/images/Electronic_circuit.png", // The URL of the image
  recipes: [],
};

export default function JSONCreator() {
  // Define state for the JSON properties
  const [jsonObject, setJsonObject] = useState(INITIAL_JSON_OBJECT);

  const [generalStates, setGeneralStates] = useState({
    tipVisibility: true,
    createJsonObjectVisibility: true,
  });

  const [datasetObject, setDatasetObject] = useState({});

  const [recipeBrowserOpen, setRecipeBrowserOpen] = useState(false);
  const [ingredientBrowserOpen, setIngredientBrowserOpen] = useState(false);
  const [drillBrowserOpen, setDrillBrowserOpen] = useState(false);
  const [smelterBrowserOpen, setSmelterBrowserOpen] = useState(false);
  const [machineBrowserOpen, setMachineBrowserOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Reset search term when browser closes
  useEffect(() => {
    if (!ingredientBrowserOpen) setSearchTerm("");
  }, [ingredientBrowserOpen]);

  // Handle key presses for ingredient browser
  useEffect(() => {
    // Only add the listener if any browser is open
    if (
      !ingredientBrowserOpen &&
      !drillBrowserOpen &&
      !smelterBrowserOpen &&
      !machineBrowserOpen &&
      !recipeBrowserOpen
    )
      return;

    const handleKeyDown = (e) => {
      if (e.key.length === 1 && /^[a-zA-Z0-9_]$/.test(e.key)) {
        setSearchTerm((prev) => prev + e.key);
      }
      if (e.key === "Backspace") {
        setSearchTerm((prev) => prev.slice(0, -1));
      }
      if (e.key === "Escape") {
        setIngredientBrowserOpen(false);
        setDrillBrowserOpen(false);
        setSmelterBrowserOpen(false);
        setMachineBrowserOpen(false);
        setRecipeBrowserOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    ingredientBrowserOpen,
    drillBrowserOpen,
    smelterBrowserOpen,
    machineBrowserOpen,
    recipeBrowserOpen,
  ]);

  // The 'datasetObject' is an object containing the information for all the items being created

  function addItem(item) {
    setDatasetObject((prev) => ({
      ...prev,
      [camelCase(item.itemName)]: {
        itemName: item.itemName,
        craftingTime: item.craftingTime,
        outputQuantity: item.outputQuantity,
        ingredients: item.ingredients,
        craftingCategory: camelCase(item.craftingCategory),
        imageURL: item.imageURL,
      },
    }));
    setJsonObject(INITIAL_JSON_OBJECT); // Reset the form inputs to initial state
  }

  // Handle changes to inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJsonObject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // camelCase function
  function camelCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join("");
  }

  function toItemNameFormat(str) {
    if (!str) return "";
    // Convert camelCase or any string to "Item_name"
    return str
      .replace(/([A-Z])/g, "_$1") // insert _ before capitals
      .replace(/^_/, "") // remove leading _
      .replace(/ /g, "_") // replace spaces with _
      .replace(/_{2,}/g, "_") // replace multiple _ with single _
      .replace(/^./, (c) => c.toUpperCase()); // capitalize first letter
  }

  // Convert the state to JSON string
  const getJsonString = () => {
    let updatedJsonObject = {
      ...jsonObject,
      itemName: camelCase(jsonObject.itemName),
      craftingCategory: camelCase(jsonObject.craftingCategory),
    };
    return JSON.stringify(updatedJsonObject, null, 2); // Pretty print JSON
  };

  const getDatasetString = () => {
    return JSON.stringify(datasetObject, null, 2);
  };

  // Download JSON as file
  const downloadItem = () => {
    const element = document.createElement("a");
    const file = new Blob([getJsonString()], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "data.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const downloadItemSet = () => {
    const element = document.createElement("a");
    const file = new Blob([getDatasetString()], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "itemSet.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  useEffect(() => {
    setJsonObject((prev) => ({
      ...prev,
      imageURL: `https://wiki.factorio.com/images/${toItemNameFormat(
        prev.itemName
      )}.png`,
    }));
  }, [jsonObject.itemName]);

  return (
    <div className="m-4 text-tetriary font-semibold outline-dotted p-4 outline-3 outline-primary">
      {generalStates.createJsonObjectVisibility && (
        <>
          <h3
            onClick={() =>
              setGeneralStates((prev) => ({
                ...prev,
                createJsonObjectVisibility: false,
              }))
            }
          >
            Create JSON Object
          </h3>
          <br></br>
          <label>
            Item Name:
            <input
              type="text"
              name="itemName"
              value={jsonObject.itemName}
              onChange={handleChange}
              className="rounded-sm bg-primary ml-4 outline outline-1 outline-tetriary my-1"
            />
          </label>
          <br />
          <label>
            Crafting Time:
            <input
              type="number"
              step={0.1}
              name="craftingTime"
              value={jsonObject.craftingTime}
              onChange={handleChange}
              className="rounded-sm bg-primary ml-4 outline outline-1 outline-tetriary my-1 w-1/6"
            />
          </label>
          <br />
          <label>
            Output Quantity:
            <input
              type="number"
              name="outputQuantity"
              value={jsonObject.outputQuantity}
              onChange={handleChange}
              className="rounded-sm bg-primary ml-4 outline outline-1 outline-tetriary my-1 w-1/6"
            />
          </label>
          <br />
          <label>
            Recipes:
            <button
              type="button"
              className="ml-2 px-2 bg-accent text-white rounded hover:bg-error"
              onClick={() => setRecipeBrowserOpen(true)}
              title="Add Recipe"
            >
              +
            </button>
            <br />
            {/* Show selected recipes */}
            <div className="flex flex-wrap gap-2 my-2">
              {(jsonObject.recipes || []).map((r, i) => (
                <span
                  key={i}
                  className="bg-primary px-2 py-1 rounded text-xs cursor-pointer"
                  onClick={() => {
                    setJsonObject((prev) => ({
                      ...prev,
                      recipes: prev.recipes.filter((recipe) => recipe !== r),
                    }));
                  }}
                  title="Remove recipe"
                >
                  {r}
                </span>
              ))}
            </div>
            {/* Recipe browser modal/dropdown */}
            {recipeBrowserOpen && (
              <div className="absolute z-50 bg-zinc-800 border border-zinc-600 rounded p-2 max-h-40 overflow-y-auto shadow-lg">
                {Object.keys(require("../gameRecipesSet.json")).map(
                  (recipeKey) => (
                    <div
                      key={recipeKey}
                      className="cursor-pointer hover:bg-zinc-700 px-2 py-1 rounded"
                      onClick={() => {
                        setJsonObject((prev) => ({
                          ...prev,
                          recipes: [...(prev.recipes || []), recipeKey],
                        }));
                        setRecipeBrowserOpen(false);
                      }}
                    >
                      {recipeKey}
                    </div>
                  )
                )}
                <button
                  className="mt-2 text-xs text-red-400 hover:text-red-600"
                  onClick={() => setRecipeBrowserOpen(false)}
                >
                  Close
                </button>
              </div>
            )}
          </label>
          <label>
            Ingredients:
            <button
              type="button"
              className="ml-2 px-2 bg-accent text-white rounded hover:bg-error"
              onClick={() => setIngredientBrowserOpen(true)}
              title="Add Ingredient"
            >
              +
            </button>
            <br />
            <div className="flex flex-wrap gap-2 my-2">
              {Object.entries(jsonObject.ingredients || {}).map(
                ([key, value], i) => (
                  <span
                    key={i}
                    className="bg-primary px-2 py-1 rounded text-xs flex items-center gap-2 cursor-pointer"
                    title="Remove ingredient"
                  >
                    <span
                      onClick={() => {
                        setJsonObject((prev) => {
                          const newIngredients = { ...prev.ingredients };
                          delete newIngredients[key];
                          return { ...prev, ingredients: newIngredients };
                        });
                      }}
                      className="mr-2 hover:text-red-400"
                      title="Remove"
                      style={{ cursor: "pointer" }}
                    >
                      ✕
                    </span>
                    {key}:
                    <input
                      type="number"
                      min={1}
                      value={value}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const amount = Math.max(1, Number(e.target.value));
                        setJsonObject((prev) => ({
                          ...prev,
                          ingredients: {
                            ...prev.ingredients,
                            [key]: amount,
                          },
                        }));
                      }}
                      className="w-12 ml-1 rounded bg-zinc-700 text-tetriary px-1"
                      style={{ fontSize: "0.9em" }}
                    />
                  </span>
                )
              )}
            </div>
            {ingredientBrowserOpen && (
              <div className="absolute z-50 bg-zinc-800 border border-zinc-600 rounded p-2 max-h-40 overflow-y-auto shadow-lg min-w-[200px]">
                <div className="text-xs text-zinc-400 mb-2">
                  Type to filter:{" "}
                  <span className="font-mono text-accent">{searchTerm}</span>
                  <button
                    className="ml-2 text-xs text-red-400 hover:text-red-600"
                    onClick={() => setIngredientBrowserOpen(false)}
                  >
                    Close
                  </button>
                </div>
                {Object.keys(require("../gameItemSet.json"))
                  .filter((itemKey) =>
                    itemKey.toLowerCase().startsWith(searchTerm.toLowerCase())
                  )
                  .map((itemKey) => (
                    <div
                      key={itemKey}
                      className="cursor-pointer hover:bg-zinc-700 px-2 py-1 rounded"
                      onClick={() => {
                        setJsonObject((prev) => ({
                          ...prev,
                          ingredients: {
                            ...prev.ingredients,
                            [itemKey]: 1,
                          },
                        }));
                        setIngredientBrowserOpen(false);
                      }}
                    >
                      {itemKey}
                    </div>
                  ))}
                {searchTerm && (
                  <div className="text-xs text-zinc-500 mt-2">
                    {Object.keys(require("../gameItemSet.json")).filter((itemKey) =>
                      itemKey.toLowerCase().startsWith(searchTerm.toLowerCase())
                    ).length === 0 && "No items found."}
                  </div>
                )}
              </div>
            )}
          </label>
          <label>
            Allowed Drills:
            <button
              type="button"
              className="ml-2 px-2 bg-accent text-white rounded hover:bg-error"
              onClick={() => setDrillBrowserOpen(true)}
              title="Add Drill"
            >
              +
            </button>
            <br />
            <div className="flex flex-wrap gap-2 my-2">
              {(jsonObject.allowedDrills || []).map((drill, i) => (
                <span
                  key={i}
                  className="bg-primary px-2 py-1 rounded text-xs cursor-pointer"
                  onClick={() => {
                    setJsonObject((prev) => ({
                      ...prev,
                      allowedDrills: prev.allowedDrills.filter(
                        (d) => d !== drill
                      ),
                    }));
                  }}
                  title="Remove drill"
                >
                  {drill}
                </span>
              ))}
            </div>
            {drillBrowserOpen && (
              <div className="absolute z-50 bg-zinc-800 border border-zinc-600 rounded p-2 max-h-40 overflow-y-auto shadow-lg">
                {Object.keys(require("../gameDrillSet.json")).map((itemKey) => (
                  <div
                    key={itemKey}
                    className="cursor-pointer hover:bg-zinc-700 px-2 py-1 rounded"
                    onClick={() => {
                      setJsonObject((prev) => ({
                        ...prev,
                        allowedDrills: [...(prev.allowedDrills || []), itemKey],
                      }));
                      setDrillBrowserOpen(false);
                    }}
                  >
                    {itemKey}
                  </div>
                ))}
                <button
                  className="mt-2 text-xs text-red-400 hover:text-red-600"
                  onClick={() => setDrillBrowserOpen(false)}
                >
                  Close
                </button>
              </div>
            )}
          </label>
          <label>
            Allowed Smelters:
            <button
              type="button"
              className="ml-2 px-2 bg-accent text-white rounded hover:bg-error"
              onClick={() => setSmelterBrowserOpen(true)}
              title="Add Smelter"
            >
              +
            </button>
            <br />
            <div className="flex flex-wrap gap-2 my-2">
              {(jsonObject.allowedSmelters || []).map((smelter, i) => (
                <span
                  key={i}
                  className="bg-primary px-2 py-1 rounded text-xs cursor-pointer"
                  onClick={() => {
                    setJsonObject((prev) => ({
                      ...prev,
                      allowedSmelters: prev.allowedSmelters.filter(
                        (s) => s !== smelter
                      ),
                    }));
                  }}
                  title="Remove smelter"
                >
                  {smelter}
                </span>
              ))}
            </div>
            {smelterBrowserOpen && (
              <div className="absolute z-50 bg-zinc-800 border border-zinc-600 rounded p-2 max-h-40 overflow-y-auto shadow-lg">
                {Object.keys(require("../gameSmelterSet.json")).map(
                  (itemKey) => (
                    <div
                      key={itemKey}
                      className="cursor-pointer hover:bg-zinc-700 px-2 py-1 rounded"
                      onClick={() => {
                        setJsonObject((prev) => ({
                          ...prev,
                          allowedSmelters: [
                            ...(prev.allowedSmelters || []),
                            itemKey,
                          ],
                        }));
                        setSmelterBrowserOpen(false);
                      }}
                    >
                      {itemKey}
                    </div>
                  )
                )}
                <button
                  className="mt-2 text-xs text-red-400 hover:text-red-600"
                  onClick={() => setSmelterBrowserOpen(false)}
                >
                  Close
                </button>
              </div>
            )}
          </label>
          <label>
            Allowed Machines:
            <button
              type="button"
              className="ml-2 px-2 bg-accent text-white rounded hover:bg-error"
              onClick={() => setMachineBrowserOpen(true)}
              title="Add Machine"
            >
              +
            </button>
            <br />
            <div className="flex flex-wrap gap-2 my-2">
              {(jsonObject.allowedMachines || []).map((machine, i) => (
                <span
                  key={i}
                  className="bg-primary px-2 py-1 rounded text-xs cursor-pointer"
                  onClick={() => {
                    setJsonObject((prev) => ({
                      ...prev,
                      allowedMachines: prev.allowedMachines.filter(
                        (m) => m !== machine
                      ),
                    }));
                  }}
                  title="Remove machine"
                >
                  {machine}
                </span>
              ))}
            </div>
            {machineBrowserOpen && (
              <div className="absolute z-50 bg-zinc-800 border border-zinc-600 rounded p-2 max-h-40 overflow-y-auto shadow-lg">
                {Object.keys(require("../gameAssemblerSet.json")).map(
                  (itemKey) => (
                    <div
                      key={itemKey}
                      className="cursor-pointer hover:bg-zinc-700 px-2 py-1 rounded"
                      onClick={() => {
                        setJsonObject((prev) => ({
                          ...prev,
                          allowedMachines: [
                            ...(prev.allowedMachines || []),
                            itemKey,
                          ],
                        }));
                        setMachineBrowserOpen(false);
                      }}
                    >
                      {itemKey}
                    </div>
                  )
                )}
                <button
                  className="mt-2 text-xs text-red-400 hover:text-red-600"
                  onClick={() => setMachineBrowserOpen(false)}
                >
                  Close
                </button>
              </div>
            )}
          </label>
          <label>
            Crafting Category:
            <select
              value={jsonObject.craftingCategory}
              name="craftingCategory"
              id="craftingCategory"
              onChange={handleChange}
              className="rounded-sm bg-primary ml-4 outline outline-1 outline-tetriary my-1"
            >
              <option value="Smelting">Smelting</option>
              <option value="Assembling">Assembling</option>
              <option value="Chemical">Chemical</option>
              <option value="Rocket">Rocket</option>
            </select>
          </label>
          <br />
          <label>
            Image URL:
            <input
              type="text"
              value={`https://wiki.factorio.com/images/${toItemNameFormat(
                jsonObject.itemName
              )}.png`}
              name="imageURL"
              id="imageURL"
              readOnly
              className="rounded-sm bg-primary ml-4 outline outline-1 outline-tetriary my-1"
            />
            <img
              src={`https://wiki.factorio.com/images/${toItemNameFormat(
                jsonObject.itemName
              )}.png`}
              className="w-10"
              alt=""
            />
          </label>
          <br />
          {generalStates.tipVisibility && (
            <h2
              onClick={() => {
                setGeneralStates((prev) => ({ ...prev, tipVisibility: false }));
              }}
              className="text-red-500 text-sm hover:text-amber-400 transition-all duration-300 cursor-pointer"
            >
              Item names and other data are stored in camelCase!
            </h2>
          )}
          <h4>JSON Output:</h4>
          <pre className="text-zinc-600 h-32 overflow-scroll">
            {getJsonString()}
          </pre>

          <button onClick={() => addItem(jsonObject)}>Add Item</button>
          <br></br>
          <button className="ml-5" onClick={downloadItem}>
            Download Item
          </button>
          <button className="ml-5" onClick={downloadItemSet}>
            Download Item Set
          </button>
        </>
      )}
    </div>
  );
}
