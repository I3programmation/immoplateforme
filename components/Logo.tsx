import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link
      href={"/"}
      className="font-bold text-3xl text-transparent bg-clip-text bg-orange-600 hover:cursor-pointer"
    >
      Immo<span className="text-white">Plateforme</span>
    </Link>
  );
}

export default Logo;
