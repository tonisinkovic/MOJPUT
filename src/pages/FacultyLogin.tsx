import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginFaculty } from "@/lib/facultyStore";

const FacultyLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Unesi email i lozinku.");
      return;
    }

    const session = loginFaculty(email, password);
    if (!session) {
      setError("Neispravni podaci za prijavu fakulteta.");
      return;
    }
    navigate("/fakulteti/dashboard");
  };

  return (
    <Layout>
      <section className="container py-16 max-w-md">
        <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-card">
          <h1 className="text-2xl font-bold">Prijava fakulteta</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Prijava je namijenjena isključivo fakultetskim računima.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="faculty-email">
                Email
              </label>
              <Input
                id="faculty-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fakultet@email.hr"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="faculty-password">
                Lozinka
              </label>
              <Input
                id="faculty-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Unesi lozinku"
              />
            </div>

            {error && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Prijavi se
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default FacultyLogin;
