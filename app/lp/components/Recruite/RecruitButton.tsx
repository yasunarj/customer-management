const RecruitButton = ({ item }: {item: string}) => {
  return (
    <button className="group relative font-bold bg-white rounded-sm w-full py-3 hover:white hover:no-underline shadow-lg">
      <span className="text-[16px]">{item}</span>
      <div className="absolute top-3 right-3 w-[16px] overflow-hidden">
        <span className="flex transition-transform duration-300 ease-in-out transform group-hover:-translate-x-4">
          <span>➡︎</span>
          <span>➡︎</span>
        </span>
      </div>
    </button>
  );
};

export default RecruitButton;
