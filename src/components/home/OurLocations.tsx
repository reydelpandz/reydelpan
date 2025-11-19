import { MapPin, Phone } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const OurLocations = () => {
    const locations = [
        {
            name: "محل البليدة",
            phone: "0662108855",
            embedSrc:
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3208.013451525813!2d2.818760476387918!3d36.48139118560511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128f0dc1f57e0a73%3A0xbae08e04d6a8041b!2srey%20del%20pan!5e0!3m2!1sen!2sdz!4v1763411483062!5m2!1sen!2sdz",
        },
        {
            name: "محل الشراقة",
            phone: "0662108855",
            embedSrc:
                "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3196.406270097273!2d2.9452364763971763!3d36.76082006991756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb1002c60da49%3A0x5becab0912162460!2sRey%20del%20Pan!5e0!3m2!1sen!2sdz!4v1763411665589!5m2!1sen!2sdz",
        },
    ];

    return (
        <section className="">
            <h2 className="font-bold text-3xl md:text-5xl mb-12 text-center">
                تعالوا زورونا
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-10">
                {locations.map((location) => (
                    <div key={location.name} className="w-full">
                        <h4 className="text-center mb-4 text-lg sm:text-xl font-extrabold">
                            {location.name}
                        </h4>

                        <iframe
                            src={location.embedSrc}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-80"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OurLocations;
