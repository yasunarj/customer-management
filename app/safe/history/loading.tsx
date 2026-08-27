const Loading = () => {
  return (
    <div className="h-screen-vh bg-black flex justify-center items-center text-white">
      <div className="mx-auto max-w-4xl w-[90%] h-[90%]">
        <div className="rounded-xl p-6 flex items-center justify-center  border border-gray-700 bg-gray-900 h-full">
          読み込み中...
        </div>
      </div>
    </div>
  );
};

export default Loading;
