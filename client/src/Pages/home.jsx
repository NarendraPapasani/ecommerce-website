import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import Products from "./products";

const carouselItems = [
  {
    src: "https://bfasset.costco-static.com/56O3HXZ9/at/cks9hhpn2v9wsztfxn769b8t/d_25w03268_hero_shark_flexstyle.jpg?auto=webp&format=jpg",
    link: "https://example.com/item1",
  },
  {
    src: "https://bfasset.costco-static.com/56O3HXZ9/at/wv5k9x5252s8mz8g9brrs7/d_25w03261_cat_dell_inspiron.jpg",
    link: "https://example.com/item2",
  },
  {
    src: "https://cdn.bfldr.com/56O3HXZ9/at/x47gxtps4k5c44nrnw69w5/d-25w03151__homepage_hero_LG_appliance.jpg?auto=webp&format=jpg",
    link: "https://example.com/item3",
  },
];

const Home = () => {
  return (
    <>
      <div className="p-12">
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
        >
          <CarouselPrevious />
          <CarouselContent>
            {carouselItems.map((item, index) => (
              <CarouselItem key={index} className="flex justify-center">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={item.src}
                    className="md:rounded-full rounded-lg md:h-auto h-64"
                    alt={`carousel-item-${index}`}
                  />
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext />
        </Carousel>
        <div>
          <Products />
        </div>
      </div>
    </>
  );
};

export default Home;
