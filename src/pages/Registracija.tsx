import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Mail, Lock, User } from "lucide-react";
import { authRegister } from "@/lib/auth";

const Registracija = () => {
  const [verifyInfo, setVerifyInfo] = useState<{
    emailPreviewUrl?: string;
    directVerifyUrl?: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    status: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Lozinke se ne poklapaju.");
      return;
    }

    const username = `${formData.firstName} ${formData.lastName}`.trim();
    const res = await authRegister({
      username: username || formData.email.split("@")[0],
      email: formData.email,
      password: formData.password,
    });

    if (!res.success) {
      setError(res.message);
      return;
    }

    const data = res as { dev_verification_url?: string; email_preview_url?: string };
    setVerifyInfo({
      emailPreviewUrl: data.email_preview_url || undefined,
      directVerifyUrl: data.dev_verification_url || undefined,
    });
    setSubmitted(true);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      status: "",
    });
  };

  return (
    <Layout>
      <section className="container py-16 max-w-4xl mx-auto">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <User className="w-4 h-4" />
              Tvoj MojPut račun
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Kreiraj svoj besplatni MojPut račun
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Spremi svoje rezultate kviza, planiraj upise i prati važne datume na jednom mjestu.
              Registracija traje manje od minute.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Spremanje rezultata kvizova i samoprocjene</li>
              <li>• Personalizirane preporuke fakulteta i smjerova</li>
              <li>• Podsjetnici na bitne datume i rokove</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 md:p-7">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ime
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder="Unesite vaše ime"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Prezime
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      placeholder="Unesite vaše prezime"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="vasa@email.com"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Koji si ti?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "srednjoskolac", label: "Srednjoškolac" },
                      { value: "maturant", label: "Maturant" },
                      { value: "student", label: "Student" },
                      { value: "profesor", label: "Profesor" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.status === option.value
                            ? "border-slate-900 bg-slate-50"
                            : "border-slate-300 hover:border-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={formData.status === option.value}
                          onChange={handleChange}
                          required
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="ml-2 text-sm font-medium text-slate-700">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Lock size={16} />
                      Lozinka
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Minimalno 6 znakova"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Lock size={16} />
                      Potvrdi lozinku
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Ponovite lozinku"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 mt-2 text-sm"
                >
                  Registriraj se
                </button>

                <p className="text-center text-xs text-slate-600">
                  Već imaš račun?{" "}
                  <Link to="/prijava" className="text-slate-900 font-semibold hover:underline">
                    Prijavi se
                  </Link>
                </p>
              </form>
            ) : (
              <div className="p-4 md:p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Uspješna registracija!
                </h3>
                <p className="text-slate-600 text-sm">
                  {verifyInfo?.emailPreviewUrl
                    ? "Email je poslan. Pregledaj ga u testnom inboxu i klikni na link za potvrdu, ili koristi direktan link ispod:"
                    : "Provjerite e-mail i kliknite na link za potvrdu računa, pa se zatim prijavite."}
                </p>
                {verifyInfo?.emailPreviewUrl && (
                  <a
                    href={verifyInfo.emailPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-slate-700 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition"
                  >
                    Pregledaj poslani email
                  </a>
                )}
                {verifyInfo?.directVerifyUrl && (
                  <a
                    href={verifyInfo.directVerifyUrl}
                    className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
                  >
                    Potvrdi račun i prijavi se
                  </a>
                )}
                <p className="pt-2">
                  <Link
                    to="/prijava"
                    className="text-slate-900 font-semibold hover:underline"
                  >
                    Idi na prijavu →
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Registracija;

