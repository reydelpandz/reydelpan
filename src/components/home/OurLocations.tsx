"use client";

import { MapPin, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const locations = [
    {
        id: "blida",
        name: "محل البليدة",
        phone: "0669087382",
        embedSrc:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3208.013451525813!2d2.818760476387918!3d36.48139118560511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128f0dc1f57e0a73%3A0xbae08e04d6a8041b!2srey%20del%20pan!5e0!3m2!1sen!2sdz!4v1763411483062!5m2!1sen!2sdz",
    },
    {
        id: "cheraga",
        name: "محل الشراقة",
        phone: "0696042764",
        embedSrc:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.406270097273!2d2.9452364763971763!3d36.76082006991756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb1002c60da49%3A0x5becab0912162460!2sRey%20del%20Pan!5e0!3m2!1sen!2sdz!4v1763411665589!5m2!1sen!2sdz",
    },
];

const OurLocations = () => {
    return (
        <section className="py-12 px-4">
            <h2 className="font-bold text-3xl md:text-5xl mb-8 text-center">
                تعالوا زورونا
            </h2>

            <Tabs
                defaultValue={locations[0].id}
                className="w-full max-w-4xl mx-auto"
            >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    {locations.map((location) => (
                        <TabsTrigger
                            key={location.id}
                            value={location.id}
                            className="flex items-center gap-2 text-sm sm:text-base py-3"
                        >
                            <MapPin className="h-4 w-4" />
                            <span>{location.name}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {locations.map((location) => (
                    <TabsContent
                        key={location.id}
                        value={location.id}
                        className="mt-0"
                    >
                        <div className="rounded-lg border bg-card overflow-hidden">
                            <iframe
                                src={location.embedSrc}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-64 sm:h-80 md:h-96"
                            />
                            <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t">
                                <h3 className="font-bold text-lg">
                                    {location.name}
                                </h3>
                                <Button variant="outline" asChild>
                                    <a
                                        href={`tel:${location.phone}`}
                                        className="flex items-center gap-2"
                                    >
                                        <Phone className="h-4 w-4" />
                                        <span dir="ltr">{location.phone}</span>
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </section>
    );
};

export default OurLocations;
