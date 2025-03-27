import { UserButton } from "@clerk/nextjs";
import React, { ReactNode } from "react";
import Logo from "@/components/Logo";
import { Lock, LogOut  } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">


      <nav className="flex flex-col w-full border-b border-border">


        {/* UPPER NAV */}
        <div className="flex justify-between items-center border-b border-border  px-4 py-2 bg-backgroundColor">
          <Logo />
          <div className="flex gap-4 items-center ">
            <ThemeSwitcher />
          </div>
        </div>

        {/* LOWER NAV */}
        <div className="flex justify-between items-center border-b border-border py-2 px-4 bg-primaryColor">
          <div className="flex items-center gap-4">
              <h3 className="text-[1.25rem] font-[550]">Planification des travaux</h3>
            <Lock size={20} />
          </div>

          <div className="flex gap-4 items-center ">
            <p className="flex items-center gap-2">
              <span className="font-[550]">Connecté : </span>
              (gestionnaire immobilier)
            </p>
            <UserButton />
            <div className="flex items-center gap-2">
                <button className="font-bold hover:courser-pointer">
                  FR
                </button>
                <button className="font-bold hover:courser-pointer">
                  EN
                </button>
            </div>
          </div>
        </div>
       
      </nav>

      <main className="flex w-full flex-grow">{children}</main>
    </div>
  );
}

export default Layout;
