const Loading = () => {
  return (
    <div className="h-screen-vh bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full h-full max-w-4xl flex items-center justify-center">
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 h-[98%] w-[98%]">
          <div className="flex items-center justify-center h-full">
            <p className="text-lg font-semibold text-gray-400">読み込み中...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
