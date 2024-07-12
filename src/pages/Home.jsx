// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <div className="bg-homeBG bg-no-repeat bg-cover">
//       <div className="max-w-screen-xl px-4 pt-20 mx-auto pb-8 lg:gap-8 xl:gap-0 lg:grid lg:grid-cols-12 lg:pt-20">
//         <div className="mr-auto lg:col-span-5">
//           <h1 className=" max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
//             Because your Pal deserves the best, PETnessPAL
//           </h1>
//           <section className="text-center">
//             <h2 className="text-3xl font-bold mb-4">Get Started</h2>
//             <p className="mb-8">
//               Sign up today to start managing your pet{"'"}s health and
//               nutrition.
//             </p>
//             <div className="flex justify-center space-x-4">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-light-white bg-light-mainColor border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
//               >
//                 Log In
//               </Link>
//               <Link
//                 to="/signup"
//                 className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-light-white bg-light-mainColor border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:outline-none focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           </section>
//         </div>
//         <div className="lg:col-span-7 flex flex-col items-center justify-center">
//           <img
//             src="/images/petness-logo-icon.png"
//             alt="hero image"
//             className="h-40 w-40 object-contain"
//           />
//           <section className="features">
//             <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
//             <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//               {[
//                 {
//                   title: "Nutrition Tracking",
//                   desc: "Keep track of what your pet eats and its nutritional value to ensure a balanced diet.",
//                 },
//                 {
//                   title: "Feeding Schedules",
//                   desc: "Set and manage feeding schedules to maintain consistent eating habits for your pet.",
//                 },
//                 {
//                   title: "Pet Profiles",
//                   desc: "Create and manage profiles for each of your pets, including their dietary needs and preferences.",
//                 },
//               ].map((feature, index) => (
//                 <div
//                   key={index}
//                   className="feature p-4 border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700"
//                 >
//                   <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
//                   <p>{feature.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </div>
//       <section id="about-section" className="py-10">
//         <h1 className="text-5xl flex justify-center p-10">
//           Learn About Us:{" "}
//           <span className="font-bold ml-2">Anytime PETness</span>
//         </h1>
//         <div className="flex flex-col lg:flex-row justify-center items-center lg:space-x-10 p-10">
//           <img
//             src="/images/aboutus.png"
//             className="w-full lg:w-1/2 h-auto max-w-md lg:max-w-none"
//           />
//           <div className="flex flex-col w-full mt-5 lg:mt-0 overflow-y-auto lg:max-h-[calc(100vh-200px)] max-w-md">
//             {[...Array(3)].map((_, i) => (
//               <p key={i} className="mb-4">
//                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
//                 fringilla nunc in molestie feugiat. Nunc auctor consectetur
//                 elit, quis pulvina. Lorem ipsum dolor sit amet, consectetur
//                 adipiscing elit. Nulla fringilla nunc in molestie feugiat. Nunc
//                 auctor consectetur elit, quis pulvina.
//               </p>
//             ))}
//           </div>
//         </div>
//       </section>
//       <section id="contact-section" className="h-full my-10">
//         <div className="flex flex-col lg:flex-row justify-center items-center lg:space-x-10">
//           <img
//             src="/images/faq-logo.png"
//             className="w-1/2 h-auto max-w-xs lg:max-w-md"
//           />
//           <div className="flex flex-col text-center lg:text-left">
//             <h1 className="text-5xl">Frequently Asked Questions (FAQ)</h1>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
// import { Link } from "react-router-dom";
// import About from "./About";
// import Contact from "./Contact";

