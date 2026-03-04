import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export function HomePage() {
  const features = [
    {
      title: "Pametno zakazivanje",
      description: "Lako i brzo zakazujte i upravljajte terminima.",
    },
    {
      title: "Sigurnost i privatnost",
      description: "Vaši zdravstveni podaci su potpuno zaštićeni.",
    },
    {
      title: "Najbolji stomatolozi",
      description: "Pristup sertifikovanim i visoko ocenjenim profesionalcima.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto md:mx-0">
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm">
            Moderan sistem za stomatološko upravljanje
          </div>

          <h1 className="text-3xl md:text-5xl text-slate-900 mt-6 leading-tight">
            Upravljajte svojim stomatološkim uslugama{" "}
            <span className="text-blue-600">jednostavno i efikasno</span>
          </h1>

          <p className="text-base md:text-xl text-slate-600 mt-4">
            SmartSmile donosi napredan način upravljanja stomatološkom praksom
            uz pametno zakazivanje, detaljne kartone pacijenata i brzu
            komunikaciju.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-xl px-8 py-3 transition">
              Zakaži termin
            </button>

            <button className="w-full sm:w-auto border border-slate-300 text-slate-700 text-lg rounded-xl px-8 py-3 hover:bg-slate-100 transition">
              Pronađi stomatologa
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl text-slate-900 mb-4">
            Sve što vam je potrebno na jednom mestu
          </h2>
          <p className="text-base md:text-xl text-slate-600">
            Savršeno prilagođeno pacijentima i stomatolozima
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-3xl p-6 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-4xl mb-4">
            Spremni da unapredite stomatološku praksu?
          </h2>
          <p className="text-base md:text-xl text-blue-100 mb-8">
            Pridružite se hiljadama zadovoljnih pacijenata i dentalnih
            stručnjaka.
          </p>

          <Link
            to="/register"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 rounded-xl px-8 py-3 text-lg font-medium transition"
          >
            Započni odmah
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="mb-4 text-lg font-semibold">SmartSmile</h3>
              <p className="text-slate-400">
                Moderan sistem za digitalno upravljanje stomatološkim uslugama.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-medium">Proizvod</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Funkcionalnosti</li>
                <li>Bezbednost</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-medium">Kompanija</h4>
              <ul className="space-y-2 text-slate-400">
                <li>O nama</li>
                <li>Kontakt</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-medium">Pravna regulativa</h4>
              <ul className="space-y-2 text-slate-400">
                <li>Privatnost</li>
                <li>Uslovi korišćenja</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
            © 2025 SmartSmile. Sva prava zadržana.
          </div>
        </div>
      </footer>
    </div>
  );
}
