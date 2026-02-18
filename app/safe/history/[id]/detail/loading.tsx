const Loading = () => {
  return (
    <div className="h-screen-vh overflow-hidden bg-blue-200 flex justify-center items-center">
      <div className="bg-white w-[90%] h-[95%] rounded-xl overflow-y-scroll shadow-2xl flex justify-center items-center">
        <div className="text-gray-700">
          読み込み中...
        </div>
      </div>
    </div>
  );
};

export default Loading;
