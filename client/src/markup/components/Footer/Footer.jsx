import React from 'react'

function Footer() {
  return (
    <div>
      <footer className="relative bg-white text-gray-700 overflow-hidden">
        {/* Animated background waves */}
        <div className="absolute inset-0 h-12">
          <div className="absolute inset-0 bg-[url('https://svgshare.com/i/uTB.svg')] bg-repeat-x bg-bottom animate-[wave_10s_linear_infinite] opacity-15"></div>
          <div className="absolute inset-0 bg-[url('https://svgshare.com/i/uTB.svg')] bg-repeat-x bg-bottom animate-[wave_15s_linear_infinite_reverse] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left items-center">
            {/* Brand */}
            <div>
              <h2 className="text-lg font-bold flex items-center justify-center md:justify-start text-primary">
                <i data-feather="book-open" className="mr-2 w-5 h-5"></i>
                EasyLearn
              </h2>
              <p className="text-xs mt-1 text-gray-500">
                Learn anytime, anywhere.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-sm">
              <h3 className="font-semibold mb-1 text-gray-800 text-base">
                Links
              </h3>
              <ul className="flex justify-center md:justify-start space-x-4">
                <li>
                  <a href="#" className="hover:text-primary">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Forum
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Profile
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-semibold mb-1 text-gray-800 text-base">
                Follow
              </h3>
              <div className="flex justify-center md:justify-start space-x-2">
                <a
                  href="#"
                  className="p-1.5 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition"
                >
                  <i data-feather="facebook"></i>
                </a>
                <a
                  href="#"
                  className="p-1.5 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition"
                >
                  <i data-feather="twitter"></i>
                </a>
                <a
                  href="#"
                  className="p-1.5 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition"
                >
                  <i data-feather="instagram"></i>
                </a>
                <a
                  href="#"
                  className="p-1.5 bg-gray-100 rounded-full hover:bg-primary hover:text-white transition"
                >
                  <i data-feather="linkedin"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div className="border-t border-gray-200 mt-4 pt-2 text-center text-xs text-gray-500">
            © 2025 <span className="font-semibold text-primary">EasyLearn</span>
            . All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer
