import Link from "next/link";
import Logo from "@/components/Logo";
import {
    RiFacebookFill,
    RiInstagramFill,
    RiTiktokFill,
} from "@remixicon/react";
import ContactModal from "./ContactModal";

const links = [
    {
        collection: "التسوق",
        links: [
            { name: "المتجر", href: "/products" },
            { name: "التصنيفات", href: "/#categories" },
        ],
    },
    {
        collection: "خدمة العملاء",
        links: [
            { name: "الأسئلة الشائعة", href: "/#faq" },
            { name: "تواصلوا معنا", href: "?contact=visible" },
        ],
    },
];

export const socials = [
    {
        name: "Instagram",
        link: "https://www.instagram.com/rey.del.pan",
        icon: (
            <RiInstagramFill className="text-pink-600 hover:text-primary transition-colors duration-300" />
        ),
    },
    {
        name: "Facebook",
        link: "https://www.facebook.com/reydelpan2018",
        icon: (
            <RiFacebookFill className="text-blue-600 hover:text-primary transition-colors duration-300" />
        ),
    },
    {
        name: "Tiktok",
        link: "https://www.tiktok.com/@rey.del.pan",
        icon: (
            <RiTiktokFill className="text-zinc-900 hover:text-primary transition-colors duration-300" />
        ),
    },
];

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <ContactModal />
            <footer className="mt-16 bg-primary/5">
                <div className="mx-auto container">
                    <div className="flex flex-col items-center py-8 border-b border-neutral-300 dark:border-neutral-200">
                        <Logo className="mb-4" />
                        <p className="text-xl sm:text-2xl font-semibold text-center mb-2">
                            نعمل بالشغف، و نبدع بالطبيعة
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
                        {links.map((collection, idx) => (
                            <div key={idx} className="text-right">
                                <h3 className="text-lg font-semibold">
                                    {collection.collection}
                                </h3>
                                <ul className="mt-4 space-y-4 [&>li]:text-neutral-500">
                                    {collection.links.map((link, idx) => (
                                        <li
                                            key={idx}
                                            className="text-sm hover:text-neutral-600 dark:hover:text-neutral-400"
                                        >
                                            <Link href={link.href}>
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col md:flex-row justify-between border-t border-neutral-300 dark:border-neutral-200 py-8 gap-4">
                        <p className="text-sm text-neutral-500 text-center md:text-right">
                            جميع الحقوق محفوظة © {`${currentYear}-2018`} Rey del
                            Pan
                        </p>
                        <div className="flex gap-2.5 items-center justify-center md:justify-start">
                            {socials.map((social) => (
                                <Link key={social.name} href={social.link}>
                                    {social.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
