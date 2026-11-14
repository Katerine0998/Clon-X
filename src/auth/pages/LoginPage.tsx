import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getEmailByUsername } from "../../services/userService";

const initialForm = {
  username: "",
  password: "",
};


// People can sign in with their email or with their username (we look the email up in Firestore).
const resolveEmail = async (usernameOrEmail: string): Promise<string | null> => {
  if (usernameOrEmail.includes("@")) return usernameOrEmail;
  return getEmailByUsername(usernameOrEmail);
};

export const LoginPage = () => {
  const { authState, login, loginWithGoogle } = useContext(AuthContext);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setLocalError(null);

    try {
      const email = await resolveEmail(form.username.trim());
      if (!email) {
        setLocalError("Usuario o contraseña incorrectos.");
        return;
      }

      const ok = await login(email, form.password);
      if (ok) navigate("/", { replace: true });
    } catch {
      setLocalError("No se pudo iniciar sesión. Revisa las reglas de Firestore e inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    const ok = await loginWithGoogle();
    if (ok) navigate("/", { replace: true });
  };

  return (
  
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="fs-3 fw-bold text-center mb-4">Iniciar sesión</h2>

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Nombre de usuario
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="form-control"
                    value={form.username}
                    onChange={onInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={onInputChange}
                    required
                  />
                </div>

                {(localError || authState.errorMessage) && (
                  <div className="alert alert-danger" role="alert">
                    {localError ?? authState.errorMessage}
                  </div>
                )}

                  <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </button>
                </div>

                <div className="x-divider my-3">
                  <span>o</span>
                </div>

                {/* Google sign in: only the look changed, the logic (onGoogleSignIn) is exactly the same */}
                <div className="d-grid">
                  <button type="button" className="btn btn-google" onClick={onGoogleSignIn}>
                    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>Continuar con Google</span>
                  </button>
                </div>
              </form>

              <p className="text-center mt-3 mb-0">
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};