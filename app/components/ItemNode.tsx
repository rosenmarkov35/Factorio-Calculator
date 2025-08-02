import ItemDescription from "./ItemDescription";
import CategoryIcon from "../images/category.svg";
import { useProperties } from "../context/PropertiesContext";
import Image from "next/image";

export default function ItemNode({ itemName }: { itemName: string }) {
  const data = require("../gameItemSet.json");
  const { setItemSelected, setItemBrowserOpen } = useProperties();

  const item = data[itemName];
  const itemImage =
    item && item.imageURL
      ? item.imageURL
      : "https://wiki.factorio.com/images/Land_mine.png";

  return (
    <div className="group relative">
      {/* Item Image */}
      <img
        onClick={() => {
          setItemSelected(itemName);
          setItemBrowserOpen(false);
        }}
        className="w-3/4 aspect-square object-contain cursor-pointer hover:scale-[1.2] transition-all"
        src={itemImage}
        alt={itemName}
      />

      {/* Item Description */}
      <ItemDescription customWidth="w-[8rem]" helpText={item?.itemName ?? ""}>
        <div className="flex items-center">
          <img
            className="w-4 h-4 mr-2"
            src="https://wiki.factorio.com/images/Time.png"
            alt="Crafting Time"
          />
          {item?.craftingTime ?? "?"}s
        </div>
        <div className="flex items-center">
          <Image src={CategoryIcon} className="w-4 h-4 mr-2" alt="category" />
          <span>{item?.craftingCategory ?? "?"}</span>
        </div>
      </ItemDescription>
    </div>
  );
}
