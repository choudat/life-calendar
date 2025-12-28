import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>
        
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Éditeur du site</h2>
            <p>
              <strong>ConnEthics SASU</strong><br />
              RCS Nanterre: 844 407 866<br />
              21 rue Paul Déroulède<br />
              92270 Bois-Colombes, France
            </p>
            <p className="mt-4">
              <strong>Directeur de la publication :</strong> Frederic CHOUDAT
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Hébergement</h2>
            <p>
              <strong>Vercel Inc.</strong><br />
              650 California St<br />
              San Francisco, CA 94108, United States
            </p>
            <p className="mt-4">
              <strong>Région d'infrastructure :</strong> Paris, France (West) - eu-west-3 - cdg1<br />
              <span className="italic">Conformément à notre engagement pour la souveraineté numérique, nous hébergeons nos données sur le territoire français.</span>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Contact</h2>
            <p>
              Email : <a href="mailto:contact@connethics.com" className="text-indigo-600 hover:underline">contact@connethics.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
              Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Données personnelles</h2>
            <p>
              Les informations recueillies font l’objet d’un traitement informatique destiné à la gestion des comptes utilisateurs. 
              Conformément à la loi « informatique et libertés », vous bénéficiez d’un droit d’accès et de rectification aux informations qui vous concernent.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
