import CreateForm from "@/components/form/CreateForm";

type CreateNewDataPageProps = {
  params: Promise<{
    type: string;
  }>
}

const CreateNewDataPage = async (props: CreateNewDataPageProps) => {
  const params = await props.params;
  const { type } = params;
  const decodeType = decodeURIComponent(type);
  return (
    <div
      className="flex-grow bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: "url('/images/istockphoto-1499955814-612x612.jpg')", // cSpell: disable-line
      }}
    >
      <CreateForm type={decodeType} />
    </div>
  );
};

export default CreateNewDataPage;
