"use client";

import { RiBox3Line, RiCalendar2Line, RiTruckLine } from "@remixicon/react";
import CountUp from "react-countup";

interface StatsSectionProps {
    deliveredOrdersCount: number;
    deliveredProductsCount: number;
}

const Stats = ({
    deliveredOrdersCount,
    deliveredProductsCount,
}: StatsSectionProps) => {
    const launchDate = new Date(2018, 6, 1);
    const today = new Date();
    const daysSinceLaunch = Math.floor(
        (today.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const stats = [
        {
            value: deliveredOrdersCount,
            label: "طلب تم توصيله",
            icon: RiTruckLine,
        },
        {
            value: deliveredProductsCount,
            label: "منتج تم توصيله",
            icon: RiBox3Line,
        },
        {
            value: daysSinceLaunch,
            label: "يوم من العمل المتواصل",
            icon: RiCalendar2Line,
        },
    ];

    return (
        <section>
            <h2 className="font-bold text-3xl md:text-5xl mb-12 text-center">
                إنجازاتنا
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="relative group bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                <stat.icon />
                            </div>

                            <div className="text-4xl md:text-5xl font-bold text-foreground">
                                <CountUp
                                    end={stat.value}
                                    duration={2.5}
                                    separator=","
                                    enableScrollSpy
                                    scrollSpyOnce
                                />
                                <span className="text-primary">+</span>
                            </div>

                            <p className="text-muted-foreground text-lg font-medium">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
