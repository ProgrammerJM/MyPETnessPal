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

export default function About() {
  return (
    <section id="about-section" className="md:py-2">
      <h1 className="text-5xl flex justify-center m-6">
        <span className="font-bold ml-2 text-light-darkViolet">
          MyPetnessPal Team
        </span>
      </h1>
      <div className="flex flex-col lg:flex-row justify-center items-center lg:space-x-10 m-10">
        <img
          src="/images/AboutUs.jpg"
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
                <svg
                  height="32"
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="32"
                  data-view-component="true"
                >
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
