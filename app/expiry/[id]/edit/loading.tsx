const Loading = () => {
  return (
    <div className="h-screen-vh bg-black px-4 py-4 text-white">
      <div className="mx-auto h-full w-full max-w-4xl">
        <div className="rounded-xl h-full border border-gray-700 bg-gray-900 p-6">
          <div className="h-[98%] w-[98%] flex justify-center items-center">
            <p className="text-lg font-semibold text-gray-400">読み込み中...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading