import Image from 'next/image';

export default function Header() {
  return (
    <header className="w-full">
      {/* Top Bar with Gradient */}
      <div className="w-full bg-gradient-to-r from-red-700/80 to-gray-800/90 py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-white text-sm">
          {/* Left Side */}
          <div>
            Custom Web Design & Digital Marketing Solutions
          </div>

          {/* Right Side */}
          <div className="flex gap-6">
            <div>📞 (248) 555-1234</div>
            <div>✉️ info@ceimagesolutions.com</div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="Cutting Edge Logo"
              width={130}
              height={130}
              priority
            />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-brand hover:underline hover:underline-offset-4 transition">
              Website Design
            </a>
            <a href="#" className="text-gray-600 hover:text-brand hover:underline hover:underline-offset-4 transition">
              Digital Marketing
            </a>
            <a href="#" className="text-gray-600 hover:text-brand hover:underline hover:underline-offset-4 transition">
              Photography & Video
            </a>
            <a href="#" className="text-gray-600 hover:text-brand hover:underline hover:underline-offset-4 transition">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-brand hover:underline hover:underline-offset-4 transition">
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
