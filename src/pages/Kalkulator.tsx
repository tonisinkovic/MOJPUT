import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator as CalcIcon, ArrowRight, GraduationCap, CheckCircle2 } from "lucide-react";

const subjects = [
  { key: "hrvatski", label: "Hrvatski jezik", max: 5 },
  { key: "matematika", label: "Matematika", max: 5 },
  { key: "engleski", label: "Engleski jezik", max: 5 },
  { key: "prosjek", label: "Prosjek ocjena (sve 4 godine)", max: 5 },
  { key: "matura_hrv", label: "Matura - Hrvatski (%)", max: 100 },
  { key: "matura_mat", label: "Matura - Matematika (%)", max: 100 },
  { key: "matura_eng", label: "Matura - Engleski (%)", max: 100 },
];

const Kalkulator = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [calculated, setCalculated] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  const handleChange = (key: string, val: string) => {
    setValues({ ...values, [key]: val });
    setCalculated(false);
  };

  const calculate = () => {
    const prosjek = parseFloat(values.prosjek || "0");
    const matHrv = parseFloat(values.matura_hrv || "0");
    const matMat = parseFloat(values.matura_mat || "0");
    const matEng = parseFloat(values.matura_eng || "0");

    const points = Math.round(prosjek * 40 + matHrv * 2 + matMat * 3 + matEng * 1.5);
    setTotalPoints(Math.min(points, 1000));
    setCalculated(true);
  };

  const possibleFaculties = [
    { name: "Ekonomski fakultet - Zagreb", min: 600 },
    { name: "FER - Zagreb", min: 850 },
    { name: "PMF - Matematika", min: 550 },
    { name: "Pravni fakultet - Zagreb", min: 700 },
    { name: "FESB - Split", min: 450 },
    { name: "Filozofski fakultet - Rijeka", min: 400 },
  ].filter((f) => totalPoints >= f.min);

  return (
    <Layout>
      <section className="container py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center">
              <CalcIcon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Kalkulator bodova</h1>
              <p className="text-muted-foreground text-sm">Izračunaj bodove za upis na fakultet</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {subjects.map((s) => (
              <div key={s.key} className="space-y-1.5">
                <Label htmlFor={s.key} className="text-sm">{s.label}</Label>
                <Input
                  id={s.key}
                  type="number"
                  min={0}
                  max={s.max}
                  step={s.max > 5 ? 1 : 0.1}
                  placeholder={`Maksimalno ${s.max}`}
                  value={values[s.key] || ""}
                  onChange={(e) => handleChange(s.key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <Button className="w-full gradient-hero border-0 text-primary-foreground h-12" onClick={calculate}>
            Izračunaj bodove <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          {calculated && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <div className="p-6 rounded-2xl bg-card shadow-card border text-center mb-6">
                <p className="text-sm text-muted-foreground mb-1">Tvoj ukupni broj bodova</p>
                <p className="text-5xl font-extrabold text-gradient">{totalPoints}</p>
                <p className="text-sm text-muted-foreground mt-1">od maksimalnih 1000</p>
              </div>

              {possibleFaculties.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Fakulteti koje možeš upisati:
                  </h3>
                  <div className="space-y-2">
                    {possibleFaculties.map((f) => (
                      <div key={f.name} className="p-3 rounded-xl bg-muted/50 border flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-badge-success shrink-0" />
                        <span className="text-sm font-medium">{f.name}</span>
                        <span className="text-xs text-muted-foreground ml-auto">min. {f.min}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </section>
    </Layout>
  );
};

export default Kalkulator;
