import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      <footer className="footer flex flex-col">
        <Link
          to="www.facebook.com/johnmarkt00"
          className="m-1 ml-5 w-fit">
          Facebook
        </Link>
        <Link
          to="www.instagram.com/jmjtiz"
          className="m-1 ml-5 w-fit">
          Instagram
        </Link>
        <Link
          to="www.linkedin.com/johnmarktizado"
          className="m-1 ml-5 w-fit">
          LinkedIn
        </Link>
        <Link
          to="www.twitter.com/jmjtiz"
          className="m-1 ml-5 w-fit">
          Twitter
        </Link>
        <div className="copyright ml-5 mr-5 w-fit flex flex-end justify-end">
          <p className="flex">Copyright &#169;2024 | Petness </p>
        </div>
      </footer>
    </>
  );
}
