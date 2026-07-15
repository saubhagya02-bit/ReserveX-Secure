import React from "react";
import { MapPin, Building2, Clock, Truck, ChevronDown } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="bg-blue-100 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Empowering the{" "}
              <span className="text-blue-600">Literary Future</span> of Sri Lanka
            </h1>

            <p className="mt-6 text-gray-600 text-lg">
              The Colombo International Bookfair (CIBF) is the country's largest
              book exhibition, attracting publishers, authors and readers from
              across Sri Lanka and beyond.
            </p>

            <div className="mt-6 flex gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition">
                Reserve Your Stall
              </button>

              <button className="border border-gray-400 px-6 py-3 rounded-lg hover:bg-gray-100 transition">
                Get In Touch
              </button>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop"
              alt="Books"
              className="rounded-2xl shadow-lg"
            />
          </div>

        </div>
      </section>


      {/* Stats Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-blue-600">50K+</h2>
            <p className="text-gray-500 mt-2">Annual Visitors</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-blue-600">400+</h2>
            <p className="text-gray-500 mt-2">Exhibitors</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-blue-600">100K+</h2>
            <p className="text-gray-500 mt-2">Books Displayed</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-3xl font-bold text-blue-600">22nd</h2>
            <p className="text-gray-500 mt-2">Annual Edition</p>
          </div>

        </div>
      </section>


      {/* History Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          <div>
            <h2 className="text-3xl font-bold mb-6">
              A Rich History of Reading
            </h2>

            <p className="text-gray-600 mb-4">
              Established in 1999, the Colombo International Bookfair has grown
              into a South Asian cultural phenomenon.
            </p>

            <p className="text-gray-600 mb-4">
              Organized by the Sri Lanka Book Publishers’ Association, the event
              aims to promote reading culture and support the publishing
              industry.
            </p>

            <p className="text-gray-600">
              Workshops, author meetups, storytelling sessions and book launches
              are conducted annually to engage the public.
            </p>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
              alt="Library"
              className="rounded-2xl shadow-lg"
            />
          </div>

        </div>
      </section>


      {/* NEW SECTION — Venue & Facilities */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">

          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Venue & Facilities
            </h2>

            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Hosted at the prestigious Bandaranaike Memorial International Conference Hall (BMICH),
              the fair spans across multiple halls and outdoor pavilions.
            </p>
          </div>


          {/* Content */}
          <div className="grid md:grid-cols-2 gap-10 items-center">

            {/* Left side features */}
            <div className="space-y-6">

              <div className="flex gap-4">
                <MapPin className="text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Prime Location</h4>
                  <p className="text-gray-500 text-sm">
                    Centrally located in Colombo 07, easily accessible by public
                    transport and private vehicles.
                  </p>
                </div>
              </div>


              <div className="flex gap-4">
                <Building2 className="text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Multi-Hall Experience</h4>
                  <p className="text-gray-500 text-sm">
                    Spreading across Sirimavo Bandaranaike Exhibition Centre (Halls A, B, C)
                    and outdoor clusters.
                  </p>
                </div>
              </div>


              <div className="flex gap-4">
                <Clock className="text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Extended Hours</h4>
                  <p className="text-gray-500 text-sm">
                    Operations from 09:00 to 21:00 ensures maximum footfall
                    throughout the event period.
                  </p>
                </div>
              </div>


              <div className="flex gap-4">
                <Truck className="text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Exhibitor Loading Zones</h4>
                  <p className="text-gray-500 text-sm">
                    Dedicated heavy loading bays and storage facilities for
                    large-scale publishers.
                  </p>
                </div>
              </div>

            </div>


            {/* Right side image */}
            <div>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200"
                alt="Venue"
                className="rounded-xl shadow-lg border"
              />
            </div>

          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 ">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-3">Everything you need to know about the CIBF stall reservation process.</p>

          <div className="mt-12 border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            {[
              "When is the Colombo International Bookfair 2024 held?",
              "How can I reserve a stall as a first-time publisher?",
              "Are there different stall sizes available?",
              "What amenities are included in the stall fee?",
              "Is there a deadline for stall reservations?"
            ].map((question, index) => (
              <div key={index} className="border-b border-gray-100 last:border-none">
                <button className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition">
                  <span className="text-gray-700 font-medium">{question}</span>
                  <ChevronDown className="text-gray-400" size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;