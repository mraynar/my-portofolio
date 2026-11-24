import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card, Icon } from "../components";
import { signInAdmin } from "../lib/supabase";

// Admin login portal component
export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      await signInAdmin(email, password);
      navigate("/admin");
    } catch (err) {
      setErrorMsg(
        err.message || "Gagal masuk. Periksa kembali email dan password Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4 py-16"
      style={{ backgroundColor: "var(--canvas)" }}
    >
      <div className="bg-code-tile absolute inset-0 pointer-events-none" />

      <Container className="relative z-10 max-w-md w-full">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold font-mono hover:underline"
            style={{ color: "var(--google-blue)" }}
          >
            <Icon name="arrow-left" size={16} />
            Kembali ke Beranda
          </Link>
        </div>

        <Card variant="flat" className="p-0 overflow-hidden shadow-2xl">
          <div className="google-bar" />

          <div className="p-6 sm:p-8">
            <div
              className="text-xs font-mono font-bold uppercase tracking-wider mb-2"
              style={{ color: "var(--google-blue)" }}
            >
              PORTAL ADMINISTRASI
            </div>

            <h1
              className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2"
              style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
            >
              Masuk ke CMS
            </h1>

            <p
              className="text-sm font-medium mb-6"
              style={{ color: "var(--ink-secondary)" }}
            >
              Kelola seluruh konten, proyek, dan dokumen portofolio Anda.
            </p>

            {errorMsg && (
              <div
                className="mb-6 p-3.5 rounded-xl border-2 text-xs sm:text-sm font-bold flex items-center gap-2"
                style={{
                  backgroundColor: "var(--google-red-bg)",
                  borderColor: "var(--google-red)",
                  color: "var(--google-red-text)",
                }}
              >
                <Icon name="alert" size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-xs font-bold font-mono uppercase mb-1.5"
                  style={{ color: "var(--ink-secondary)" }}
                >
                  Email Admin
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                    color: "var(--ink)",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-bold font-mono uppercase mb-1.5"
                  style={{ color: "var(--ink-secondary)" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password rahasia"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 font-medium text-sm transition-all"
                  style={{
                    backgroundColor: "var(--surface-alt)",
                    borderColor: "var(--border)",
                    color: "var(--ink)",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="neo-btn-primary font-bold text-sm w-full mt-2"
              >
                {isLoading ? "Memverifikasi..." : "Masuk ke Panel"}
                <Icon name="arrow-right" size={16} />
              </button>
            </form>
          </div>
        </Card>
      </Container>
    </main>
  );
}
