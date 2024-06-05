import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { AVATARS } from "@/constants"
import Image from "next/image"
import { useAvatarStore } from "@/app/avatars/page"

export function CarouselComponent(props) {
  const predictionAvatar = useAvatarStore((state) => state.predictionAvatar)
  return (
    <>
    <Carousel className="mx-5 sm:mx-10 w-80 max-w-xs">
    <CarouselPrevious />
      <CarouselNext className="mr-0"/>
      <CarouselContent>
        {AVATARS.map((item) => (
          <CarouselItem onClick={() => props.onClick(item)} className="basis-1/2 hover:opacity-70 " key={item.title}>
            <div className={item.videoUrl == predictionAvatar?.videoUrl ? 'p-0':'p-2 '}>
              <Card className={"bg-white bg-opacity-90  rounded-lg backdrop-filter backdrop-blur-lg"}>
                <CardContent className={item.videoUrl == predictionAvatar?.videoUrl ? 'ring-1 rounded-lg flex aspect-square items-center justify-center p-0':"flex aspect-square items-center justify-center p-0"}>
                <React.Suspense>
                <Image alt='thumbnails' className='' width={200} height={200} src={item.customThumbnail} />
                </React.Suspense>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      
    </Carousel>
    </>
  )
}
