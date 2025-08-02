type ItemDescriptionProps = {
  helpText: string;
  customWidth?: string;
  children?: React.ReactNode;
};

export default function ItemDescription({
  helpText,
  customWidth = ``,
  children,
}: ItemDescriptionProps) {
  return (
    <>
      <div className="group relative">
        <div
          style={{ boxShadow: "0px 0px 9px 0px rgba(0,0,0,0.5)" }}
          className={`z-50 absolute font-medium ${
            customWidth ? customWidth : "w-auto"
          } text-tetriary backdrop-blur-sm text-sm rounded-md top-3 p-2 outline-1 outline-zinc-700 bg-opacity-20  opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300`}
        >
          {helpText}
          <hr className="my-2 border-[1]" />
          {children}
        </div>
      </div>
    </>
  );
}
