import Image from "next/image";

const NoResults = () => {
    return (
        <div className="text-center justify-center items-center py-8 flex flex-col gap-4">
            <Image
                src="/illustrations/undraw_no_data.svg"
                className="w-full max-w-60"
                width={240}
                height={240}
                alt="No results"
            />
            <p className="text-lg">No results found</p>
        </div>
    );
};

export default NoResults;
