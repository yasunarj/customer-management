import EditForm from "@/app/safe/components/editForm";
import { getSafeCheckDetailData } from "@/app/safe/lib/getSafeCheckDetailData";

const SafeCheckDataEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const detailId = parseInt(id, 10);
  const detailData = await getSafeCheckDetailData(detailId);

  return <EditForm detailData={detailData} />;
};

export default SafeCheckDataEditPage;
