import Footer from "../components/Footer/Footer";

function Home(props) {
  return (
    <div>
      <div>
        {/* Hero Section */}
        <section
          id="home"
          className="relative bg-cover bg-center h-[70vh] flex items-center justify-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1500&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative text-center text-white px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Courses for Web &amp; Mobile
            </h2>
            <p className="max-w-xl mx-auto">
              Learn web and mobile development from industry experts with
              interactive lessons and hands-on projects.
            </p>
          </div>
        </section>
        {/* Features Section */}
        <section id="home" className="py-16 max-w-7xl mx-auto px-6">
          <div
            className="p-6 relative container mx-auto px-4 rounded-r-lg rounded-l-lg"
            style={{
              marginTop: "-110px",
              width: "70%",
              backgroundColor: "white",
              marginBottom: "3%",
            }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
              Features
            </h2>
            <p className="text-center text-gray-600 mb-12">
              Learn about all of the features we offer.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="p-6 bg-green-100 rounded-lg shadow hover:scale-105 transition fade-in-up">
              <i data-feather="monitor" className="w-8 h-8 text-green-600" />
              <h3 className="font-semibold mt-4">Watch Courses Offline</h3>
              <p className="text-sm text-gray-600 mt-2">
                Download lessons and learn anytime, anywhere.
              </p>
            </div>
            <div className="p-6 bg-purple-100 rounded-lg shadow hover:scale-105 transition fade-in-up">
              <i
                data-feather="headphones"
                className="w-8 h-8 text-purple-600"
              />
              <h3 className="font-semibold mt-4">Premium Support</h3>
              <p className="text-sm text-gray-600 mt-2">
                Get 24/7 support from tutors &amp; mentors.
              </p>
            </div>
            <div className="p-6 bg-yellow-100 rounded-lg shadow hover:scale-105 transition fade-in-up">
              <i data-feather="users" className="w-8 h-8 text-yellow-600" />
              <h3 className="font-semibold mt-4">Learn from Top Tutors</h3>
              <p className="text-sm text-gray-600 mt-2">
                Guidance from experts with real-world experience.
              </p>
            </div>
            <div className="p-6 bg-blue-100 rounded-lg shadow hover:scale-105 transition fade-in-up">
              <i data-feather="code" className="w-8 h-8 text-blue-600" />
              <h3 className="font-semibold mt-4">Lesson Source Files</h3>
              <p className="text-sm text-gray-600 mt-2">
                Access full project files &amp; practice resources.
              </p>
            </div>
            <div className="p-6 bg-pink-100 rounded-lg shadow hover:scale-105 transition fade-in-up">
              <i data-feather="award" className="w-8 h-8 text-pink-600" />
              <h3 className="font-semibold mt-4">Printed Diploma</h3>
              <p className="text-sm text-gray-600 mt-2">
                Earn certificates to showcase your skills.
              </p>
            </div>
            <div className="p-6 bg-red-100 rounded-lg shadow hover:scale-105 transition fade-in-up">
              <i data-feather="book-open" className="w-8 h-8 text-red-600" />
              <h3 className="font-semibold mt-4">New Lessons Daily</h3>
              <p className="text-sm text-gray-600 mt-2">
                Fresh content added every day to keep learning.
              </p>
            </div>
          </div>
        </section>
        {/* Featured Courses */}
        <section id="rate" className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Featured Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="font-semibold">Github Webhooks</h3>
                <p className="text-yellow-500">★★★★☆</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="font-semibold">Awesome CSS with LESS</h3>
                <p className="text-yellow-500">★★★★★</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="font-semibold">Portable Environments</h3>
                <p className="text-yellow-500">★★★★☆</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <h3 className="font-semibold">WordPress Theme Dev</h3>
                <p className="text-yellow-500">★★★★☆</p>
              </div>
            </div>
            <a
              href="#"
              className="mt-8 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Browse Courses
            </a>
          </div>
        </section>
        {/* Feedback Section */}
        <section id="feedback" className="py-2 max-w-7xl mx-auto px-2">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Feedback
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <p className="text-gray-600">
                "Great platform! Learned so much from EasyLearn."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">Adrian D.</h4>
                  <p className="text-sm text-gray-500">Mosaicpro Inc.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <p className="text-gray-600">
                "The tutors are amazing and very helpful!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/women/65.jpg"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">Sarah J.</h4>
                  <p className="text-sm text-gray-500">UI Designer</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <p className="text-gray-600">
                "Best online learning experience I’ve had so far."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://randomuser.me/api/portraits/men/77.jpg"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">Michael T.</h4>
                  <p className="text-sm text-gray-500">Developer</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section id="scholarship" className="py-16 max-w-7xl mx-auto px-6">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Scholarship</h2>
          </div>
        </section>
        <section id="price" className="py-16 max-w-7xl mx-auto px-6">
          {/* Card 1 */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Price
          </h2>
          <br />
          <br />
          {/* Pricing Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 max-w-6xl w-full">
            {/* Starter Plan */}
            <div className="bg-white/90 shadow-xl rounded-lg p-8 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-700 mb-6">
                Starter
              </h3>
              <div className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-gray-200">
                <span className="text-2xl font-bold text-gray-700">FREE</span>
              </div>
              <ul className="mt-8 space-y-3 text-gray-600 text-sm text-center">
                <li>
                  <span className="font-bold">Basic</span> Support
                </li>
                <li>
                  <span className="font-bold">3 Courses</span> per Week
                </li>
                <li>
                  <span className="font-bold">Monthly</span> Digests
                </li>
                <li>Practice Live System</li>
                <li>Members-only Forums</li>
              </ul>
              <button className="mt-8 px-6 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition">
                Get Started
              </button>
            </div>
            {/* Learner Plan (Highlighted) */}
            <div className="bg-white shadow-2xl rounded-lg p-19 flex flex-col items-center transform scale-105 border-t-4 border-blue-500">
              <h3 className="text-lg font-medium text-gray-700 mb-6">
                Learner
              </h3>
              <div className="w-28 h-28 flex items-center justify-center rounded-full bg-blue-500 text-white">
                <span className="text-xl font-bold">
                  $19.99
                  <br />
                  <span className="text-xs font-normal">per month</span>
                </span>
              </div>
              <ul className="mt-8 space-y-3 text-gray-600 text-sm text-center">
                <li>
                  <span className="font-bold">Dedicated</span> Support
                </li>
                <li>
                  <span className="font-bold">10 Courses</span> per Week
                </li>
                <li>
                  <span className="font-bold">Weekly</span> Digests
                </li>
                <li>Practice Live System</li>
                <li>Members-only Forums</li>
              </ul>
              <button className="mt-8 px-6 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition">
                Get Started
              </button>
            </div>
            {/* Master Plan */}
            <div className="bg-white/90 shadow-xl rounded-lg p-8 flex flex-col items-center">
              <h3 className="text-lg font-medium text-gray-700 mb-6">Master</h3>
              <div className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-gray-200">
                <span className="text-xl font-bold text-gray-700">
                  $49
                  <br />
                  <span className="text-xs font-normal">per month</span>
                </span>
              </div>
              <ul className="mt-8 space-y-3 text-gray-600 text-sm text-center">
                <li>
                  <span className="font-bold">Premium</span> Support
                </li>
                <li>
                  <span className="font-bold">All Courses</span> Anytime
                </li>
                <li>
                  <span className="font-bold">Daily</span> Digests
                </li>
                <li>Practice Live System</li>
                <li>Members-only Forums</li>
              </ul>
              <button className="mt-8 px-6 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition">
                Get Started
              </button>
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section id="contact" className="py-16 max-w-7xl mx-auto px-6">
          {/* Card 1 */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Contact
          </h2>
          <br />
          <br />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative bg-white/70 backdrop-blur-lg p-10 rounded-3xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 fade-up">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-5 rounded-full shadow-xl group-hover:scale-110 transition duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12H8m8-4H8m8 8H8m12 4H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center mt-10">
                <h3 className="text-xl font-bold text-gray-800">Support</h3>
                <p className="text-gray-600 mt-3">support@easylearn.com</p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="group relative bg-white/70 backdrop-blur-lg p-10 rounded-3xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 fade-up">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-5 rounded-full shadow-xl group-hover:scale-110 transition duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h2l3.6 7.59-1.35 2.44a1 1 0 00.89 1.47h7.72a1 1 0 00.9-.55l3.58-6.49H6.42"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center mt-10">
                <h3 className="text-xl font-bold text-gray-800">Phone</h3>
                <p className="text-gray-600 mt-3">(202) 386 2702</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="group relative bg-white/70 backdrop-blur-lg p-10 rounded-3xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 fade-up">
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-5 rounded-full shadow-xl group-hover:scale-110 transition duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h11M9 21V3m12 8h-6m0 10V9m0 12V3"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center mt-10">
                <h3 className="text-xl font-bold text-gray-800">
                  Head Quarter
                </h3>
                <p className="text-gray-600 mt-3">Maryland, USA</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
export default Home;
