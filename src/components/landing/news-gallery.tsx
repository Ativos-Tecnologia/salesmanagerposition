'use client';

import { ArrowLeft, ArrowRight,  } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '../ui/button';
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '../ui/carousel';


interface GalleryItem {
    id: string;
    title: string;
    summary: string;
    url: string;
    image: string;
}

interface Gallery6Props {
    heading?: string;
    items?: GalleryItem[];
}

const NewsGallery = ({
    heading = 'Gallery',
    items = [
        {
            id: 'item-1',
            title: 'Build Modern UIs',
            summary: 'Create stunning user interfaces with our comprehensive design system.',
            url: '#',
            image: '/images/block/placeholder-dark-1.svg',
        },
        {
            id: 'item-2',
            title: 'Computer Vision Technology',
            summary:
                'Powerful image recognition and processing capabilities that allow AI systems to analyze, understand, and interpret visual information from the world.',
            url: '#',
            image: '/images/block/placeholder-dark-1.svg',
        },
        {
            id: 'item-3',
            title: 'Machine Learning Automation',
            summary:
                'Self-improving algorithms that learn from data patterns to automate complex tasks and make intelligent decisions with minimal human intervention.',
            url: '#',
            image: '/images/block/placeholder-dark-1.svg',
        },
        {
            id: 'item-4',
            title: 'Predictive Analytics',
            summary:
                'Advanced forecasting capabilities that analyze historical data to predict future trends and outcomes, helping businesses make data-driven decisions.',
            url: '#',
            image: '/images/block/placeholder-dark-1.svg',
        },
        {
            id: 'item-5',
            title: 'Neural Network Architecture',
            summary:
                'Sophisticated AI models inspired by human brain structure, capable of solving complex problems through deep learning and pattern recognition.',
            url: '#',
            image: '/images/block/placeholder-dark-1.svg',
        },
    ],
}: Gallery6Props) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    useEffect(() => {
        if (!carouselApi) {
            return;
        }
        const updateSelection = () => {
            setCanScrollPrev(carouselApi.canScrollPrev());
            setCanScrollNext(carouselApi.canScrollNext());
        };
        updateSelection();
        carouselApi.on('select', updateSelection);
        return () => {
            carouselApi.off('select', updateSelection);
        };
    }, [carouselApi]);
    return (
        <section className="mx-auto bg-white  w-full max-w-7xl rounded-3xl border-t border-r border-b border-l-6 border-l-[#000000] shadow-[8px_8px_0_rgba(0,30,98,0.1)] transition-all duration-400 relative hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_rgba(0,30,98,0.15)] py-4 md:py-8 lg:border-t lg:border-r lg:border-b lg:border-l-6 lg:p-8 lg:py-6 2xl:border-t 2xl:border-r 2xl:border-b 2xl:border-l-6 2xl:p-8 2xl:py-4  3xl:border-none 3xl:p-0 3xl:py-6">
            <div className="mx-auto w-full ">
                <div className="mb-6 flex items-center justify-between px-8  md:mb-14  lg:mb-6 2xl:mb-4 3xl:mb-6">
                    <div>
                        <h2 className=" text-xl font-semibold  md:text-2xl ">{heading}</h2>
                    </div>
                    <div className=" flex shrink-0 items-center justify-start gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollPrev();
                            }}
                            disabled={!canScrollPrev}
                            className="disabled:pointer-events-auto"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollNext();
                            }}
                            disabled={!canScrollNext}
                            className="disabled:pointer-events-auto"
                        >
                            <ArrowRight className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <Carousel
                    setApi={setCarouselApi}
                    opts={{
                        breakpoints: {
                            '(max-width: 768px)': {
                                dragFree: true,
                            },
                        },
                    }}
                    className="relative lg:left-[-1rem]"
                >
                    <CarouselContent className=" ml-8  2xl:max-w-5xl">
                        {items.map((item) => (
                            <CarouselItem
                                key={item.id}
                                className="max-w-[200px] pl-4 md:max-w-[300px] lg:max-w-[230px]  2xl:max-w-[230px] 3xl:max-w-[300px]"
                            >
                                <a
                                    href={item.url}
                                    className="group flex flex-col justify-between"
                                    target="_blank"
                                >
                                    <div>
                                        <div className="flex aspect-[3/2] overflow-clip rounded-xl border border-border">
                                            <div className="flex-1 ">
                                                <div className="relative h-full w-full origin-bottom  transition duration-300 group-hover:scale-105">
                                                    <img src={item.image} alt={item.title} className="h-full w-full object-cover object-top " />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-2 line-clamp-3  pt-4 text-base  font-medium md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-base">
                                        {item.title}
                                    </div>
                                    <div className="mb-8 line-clamp-2 text-sm text-muted-foreground md:mb-12 md:text-sm lg:mb-4">
                                        {item.summary}
                                    </div>
                                    <div className="flex items-center text-sm">
                                        Ver mais{' '}
                                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </a>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
};

export { NewsGallery };
