import Layout from "@/components/Layout";
import SrednjaKalkulator from "@/components/SrednjaKalkulator";
import { ArrowLeft } from "lucide-react";

export default function Kalkulator() {
  return (
    <Layout>
      <section className="container relative mx-auto max-w-6xl overflow-x-hidden px-3 py-5 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] sm:px-4 sm:py-10 sm:pb-14 md:py-14">
        {/* Back button */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Natrag</span>
        </button>

        <SrednjaKalkulator />
      </section>
    </Layout>
  );
}
