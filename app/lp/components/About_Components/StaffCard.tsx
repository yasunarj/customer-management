import Image from "next/image";

const StaffCard = ({ name, image, comment, offsetUp }: { name: string, image: string, comment: string, offsetUp: boolean }) => {
  return (
    <div className={`relative flex-shrink-0 w-[240px] md:w-[300px] mx-2 bg-white shadow-lg rounded-xl overflow-hidden transition-transform duration-700 transform ease-in ${offsetUp ? "-translate-y-4" : ""}`}>
      <div className="relative w-full h-[360px] md:h-[420px]">
        <Image src={image} alt={name} fill className="object-cover" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
      </div>
      <div className="absolute bottom-0 left-0 text-white p-4 z-20">
        <p className="text-md font-semibold">{comment}</p>
        <p></p>
        <h3 className="text-lg font-bold">{name}</h3>
      </div>
    </div>
  );
};

export default StaffCard;