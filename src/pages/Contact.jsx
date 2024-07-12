// export default function Contact() {
//   return (
//     <div className="h-full my-10">
//       <div className="flex justify-center">
//         <img src="/images/faq-logo.png" className="h-1/2 w-1/3" />
//         <div className="flex flex-col">
//           <h1 className="text-5xl">Frequently Asked Questions (FAQ)</h1>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function Contact() {
  return (
    <section id="contact-section" className="my-10 p-20 md:p-20 h-full">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-light-darkViolet">
            Get In Touch
          </h1>
          <p className="text-lg mb-8">
            Have questions or feedback? Reach out to us!
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <a
            href="mailto:marycelfrancescacabugon@gmail.com"
            className="text-lg mb-2 "
          >
            {" "}
            Mary Cel Francesca Cabugon
          </a>
          <a href="mailto:danilopascual527@gmail.com" className="text-lg mb-2 ">
            Danilo III Pascual
          </a>
          <a href="mailto:marianevillato@gmail.com" className="text-lg mb-2">
            Mariane Villato
          </a>

          <a href="mailto:johnmarktizado@gmail.com" className="text-lg mb-2 ">
            John Mark Tizado
          </a>
          {/* Add more contact options here */}
        </div>
      </div>
    </section>
  );
}
