import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Calendar as CalIcon, Bell, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const events = [
  { date: "15. sij 2026", title: "Prijave za državnu maturu", type: "Matura", urgent: true },
  { date: "1. velj 2026", title: "Početak priprema - probna matura", type: "Priprema", urgent: false },
  { date: "15. ožu 2026", title: "Rok za prijavu izbornih predmeta", type: "Matura", urgent: true },
  { date: "1. svi 2026", title: "Početak ispita državne mature", type: "Matura", urgent: true },
  { date: "15. srp 2026", title: "Objava rezultata mature", type: "Rezultati", urgent: false },
  { date: "20. srp 2026", title: "Početak upisa na fakultete", type: "Upisi", urgent: true },
  { date: "30. srp 2026", title: "Završetak prvog upisnog roka", type: "Upisi", urgent: true },
  { date: "15. ruj 2026", title: "Drugi upisni rok", type: "Upisi", urgent: false },
];

const Kalendar = () => {
  return (
    <Layout>
      <section className="container py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">Kalendar</span> važnih datuma
          </h1>
          <p className="text-muted-foreground text-lg">Svi rokovi za maturu, prijave i upise</p>
        </motion.div>

        <div className="space-y-3">
          {events.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card shadow-card border"
            >
              <div className="w-14 text-center shrink-0">
                <CalIcon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground leading-tight">{event.date}</p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm">{event.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{event.type}</Badge>
                  {event.urgent && (
                    <span className="text-xs text-accent font-medium flex items-center gap-1">
                      <Bell className="w-3 h-3" /> Važno
                    </span>
                  )}
                </div>
              </div>
              <button className="text-xs text-primary hover:underline shrink-0">Podsjeti me</button>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Kalendar;
