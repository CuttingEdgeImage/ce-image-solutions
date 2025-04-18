export default function Hero() {
    return (
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Web Design. Digital Marketing. Visual Storytelling.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            We build beautiful, functional websites and marketing strategies that help your business grow.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition">
              Start Your Project
            </a>
            <a href="#" className="border border-red-600 text-red-600 px-6 py-3 rounded-lg font-medium hover:bg-red-50 transition">
              Learn More
            </a>
          </div>
        </div>
      </section>
    );
  }
  