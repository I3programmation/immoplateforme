import Logo from "@/components/Logo";
import { SignIn } from "@clerk/nextjs";
import { Divider } from "@mui/material";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Page() {
  return (
    <div className="flex flex-col ">
      <div className=" flex flex-row justify-between p-4 ">
        <Logo />
        <ThemeSwitcher />
      </div>

      <div className="flex w-full absolute top-16  ">
        <Divider sx={{ borderColor: "gray" }} className="w-full" />
      </div>
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <SignIn />
      </div>
    </div>
  );
}
