import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import bg_house from "@/public/images/bg-house-0.png";

export default function Page() {
   return (
      <div className="flex flex-col relative w-full h-screen">
        <div className="absolute left-[50%] top-[50%] h-[100vh] w-[100vw] transform -translate-x-1/2 -translate-y-1/2 z-1">
          <Image src={bg_house} alt="bg-house" layout="fill" objectFit="cover" />
        </div>
        <div className="flex flex-col items-center justify-center w-full h-screen z-3 shadow-lg translate-y-2">
          <SignUp
              appearance={{
                elements: {
                  cardBox: "bg-primaryColor shadow-none rounded-[0.3rem] border border-textColor border-[0.05rem]",
                  card: "bg-primaryColor shadow-none",
                  headerTitle: "text-3xl font-bold text-gray-800 text-backgroundColor",
                  headerSubtitle: "text-textColor mt-4",
                  footer: "bg-primaryColor bg-none shadow-none",
                  footerAction: "shadow-none",
                  socialButtons: "bg-backgroundColor h-[3rem] rounded-[0.2rem] text-textColor hover:bg-gray-300",
                  formField: "h-[4rem]",
                  formFieldInput: "bg-white text-textColor bg-none shadow-xl rounded-[0.2rem] h-[3rem] min-h-[3rem] max-h-[3rem] text-[15px] border-[0.5rem] border-textColor ",
                  formFieldLabel: "text-backgroundColor text-[15px]",
                  formFieldInfoText: "text-backgroundColor",
                  formButtonPrimary: "mt-4 bg-white text-textColor bg-none shadow-none shadow-xl rounded-[0.2rem] h-[3rem] hover:bg-gray-300 font-bold text-[17px]",
                  footerActionText: "text-textColor",
                  dividerText: "text-backgroundColor",
                  footerActionLink : "text-backgroundColor",
                  main : "flex-col-reverse",
                },
              }}
  
              signInUrl="/sign-in"
              signUpUrl="/sign-up"
            />
        </div>
      </div>
    );
}
