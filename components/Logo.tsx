import Link from "next/link";
import React from "react";

function Logo() {
  return (
    <Link
      href={"/"}
      className="font-bold text-3xl text-transparent hover:cursor-pointer"
    >
      <h2 className="text-primaryColor">Immo<span className="text-black">Plateforme</span></h2>
    </Link>
  );
}

export default Logo;
