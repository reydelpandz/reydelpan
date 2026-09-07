import { buttonVariants } from "@/components/ui/button";

const Award = () => {
    return (
        <section id="award">
            <link
                rel="stylesheet"
                href="https://awards.infcdn.net/delivery_takeaway/delivery_circ_large.css"
                precedence="default"
            />

            <h2 className="font-bold text-3xl md:text-5xl mb-12 text-center">
                جائزة أفضل مأكولات جاهزة في البليدة
            </h2>

            <div className="flex flex-col items-center gap-8">
                <div id="delivery_bage_circ" className="en" dir="ltr">
                    <div className="bage_wrapper">
                        <div
                            className="bage_icon"
                            style={{
                                background:
                                    "url('https://restaurantguru.com/css/badge/img/takeaway_red.svg') no-repeat center center",
                            }}
                        >
                            &nbsp;
                        </div>
                        <a
                            className="bage_header"
                            href="https://restaurantguru.com/rey-del-pan-Blida-2"
                            target="_blank"
                            rel="noopener"
                        >
                            rey del pan
                        </a>
                        <div className="bage_city">
                            <span>Best takeaway food</span>
                            <span className="bage_city_name">in Blida</span>
                        </div>
                        <a
                            className="bage_title"
                            href="https://restaurantguru.com"
                            target="_blank"
                            rel="noopener"
                        >
                            <span>on Restaurant Guru</span>
                            <span>2026</span>
                        </a>
                    </div>
                </div>

                <p className="text-lg leading-relaxed text-center max-w-2xl">
                    توّجنا موقع Restaurant Guru بجائزة أفضل مأكولات جاهزة لسنة
                    2026، تقديرًا لجودة خبزنا وبيتزاتنا ولمكوناتنا الطبيعية
                    الصحية.
                    <br />
                    شكرًا لثقتكم التي جعلت هذا التتويج ممكنًا.
                </p>

                <a
                    className={buttonVariants({
                        variant: "outline",
                        className: "px-8",
                    })}
                    href="https://restaurantguru.com/rey-del-pan-Blida-2"
                    target="_blank"
                    rel="noopener"
                >
                    صفحتنا على Restaurant Guru
                </a>
            </div>
        </section>
    );
};

export default Award;
