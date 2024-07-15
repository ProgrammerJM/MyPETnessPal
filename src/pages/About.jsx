// export default function About() {
//   return (
//     <div className="min-h-screen my-10">
//       <h1 className="text-3xl sm:text-4xl md:text-5xl text-center p-10">
//         Learn About Us: <span className="font-bold">Anytime PETness</span>
//       </h1>
//       <div className="flex flex-col items-center md:flex-row justify-center md:space-x-10">
//         <img
//           src="/images/aboutus.png"
//           className="w-full md:w-1/2 lg:w-1/3 max-h-96 object-contain mx-5"
//           alt="About Us"
//         />
//         <div className="flex flex-col w-full md:w-1/2 lg:w-1/3 mt-5 overflow-y-auto max-h-96 mx-5">
//           <p className="mb-4">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
//             fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
//             quis pulvina.
//           </p>
//           <p className="mb-4">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
//             fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
//             quis pulvina.
//           </p>
//           <p className="mb-4">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
//             fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
//             quis pulvina.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import aboutusImg from "../assets/images/AboutUs.jpg";

export default function About() {
  return (
    <section id="about-section" className="md:py-2">
      <h1 className="text-5xl flex justify-center m-6 text-center">
        <span className="font-bold ml-2 text-light-darkViolet">
          MyPetnessPal Team
        </span>
      </h1>
      <div className="flex flex-col lg:flex-row justify-center items-center lg:space-x-10 m-10">
        <img
          src={aboutusImg}
          className="w-full lg:w-1/2 h-auto max-w-md lg:max-w-none border-2 border-gray-300 rounded-3xl object-contain"
        />
        <div className="flex flex-col w-full mt-5 lg:mt-0 overflow-y-auto lg:max-h-[calc(100vh-200px)] max-w-md">
          {/* {[...Array(3)].map((_, i) => (
            <p key={i} className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              fringilla nunc in molestie feugiat. Nunc auctor consectetur elit,
              quis pulvina. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Nulla fringilla nunc in molestie feugiat. Nunc auctor
              consectetur elit, quis pulvina.
            </p>
          ))} */}
          <p className="mb-4">
            <span className="font-bold text-light-darkViolet">
              MyPetnessPal
            </span>{" "}
            is an IoT Weight-Based Feeding and Monitoring System for Pets. It is
            a pet-feeding system that allows pet owners to feed their pets
            remotely and monitor their pets{"'"} health and well-being. Our
            system is designed to be user-friendly and easy to use. We hope you
            enjoy using it as much as we enjoyed creating it!
          </p>
          <p className="mb-4">
            Our team consists of a group of passionate pet owners who are
            dedicated to providing the best possible care for their pets. We
            understand the importance of keeping track of your pet{"'"}s health
            and well-being, and we are committed to helping you do just that. w
          </p>
          <p className="mb-4">
            <span className="font-bold text-light-darkViolet">
              Developers:{" "}
            </span>
            <span className="">
              John Mark Tizado, Danilo Pascual, Mary Cel Cabugon, Marianne
              Villato
            </span>
          </p>
          <p className="mb-4">
            <span className="font-bold text-light-darkViolet">
              Maintainer:{" "}
            </span>
            <span className="">John Mark Tizado</span>
          </p>
          <div className="mb-4">
            <span className="font-bold text-light-darkViolet text-">
              MyPetnessPal Github Repository:
            </span>
            <div className="justify-center space-x-4 mt-2 w-fit">
              <a
                href="https://github.com/ProgrammerJM/MyPETnessPal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/github-icon.svg" alt="Github Logo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
