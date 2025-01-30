import CreateForm from "@/components/form/CreateForm";

const CreateNewDataPage = async ({ params }: { params: { type: string } }) => {
  const { type } = await params;
  const decodeType = decodeURIComponent(type);
  return (
    <div
      className="flex-grow bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: "url('/images/istockphoto-1499955814-612x612.jpg')",
      }}
    >
      <CreateForm type={decodeType} />
    </div>
  );
};

export default CreateNewDataPage;
