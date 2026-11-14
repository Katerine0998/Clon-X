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

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </button>

           
                  <button type="button" className="btn btn-lightr" onClick={onGoogleSignIn}>
                    Continuar con Google
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