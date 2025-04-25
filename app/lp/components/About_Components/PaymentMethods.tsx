import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import Image from "next/image";

const PaymentMethods = () => {
  return (
    <tr>
      <td className="p-2 border border-gray-400 font-semibold bg-gray-200 text-sm sm:text-[16px]">
        決済方法
      </td>
      <td className="relative p-2 px-4 border border-gray-400 flex flex-wrap gap-4 text-sm sm:text-[16px]">
        <Popover>
          <PopoverTrigger className="underline underline-offset-2 cursor-pointer text-blue-800">
            クレジットカード
          </PopoverTrigger>
          <PopoverContent className="absolute top-[36px] md:top-0 -left-[74px] md:-left-20 w-[278px] md:w-[600px] lg:w-[720px] xl:w-[840px] flex flex-wrap items-center gap-4  md:gap-8 border border-black bg-white p-2 mt-2">
            <div className="relative w-[24px] h-[24px] md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px] xl:w-[60px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_credit_contactless.jpg"
                alt="touch"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px] xl:w-[60px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_credit_visa.jpg"
                alt="VisaCard"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px] xl:w-[60px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_credit_mastercard.jpg"
                alt="MasterCard"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px] xl:w-[60px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_credit_saison.jpg"
                alt="SaisonCard"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px] xl:w-[60px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_credit_amex.jpg"
                alt="AmexCard"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px] xl:w-[60px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_credit_coml.png"
                alt="ClubOnCard"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px] xl:w-[60px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_credit_diners.jpg"
                alt="DinersClubCard"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px] xl:w-[60px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_credit_discover.jpg"
                alt="DiscoverCard"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px] xl:w-[60px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_credit_sevencard.png"
                alt="SevenCard"
                fill
                className="object-cover"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="underline underline-offset-2 cursor-pointer text-blue-800">
            電子マネー
          </PopoverTrigger>
          <PopoverContent className="absolute top-[36px] md:top-0 -left-[180px] md:-left-[200px] w-[278px] md:w-[456px] lg:w-[540px] xl:w-[1024px] flex flex-wrap items-center gap-4  md:gap-8 border border-black bg-white p-2 mt-2">
            <div className="relative w-[24px] h-[24px] md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px] xl:w-[60px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/window.png"
                alt="nanaco"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[36px] md:h-[36px] lg:w-[48px] lg:h-[48px] xl:w-[60px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_traffic_kitaca.png"
                alt="Kitaca"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[40px] md:h-[36px] lg:w-[52px] lg:h-[48px] xl:w-[64px] xl:h-[56px]">
              <Image
                src="/images/PaymentMethod/logo_l_traffic_suica.png"
                alt="Suika"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px] md:w-[52px] md:h-[40px] lg:w-[68px] lg:h-[56px] xl:w-[72px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_traffic_icoca.png"
                alt="icoca"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[52px] md:h-[40px] lg:w-[68px] lg:h-[56px] xl:w-[72px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_traffic_toica.png"
                alt="toica"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[30px] h-[24px]  md:w-[52px] md:h-[40px] lg:w-[68px] lg:h-[56px] xl:w-[72px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_traffic_sugoca.png"
                alt="sugoca"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[32px] h-[24px]  md:w-[56px] md:h-[40px] lg:w-[72px] lg:h-[56px] xl:w-[76px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_traffic_pasmo.png"
                alt="pasmo"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[32px] h-[24px]  md:w-[56px] md:h-[40px] lg:w-[72px] lg:h-[56px] xl:w-[76px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_traffic_nimoca.png"
                alt="nimoca"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[32px] h-[24px]  md:w-[56px] md:h-[40px] lg:w-[72px] lg:h-[56px] xl:w-[76px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_traffic_hayakaken.png"
                alt="hayakaken"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[32px] h-[24px]  md:w-[56px] md:h-[40px] lg:w-[72px] lg:h-[56px] xl:w-[76px] xl:h-[60px]">
              <Image
                src="/images/PaymentMethod/logo_l_traffic_manaca.png"
                alt="manaca"
                fill
                className="object-cover"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="underline underline-offset-2 cursor-pointer text-blue-800">
            楽天Edy
          </PopoverTrigger>
          <PopoverContent className="absolute top-0 -left-[24px] md:-left-[30px] w-[48px] md:w-[60px] lg:w-[72px] xl:w-[72px] flex flex-wrap items-center gap-4  md:gap-8 border border-black bg-white p-2 mt-2">
            <div className="relative w-[36px] h-[36px] md:w-[48px] md:h-[48px] lg:w-[56px] lg:h-[56px] xl:w-[64px] xl:h-[64px]">
              <Image
                src="/images/PaymentMethod/logo_edy.png"
                alt="Edy"
                fill
                className="object-cover"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="underline underline-offset-2 cursor-pointer text-blue-800">
            iD
          </PopoverTrigger>
          <PopoverContent className="absolute top-0 -left-[24px] md:-left-[30px] w-[48px] md:w-[60px] lg:w-[72px] xl:w-[72px] flex flex-wrap items-center gap-4  md:gap-8 border border-black bg-white p-2 mt-2">
            <div className="relative w-[36px] h-[36px] md:w-[48px] md:h-[48px] lg:w-[56px] lg:h-[56px] xl:w-[64px] xl:h-[64px]">
              <Image
                src="/images/PaymentMethod/logo_id.png"
                alt="iD"
                fill
                className="object-cover"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className="underline underline-offset-2 cursor-pointer text-blue-800">
            バーコード決済
          </PopoverTrigger>
          <PopoverContent className="absolute top-0 -left-[164px] md:-left-[418px] w-[278px] md:w-[540px] lg:w-[831px] xl:w-[1051px] flex flex-wrap items-center gap-4  md:gap-8 border border-black bg-white p-2 mt-2">
            <div className="relative w-[36px] h-[36px] md:w-[68px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/paypay.png"
                alt="PayPay"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[36px] h-[36px]  md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/linepay.png"
                alt="LinePay"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[36px] h-[36px]  md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/aupay.png"
                alt="auPAY"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[36px] h-[36px] md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/d_payment.png"
                alt="d-pay"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[36px] h-[36px]  md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/merpay.png"
                alt="merPay"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[36px] h-[36px]  md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/rakutenpay.png"
                alt="R-Pay"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[40px] h-[36px]  md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/yuchopay.png"
                alt="yuchoPay"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[36px] h-[36px]  md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/wechatpay.png"
                alt="wechatPay"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[36px] h-[36px]  md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/bankpay.png"
                alt="bankPay"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[40px] h-[36px]  md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/quocard_230726.png"
                alt="quocard-Pay"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[36px] h-[36px]  md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/smartcode.png"
                alt="smartCode"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[36px] h-[36px]  md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[120px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/jcoin.png"
                alt="jCoin"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-[80px] h-[36px]  md:w-[76px] md:h-[44px] lg:w-[104px] lg:h-[52px] xl:w-[136px] xl:h-[72px]">
              <Image
                src="/images/PaymentMethod/alipayplus.png"
                alt="alipay"
                fill
                className="object-cover"
              />
            </div>
          </PopoverContent>
        </Popover>
      </td>
    </tr>
  );
};

export default PaymentMethods;
