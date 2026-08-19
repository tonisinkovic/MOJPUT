import Layout from "@/components/Layout";
import SrednjaKalkulator from "@/components/SrednjaKalkulator";

export default function Kalkulator() {
  return (
    <Layout>
      <section className="container relative mx-auto max-w-6xl overflow-x-hidden px-3 py-5 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] sm:px-4 sm:py-10 sm:pb-14 md:py-14">
        <SrednjaKalkulator />
      </section>
    </Layout>
  );
}
