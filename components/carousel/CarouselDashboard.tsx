import {
  Carousel,
  CarouselItem,
  CarouselPrevious,
  CarouselContent,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface CarouselDashboardProps {
  items: {
    type: string;
    name: string;
    image: string;
  }[],
  handleNavigation: (type: string) => void;
}

const CarouselDashboard = ({items, handleNavigation}: CarouselDashboardProps) => {
  return (
    <div className="w-full flex justify-center p-2">
      <Carousel className="w-[100%] md:w-[85%] lg:w-[70%]">
        <CarouselContent>
          {items.map((item) => {
            return (
              <CarouselItem key={item.type}>
                <div className="p-1 text-center opacity-90">
                  <Card className="max-w-[80%] mx-auto">
                    <CardHeader>
                      <Image
                        src={item.image}
                        alt="商材画像"
                        width={200}
                        height={200}
                        priority
                        loading="eager"
                        style={{objectFit: "cover"}}
                        className="w-[90%] mx-auto"
                      />
                    </CardHeader>
                    <CardContent className="text-center font-semibold text-gray-800 text-2xl sm:text-3xl">
                      <button
                        className="hover:text-blue-700 hover:underline hover:underline-offset-2"
                        onClick={() => handleNavigation(item.type)}
                      >
                        {item.name}
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default CarouselDashboard;
