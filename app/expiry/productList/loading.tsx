const Loading = () => {
  return (
    <div className="h-screen-vh bg-yellow-200 flex justify-center items-center">
      <div className="max-w-[900px] w-[80%] h-[80%] bg-white rounded-xl p-6 flex items-center justify-center">
        <div className="text-gray-700 text-xl font-semibold">
          読み込み中...
        </div>
      </div>
    </div>
  );
};

export default Loading