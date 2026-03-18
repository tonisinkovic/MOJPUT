import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Props = { title: string };

const RoditeljiPlaceholder = ({ title }: Props) => (
  <Layout>
    <section className="container py-16 max-w-2xl mx-auto px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">{title}</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">
        Ova stranica je u izradi. Sadržaj će uskoro biti dostupan.
      </p>
      <Link
        to="/roditelji"
        className="inline-flex items-center gap-2 text-sky-600 dark:text-sky-400 font-semibold hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Natrag na Roditeljski kutak
      </Link>
    </section>
  </Layout>
);

export default RoditeljiPlaceholder;
