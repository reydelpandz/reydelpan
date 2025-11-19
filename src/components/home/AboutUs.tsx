const AboutUs = () => {
    return (
        <section className="" id="about">
            {/* Header */}
            <div className="mb-4">
                <p className="text-sm mb-6 bg-primary text-primary-foreground w-fit px-2 py-0.5 rounded-md">
                    ذوق الخبز الحقيقي
                </p>
                <h2 className="text-3xl md:text-5xl mb-12 leading-12 md:leading-16">
                    مخبز صحي متميز يقدم تجربة فريدة، حيث الجودة والنكهات
                    الطبيعية تلتقي لتقديم أفضل تجربة طعام صحية ولذيذة
                </h2>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Right Content */}
                <div className="flex flex-col h-full">
                    {/* Top Image */}
                    <div className="w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden mb-4">
                        <img
                            src="/images/photo2.jpg"
                            alt="Fresh bread display"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <p className="text-lg md:text-xl leading-relaxed">
                        مخبزنا يسعى لتقديم أفضل المخبوزات الصحية والمغذية، مع
                        التركيز على المكونات الطبيعية والخالية من المواد
                        الحافظة.
                        <br /> نقدم خبزًا طازجًا وكعكًا صحيًا مصنوعًا بأيدي
                        خبازين محترفين يهتمون بالتفاصيل والجودة في كل منتج.
                        منتجاتنا متوازنة غذائيًا، غنية بالعناصر المفيدة، طازجة
                        ولذيذة، لتجربة غذاء ممتعة وصحية تضمن التميز في الطعم
                        والفائدة الغذائية مع كل قضمة.
                    </p>
                </div>

                {/* Left Image */}
                <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                    <img
                        src="/images/photo1.jpg"
                        alt="Artisan bread"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
