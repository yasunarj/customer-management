import AboutService from "./AboutService";
import PaymentMethods from "./PaymentMethods";

const GOOGLE_MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6399.688763217575!2d139.95099977770994!3d36.678242499999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601f630a6479c929%3A0xe148d7d80e5df8d!2z44K744OW44OzLeOCpOODrOODluODsyDjgZXjgY_jgonlja_jga7ph4zvvJTkuIHnm67lupc!5e0!3m2!1sja!2sjp!4v1742980781471!5m2!1sja!2sjp";

const AboutAccess = () => {
  return (
    <div className="mx-auto max-w-[1500px] h-[900px] sm:h-[840px] md:h-[1060px] lg:h-[1040px] xl:h-[980px] -mt-[52px] sm:mt-[64px] md:mt-[188px] lg:mt-[212px] xl:mt-[252px]">
      <table className="table-auto w-full xl:h-[240px] border-collapse border mt-4 text-gray-900">
        <tbody>
          <tr>
            <td className="p-2 border border-gray-400 font-semibold bg-gray-200 text-sm sm:text-[16px]">
              名称
            </td>
            <td className="p-2 px-4 border border-gray-400  text-sm sm:text-[16px]">
              さくら卯の里４丁目店
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-400 font-semibold bg-gray-200 text-sm sm:text-[16px]">
              住所
            </td>
            <td className="p-2 px-4 border border-gray-400  text-sm sm:text-[16px]">
              栃木県さくら市卯の里４丁目５５-１
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-400 font-semibold bg-gray-200 text-sm sm:text-[16px]">
              電話番号
            </td>
            <td className="p-2 px-4 border border-gray-400  text-sm sm:text-[16px]">
              028-682-9365
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-400 font-semibold bg-gray-200 text-sm sm:text-[16px]">
              アクセス
            </td>
            <td className="p-2 px-4 border border-gray-400  text-sm sm:text-[16px]">
              氏家駅から徒歩10分
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-400 font-semibold bg-gray-200 text-sm sm:text-[16px]">
              駐車場
            </td>
            <td className="p-2 px-4 border border-gray-400  text-sm sm:text-[16px]">
              駐車可能台数 25台
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-400 font-semibold bg-gray-200 text-sm sm:text-[16px]">
              営業時間
            </td>
            <td className="p-2 px-4 border border-gray-400  text-sm sm:text-[16px]">
              24時間営業
            </td>
          </tr>
          <tr>
            <td className="w-[80px] sm:w-[15%] p-2 border border-gray-400 font-semibold bg-gray-200 text-sm sm:text-[16px]">
              地図
            </td>
            <td className="p-1 sm:p-2 md:p-4 border h-[260px] md:h-[400px] border-gray-400 text-sm sm:text-[16px]">
              <iframe
                src={GOOGLE_MAP_EMBED_SRC}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-[100%] max-w-[1200px] mx-auto h-[100%] border sm:border-black shadow-lg rounded-sm"
              ></iframe>
            </td>
          </tr>
          <tr>
            <td className="p-2 border border-gray-400 font-semibold bg-gray-200 text-sm sm:text-[16px]">
              サービス
            </td>
            <td className="p-2 px-4 border border-gray-400">
              <AboutService />
            </td>
          </tr>
          <PaymentMethods />
        </tbody>
      </table>
    </div>
  );
};

export default AboutAccess;
