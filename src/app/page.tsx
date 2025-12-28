import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <span>Life Calendar</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Fonctionnalités</Link>
            <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Tarifs</Link>
            <Link href="#about" className="hover:text-indigo-600 transition-colors">À propos</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/app" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
              Connexion
            </Link>
            <Link 
              href="/app" 
              className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Commencer
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Visualisez votre vie <br />
            <span className="text-indigo-600">en semaines.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Une perspective unique sur votre temps. Marquez vos événements marquants, 
            suivez vos périodes de vie et prenez conscience de chaque instant.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/app" 
              className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all hover:scale-105"
            >
              Créer mon calendrier <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/app" 
              className="text-slate-600 font-medium px-8 py-3 hover:text-indigo-600 transition-colors"
            >
              Voir la démo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Plus qu'un simple calendrier</h2>
            <p className="text-lg text-slate-600">
              Pourquoi se contenter du calendrier Grégorien ? Découvrez votre vie sous un nouvel angle, 
              que vous soyez fan de la base 10 ou nostalgique des semaines.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Vues Décimales",
                description: "Comptez votre vie en blocs de 10, 100 ou 1000 jours. Parce que diviser par 7, c'est franchement compliqué pour rien."
              },
              {
                title: "Import / Export CSV",
                description: "Vos données vous appartiennent. Exportez tout en CSV pour Excel, ou importez votre vie entière en un clic."
              },
              {
                title: "Jusqu'à 100 ans",
                description: "On a prévu large. Très large. De quoi planifier votre retraite sur Mars ou vos 15 prochaines carrières."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-600">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Tarifs</h2>
          <div className="max-w-md mx-auto bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <div className="text-5xl font-extrabold text-indigo-600 mb-4">0€</div>
            <p className="text-xl font-medium text-slate-900 mb-4">C'est gratuit.</p>
            <p className="text-slate-600 mb-8">
              Pour l'instant, c'est offert par la maison. Si vous insistez vraiment pour payer, 
              contactez-moi, on trouvera sûrement un arrangement (je prends les tickets resto).
            </p>
            <Link 
              href="/app" 
              className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Profiter de l'offre (vite !)
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">À propos du projet</h2>
          <div className="prose prose-slate mx-auto text-slate-600 leading-relaxed space-y-4">
            <p>
              Life Calendar n'est pas une startup de la Silicon Valley qui cherche à disrupter le marché du temps.
              C'est avant tout un <strong>side project</strong>, né d'une idée qui traînait dans un coin de ma tête depuis des années.
            </p>
            <p>
              L'objectif ? Avoir une vue d'ensemble. Prendre du recul. Réaliser que 1000 jours, ça passe vite, 
              mais qu'on peut y faire beaucoup de choses.
            </p>
            <p className="italic">
              Ce projet a été rendu possible grâce à l'IA, qui m'a permis de transformer mes gribouillages 
              en code React sans y laisser ma santé mentale.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Life Calendar. Tous droits réservés.
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/mentions-legales" className="hover:text-indigo-600 transition-colors">
                Mentions Légales
              </Link>
              <a 
                href="https://github.com/choudat?tab=repositories" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-indigo-600 transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://connethics.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-indigo-600 transition-colors"
              >
                ConnEthics
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