// export default function Home() {
//   return (
//     <div className="bg-homeBG bg-no-repeat bg-cover">
//       <div className="max-w-screen-xl px-4 pt-20 mx-auto pb-8 lg:gap-8 xl:gap-0 lg:grid lg:grid-cols-12 lg:pt-20">
//         <div className="mr-auto lg:col-span-5">
//           <h1 className="max-w-2xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl dark:text-white">
//             Because your Pal deserves the best, PETnessPAL
//           </h1>
//           <section className="text-center">
//             <h2 className="text-3xl font-bold mb-4">Get Started</h2>
//             <p className="mb-8">
//               Sign up today to start managing your pet{"'"}s health and
//               nutrition.
//             </p>
//             <div className="flex justify-center space-x-4">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-light-white bg-light-mainColor border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
//               >
//                 Log In
//               </Link>
//               <Link
//                 to="/signup"
//                 className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-light-white bg-light-mainColor border border-gray-200 rounded-lg sm:w-auto hover:bg-gray-100 focus:outline-none focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           </section>
//         </div>
//         <div className="lg:col-span-7 flex flex-col items-center justify-center">
//           <img
//             src="/images/petness-logo-icon.png"
//             alt="hero image"
//             className="h-40 w-40 object-contain"
//           />
//           <section className="features">
//             <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
//             <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//               {[
//                 {
//                   title: "Nutrition Tracking",
//                   desc: "Keep track of what your pet eats and its nutritional value to ensure a balanced diet.",
//                 },
//                 {
//                   title: "Feeding Schedules",
//                   desc: "Set and manage feeding schedules to maintain consistent eating habits for your pet.",
//                 },
//                 {
//                   title: "Pet Profiles",
//                   desc: "Create and manage profiles for each of your pets, including their dietary needs and preferences.",
//                 },
//               ].map((feature, index) => (
//                 <div
//                   key={index}
//                   className="feature p-4 border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700"
//                 >
//                   <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
//                   <p>{feature.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </div>
//       <About />
//       <Contact />
//     </div>
//   );
// }

// import { Link } from "react-router-dom";
// import About from "./About";
// import Contact from "./Contact";

// export default function Home() {
//   return (
//     <div className="bg-homeBG bg-no-repeat bg-cover min-h-screen flex flex-col">
//       <div className="flex-1 max-w-screen-xl p-8 mx-auto pb-8 lg:px-6 lg:gap-8 xl:gap-0 lg:grid lg:grid-cols-12 text-pretty">
//         <div className="lg:col-span-6 flex flex-col h-full justify-center">
//           <h1 className="max-w-3xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl text-light-darkViolet text-center">
//             Because your Pal deserves the best, PetnesPAL
//           </h1>
//           <section className="text-center mt-14">
//             <h2 className="text-3xl font-bold mb-4 text-light-darkViolet">
//               Get Started
//             </h2>
//             <p className="mb-8">
//               Sign up today to start managing your pet{"'"}s health and
//               nutrition.
//             </p>
//             <div className="flex justify-center space-x-4">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-light-white bg-light-mainColor hover:bg-light-darkViolet border border-transparent rounded-lg sm:w-auto focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800"
//               >
//                 Log In
//               </Link>
//               <Link
//                 to="/signup"
//                 className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-light-white bg-light-mainColor hover:bg-light-darkViolet border border-transparent rounded-lg sm:w-auto focus:outline-none focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
//               >
//                 Sign Up
//               </Link>
//             </div>
//           </section>
//         </div>
//         <div className="lg:col-span-6 flex flex-col items-center justify-center h-full mt-10">
//           <img
//             src="/images/petness-logo-icon.png"
//             alt="hero image"
//             className="h-40 w-40 object-contain mb-6 lg:mb-0"
//           />
//           <section className="features w-full px-4 h-fit">
//             <h2 className="text-3xl font-bold text-center mb-6 text-light-darkViolet">
//               Features
//             </h2>
//             <div className="grid grid-cols-1 gap-2 md:grid-cols-3 grid-rows-2">
//               {[
//                 {
//                   title: "Pet Profiles",
//                   desc: "Create and manage profiles for each of your pets, including their dietary needs and preferences.",
//                 },
//                 {
//                   title: "Feeding Schedules",
//                   desc: "Set and manage feeding schedules to maintain consistent eating habits for your pet.",
//                 },
//                 {
//                   title: "Health Analytics",
//                   desc: "Visualize your pet's health data over time to identify trends and make informed decisions about their diet and exercise.",
//                 },
//                 {
//                   title: "Pet Cages",
//                   desc: "Assign your pets to their cages, manage cage assignments, and monitor their comfort and safety.",
//                 },
//                 {
//                   title: "Notifications",
//                   desc: "Receive real-time notifications about your pet's health, feeding times, and other important reminders.",
//                 },
//                 {
//                   title: "Live Camera Stream",
//                   desc: "Keep an eye on your pets with live camera feeds, ensuring they are safe and sound while you're away.",
//                 },
//               ].map((feature, index) => (
//                 <div
//                   key={index}
//                   className="feature p-3 border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700"
//                 >
//                   <h3 className="text-xl font-bold mb-2 text-light-darkViolet">
//                     {feature.title}
//                   </h3>
//                   <p className="text-wrap flex-wrap w-auto">{feature.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </div>
//       <About />
//       <Contact />
//     </div>
//   );
// }

