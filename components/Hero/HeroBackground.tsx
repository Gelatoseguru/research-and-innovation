import Image from "next/image";

interface HeroBackgroundProps {
  src: string;
  overlayClassName?: string;
}

export default function HeroBackground({
  src,
  overlayClassName = "bg-[#E3E1E0]/80",
}: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src= "/try.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}