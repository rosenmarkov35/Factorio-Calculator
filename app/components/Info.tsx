import Image from "next/image";
import infoIcon from "../images/info.svg";

export default function Info({
  helpText,
  customWidth = ``,
}: {
  helpText: string;
  customWidth?: string;
}) {
  return (
    <>
      <div className="group relative">
        <Image src={infoIcon} alt="info" className="w-3" />
        <div
          className={`z-50 absolute ${customWidth} text-tetriary text-sm rounded-md top-3 p-2 outline-1 outline-zinc-700 bg-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300`}
        >
          {helpText}
        </div>
      </div>
    </>
  );
}