import { Link } from "react-router-dom";
import Slider from "react-slick";
import About from "./About";
import Contact from "./Contact";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const features = [
    {
      title: "Pet Profiles",
      desc: "Create and manage profiles for each of your pets, including their dietary needs and preferences.",
    },
    {
      title: "Pet Cages",
      desc: "Assign your pets to their cages, manage cage assignments, and monitor their comfort and safety.",
    },
    {
      title: "Smart Feeding",
      desc: "Automatically calculates and adjusts your pet's daily food intake based on their Maintenance Energy Requirements (MER).",
    },
    {
      title: "Scheduled Feeding",
      desc: "Set and manage feeding schedules to maintain consistent eating habits for your pet.",
    },
    {
      title: "Health Analytics",
      desc: "Visualize your pet's health data over time to identify trends and make informed decisions about their diet and exercise.",
    },
    {
      title: "Live Camera Stream",
      desc: "Keep an eye on your pets with live camera feeds, ensuring they are safe and sound while you're away.",
    },
    {
      title: "Notifications",
      desc: "Receive real-time notifications about your pet's health, feeding times, and other important reminders.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-homeBG bg-no-repeat bg-cover min-h-screen flex flex-col overflow-auto">
      <div className="flex-1 max-w-screen-xl p-8 lg:p-0 mx-auto pb-8 lg:gap-8 xl:gap-0 lg:grid lg:grid-cols-12 text-pretty">
        <div className="lg:col-span-6 flex flex-col justify-center h-full lg:h-lvh">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl text-light-darkViolet text-center">
            Elevate Your Pet{"'"}s Health with PetnessPal
          </h1>
          <section className="text-center mt-14">
            <h2 className="text-3xl font-bold mb-4 text-light-darkViolet">
              Get Started
            </h2>
            <p className="mb-8">
              Sign up today to start managing your pet{"'"}s health and
              nutrition.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-light-white bg-light-mainColor hover:bg-light-darkViolet border border-transparent rounded-lg sm:w-auto focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-light-white bg-light-mainColor hover:bg-light-darkViolet border border-transparent rounded-lg sm:w-auto focus:outline-none focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800"
              >
                Sign Up
              </Link>
            </div>
          </section>
        </div>
        <div className="lg:col-span-6 flex flex-col items-center justify-center h-full mt-10 w-full lg:mt-0">
          <img
            src="/images/petness-logo-icon.png"
            alt="hero image"
            className="h-40 w-40 object-contain mb-6 lg:mb-0"
          />
          <section className="features w-full px-4 h-fit">
            <h2 className="text-3xl font-bold text-center mb-6 text-light-darkViolet">
              Features
            </h2>
            <Slider {...settings} className="w-80 lg:w-full md:w-4/6">
              {features.map((feature, index) => (
                <div key={index} className="p-3 w-full">
                  <div className="feature p-3 border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-xl font-bold mb-2 text-light-darkViolet">
                      {feature.title}
                    </h3>
                    <p className="text-wrap break-words whitespace-break-spaces">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </section>
        </div>
      </div>
      <About />
      <Contact />
    </div>
  );
}
