
import Image from 'next/image';
import bg_house from '@/public/images/bg-house-1.png';
import Logo from "@/components/Logo";
import Link from 'next/link';

export default function HomePage() {
    return (
<div className="flex flex-col relative w-full h-screen">
        <nav className=" flex justify-between items-center h-[5rem] px-4 bg-primaryColor">
            <div className="flex items-center gap-4">
              <h2 className="text-backgroundColor text-4xl font-bold">Immo<span className="text-textColor">Plateforme</span></h2>
              <div className="flex gap-[3rem] items-center ml-[4rem]">
                  <a href="#" className="text-backgroundColor text-[19px] font-semibold hover:text-gray-300">Prix</a>
                  <a href="#" className="text-backgroundColor text-[19px] font-semibold hover:text-gray-300">Contact</a>
                  <a href="#" className="text-backgroundColor text-[19px] font-semibold hover:text-gray-300">Plans</a>
              </div>
            </div>

            <div className="flex items-center h-full gap-3">
              <Link className="text-textColor flex items-center justify-center bg-backgroundColor text-[19px] px-4 h-full hover:bg-gray-200" href="/sign-in" passHref>
                Se connecter
              </Link>
              <div className="flex items-center text-backgroundColor gap-2">
                <button className="font-bold hover:courser-pointer w-[4rem]">
                  FR
                </button>
                <button className="font-bold hover:courser-pointer w-[4rem]">
                  EN
                </button>
              </div>
            </div>

        </nav>
      <div className="absolute left-[67%] top-[55%] h-[65vh] w-[35vw] transform -translate-x-1/2 -translate-y-1/2 z-1">
        <Image src={bg_house} alt="bg-house" layout="fill" objectFit="contain" />
      </div>
      <div className="flex flex-col items-start justify-center w-1/2 h-screen z-3 shadow-lg translate-y-2 translate-x-[27%]">
        <h2 className="text-5xl font-bold text-left w-full text-textColor">
            Planifiez, visualisez et <br></br>
            collaborez sur vos <br></br>
            projets immobiliers en <br></br>
            temps réel.
        </h2>
        <p className="text-[1.15rem] text-left mt-4 w-full text-textColor">
          Fuyez la gestion désorganisée - libérez le plein potentiel <br></br>
          de votre parc immobilier avec <br></br>
          <Logo/>
        </p>

        <Link href="/sign-up" passHref className="bg-primaryColor text-backgroundColor text-[19px] flex items-center justify-center h-[4rem] w-[10rem] rounded-[5px] font-semibold hover:text-gray-300 mt-4">S'inscrire</Link>
      </div>
    </div>
    );
  }