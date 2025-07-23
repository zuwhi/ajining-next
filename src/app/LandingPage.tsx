import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Award, Truck, Shield, Star } from "lucide-react";

const FurnitureLandingPage = () => {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const router = useRouter();

  // Furniture images for hero grid
  const heroImages = [
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1549497538-303791108f95?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
  ];

  const products = [
    {
      id: 1,
      name: "Sofa Minimalis Oslo",
      price: "Rp 12.500.000",
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
      category: "Living Room",
    },
    {
      id: 2,
      name: "Meja Makan Scandinavia",
      price: "Rp 8.500.000",
      image:
        "https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=400&fit=crop",
      category: "Dining Room",
    },
    {
      id: 3,
      name: "Lemari Kayu Jati Premium",
      price: "Rp 15.000.000",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      category: "Bedroom",
    },
    {
      id: 4,
      name: "Kursi Kerja Ergonomis",
      price: "Rp 4.250.000",
      image:
        "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop",
      category: "Office",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Wijaya",
      role: "Interior Designer",
      content:
        "Kualitas furniture yang luar biasa! Setiap detailnya menunjukkan craftsmanship premium. Klien saya selalu puas dengan rekomendasi dari Ajining.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Property Developer",
      content:
        "Sudah 3 tahun bekerja sama untuk proyek high-end properties. Konsistensi kualitas dan desain yang selalu memukau investor.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Melissa Tanoto",
      role: "Homeowner",
      content:
        "Rumah kami benar-benar transformed! Tim Ajining memahami vision kami dan menghadirkan furniture yang beyond expectations.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: <Award className="h-8 w-8 text-amber-600" />,
      title: "Premium Materials",
      description: "Kayu solid terpilih dan bahan berkualitas internasional",
    },
    {
      icon: <Shield className="h-8 w-8 text-amber-600" />,
      title: "Garansi 5 Tahun",
      description: "Jaminan kualitas dengan layanan after-sales terbaik",
    },
    {
      icon: <Truck className="h-8 w-8 text-amber-600" />,
      title: "Free Installation",
      description: "Pemasangan gratis oleh tim ahli berpengalaman",
    },
  ];

  const nextTestimonial = () => {
    // setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    // setCurrentTestimonial(
    //   (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    // );
  };

  return (
    <div className="font-inter">
      {/* Hero Section */}
      <section
        id="home"
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className="relative z-10 space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl leading-tight font-light text-gray-900 lg:text-7xl">
                  Premium
                  <span className="block font-bold">Furniture</span>
                  <span className="block text-3xl font-normal text-amber-600 lg:text-4xl">
                    for Modern Living
                  </span>
                </h1>
                <p className="max-w-lg text-xl leading-relaxed text-gray-600">
                  Hadirkan kehangatan dan kemewahan di setiap sudut rumah Anda
                  dengan koleksi furniture premium kami yang dirancang khusus
                  untuk gaya hidup modern.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => router.push("/catalog")}
                  className="group flex items-center justify-center rounded-md bg-gray-900 px-8 py-4 text-lg font-medium text-white transition-all duration-300 hover:bg-gray-800"
                >
                  Lihat Koleksi
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => router.push("/contact")}
                  className="group flex items-center justify-center rounded-md border-2 border-gray-900 px-8 py-4 text-lg font-medium text-gray-900 transition-all duration-300 hover:bg-gray-900 hover:text-white"
                >
                  Kustom Desain
                </button>
              </div>
            </div>

            {/* Right - Image Grid */}
            <div className="relative">
              <div className="grid rotate-3 transform grid-cols-3 gap-4 transition-transform duration-700 hover:rotate-0">
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: "fadeInUp 0.8s ease-out forwards",
                    }}
                  >
                    <img
                      src={image}
                      alt={`Furniture ${index + 1}`}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-4xl font-light text-gray-900 lg:text-5xl">
                Crafted with
                <span className="block font-bold">Passion & Precision</span>
              </h2>
              <p className="text-lg leading-relaxed text-gray-600">
                Sejak 2015, Ajining telah menjadi pilihan utama untuk furniture
                premium di Indonesia. Setiap produk kami dibuat dengan perhatian
                detail yang luar biasa, menggunakan bahan terbaik dan teknik
                craftsmanship yang telah diwariskan turun temurun.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                Kami percaya bahwa furniture bukan hanya sekadar perabotan,
                tetapi investasi jangka panjang untuk kenyamanan dan keindahan
                rumah Anda.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop"
                alt="Craftsmanship"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -right-6 -bottom-6 rounded-lg bg-white p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">2500+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-light text-gray-900 lg:text-5xl">
              Featured
              <span className="font-bold"> Collections</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Temukan koleksi furniture terbaru kami yang menggabungkan desain
              kontemporer dengan kenyamanan maksimal.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-80 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20"></div>
                  <div
                    className={`absolute inset-x-0 bottom-0 transform bg-gradient-to-t from-black/80 to-transparent p-6 transition-all duration-300 ${hoveredProduct === product.id ? "translate-y-0" : "translate-y-2"}`}
                  >
                    <div className="text-white">
                      <p className="mb-1 text-sm font-medium">
                        {product.category}
                      </p>
                      <h3 className="mb-2 text-xl font-bold">{product.name}</h3>
                      <p className="text-lg font-semibold">{product.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-light text-gray-900 lg:text-5xl">
              Why Choose
              <span className="font-bold"> Ajining?</span>
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group text-center transition-all duration-300 hover:scale-105 hover:transform"
              >
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-white p-4 shadow-lg transition-shadow group-hover:shadow-xl">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-light lg:text-5xl">
            Ready to Transform
            <span className="block font-bold">Your Space?</span>
          </h2>
          <p className="mb-8 text-xl leading-relaxed text-gray-300">
            Konsultasikan ide desain Anda dengan tim ahli kami dan dapatkan
            penawaran khusus untuk proyek furniture impian Anda.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => router.push("/contact")}
              className="rounded-md bg-white px-8 py-4 text-lg font-medium text-gray-900 transition-colors hover:bg-gray-100"
            >
              Free Consultation
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="rounded-md border-2 border-white px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-white hover:text-gray-900"
            >
              Get Quote
            </button>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {/* Removed showScrollTop state and button */}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .font-inter {
          font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default FurnitureLandingPage;
