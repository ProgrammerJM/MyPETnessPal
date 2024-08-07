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
import githubIcon from "../assets/images/github-icon.svg";
import linkedinIcon from "../assets/images/linkedin-icon.svg";
import facebookIcon from "../assets/images/facebook-icon.svg";
import instagramIcon from "../assets/images/instagram-icon.svg";

export default function Contact() {
  return (
    <section
      id="contact-section"
      className="my-10 lg:my-0 p-10 md:p-20 h-full lg:h-full"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4 text-light-darkViolet">
            Get In Touch
          </h1>
        </div>
        <div className="flex flex-col items-center text-center mb-10">
          {" "}
          <div className="flex flex-col items-center text-center">
            <p className="text-lg mb-8">
              Have questions or feedback? Reach out to us!
            </p>
            <p className="text-lg mb-2">Contact our team:</p>

            <a
              href="mailto:marycelfrancescacabugon@gmail.com"
              className="text-lg mb-2 hover:text-darkViolet hover:underline cursor-pointer"
              aria-label="Send an email to Mary Cel Francesca Cabugon"
            >
              Mary Cel Francesca Cabugon
            </a>
            <a
              href="mailto:danilopascual527@gmail.com"
              className="text-lg mb-2 hover:text-darkViolet hover:underline cursor-pointer"
              aria-label="Send an email to Danilo III Pascual"
            >
              Danilo III Pascual
            </a>
            <a
              href="mailto:marianevillato@gmail.com"
              className="text-lg mb-2 hover:text-darkViolet hover:underline cursor-pointer"
              aria-label="Send an email to Mariane Villato"
            >
              Mariane Villato
            </a>
            <a
              href="mailto:johnmarktizado@gmail.com"
              className="text-lg mb-2 hover:text-darkViolet hover:underline cursor-pointer"
              aria-label="Send an email to John Mark Tizado"
            >
              John Mark Tizado
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-10 center justify-center">
        <p>Follow us on social media:</p>
        <div className="flex justify-center mt-4 items-center">
          <a
            href="https://www.linkedin.com/in/johnmarktizado/"
            className="mx-2"
          >
            <img src={linkedinIcon} alt="github icon" />
          </a>
          <a href="https://github.com/ProgrammerJM" className="mx-2">
            <img src={githubIcon} alt="github icon" />
          </a>
          <a href="https://www.facebook.com/johnmarkt00" className="mx-2">
            <img src={facebookIcon} alt="facebook link" />
          </a>
          <a href="https://www.instagram.com/jmjtiz" className="mx-2">
            <img src={instagramIcon} alt="instagram link" />
          </a>
        </div>
      </div>
    </section>
  );
}
