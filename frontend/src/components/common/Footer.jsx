import { NavLink } from "react-router-dom";
import { FiArrowRight, FiGithub } from "react-icons/fi";
import { AiFillHeart as Heart } from "react-icons/ai";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "FAQ", to: "/faq" },
    { label: "Privacy Policy", to: "/privacy-policy" },
  ];
  const linkClass = "transition-colors hover:underline hover:text-[#D9A981]";

  return (
    <footer
      className={`mt-auto py-8 px-4 transition-all duration-300 bg-linear-to-r bg-gray-900 text-gray-200`}
    >
      <div data-aos="fade-up" className="container mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About Section */}
          <div>
            <h3 className={`text-lg font-bold mb-3 text-purple-500`}>DeepShield</h3>
            <p className="text-sm leading-relaxed">DeepShield helps you check whether a video may have been manipulated. Detection is probabilistic and not 100% accurate - use results as guidance, not definitive proof.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-bold mb-3 text-purple-500`}>Quick Links</h3>
            <ul className="space-y-2 text-sm md:text-base">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <NavLink to={link.to} className={linkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className={`text-lg font-bold mb-3 text-purple-500`}>Connect</h3>
            <div className="flex gap-4">
              <a
                href="https://github.com/palchhinparihar/DeepShield"
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all hover:scale-110 active:scale-95 hover:text-[#D9A981]`}
                aria-label="GitHub Profile"
              >
                <FiGithub className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-6 border-t text-sm md:text-base text-center border-gray-700`}>
          <p className="flex items-center justify-center gap-1 flex-wrap">
            Made with
            <Heart className={`w-5 h-5 fill-current animate-pulse text-red-500`} />
            by
            <a
              href="https://github.com/palchhinparihar"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold transition-colors text-purple-400`}
            >
              Palchhin
            </a>
            {" and "}
            <a
              href="https://github.com/Mukesh469"
              target="_blank"
              rel="noopener noreferrer"
              className={`font-semibold transition-colors text-purple-400`}
            >
              Mukesh
            </a>
          </p>
          <p className="mt-2 text-xs md:text-sm opacity-75">© {currentYear} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;