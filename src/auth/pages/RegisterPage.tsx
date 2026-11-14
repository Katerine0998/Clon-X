import { useContext, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { USERNAME_REGEX, normalizeUsername } from "../../services/userService";

const initialForm = {
  fullName: "",
  username: "",
  email: "",
  password: "",
};

export const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!USERNAME_REGEX.test(normalizeUsername(form.username))) {
      setError("El nombre de usuario debe tener entre 3 y 20 caracteres: letras, números, punto o guion bajo.");
      return;
    }

    setIsLoading(true);
    const errorMessage = await register({
      fullName: form.fullName,
      username: form.username,
      email: form.email.trim(),
      password: form.password,
    });
    setIsLoading(false);

    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="fs-3 fw-bold text-center mb-4">Crear cuenta</h2>

              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Nombre completo
                  </label>
                  <input id="fullName" name="fullName" type="text" className="form-control" value={form.fullName} onChange={onInputChange} required />
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Nombre de usuario
                  </label>
                  <input id="username" name="username" type="text" className="form-control" value={form.username} onChange={onInputChange} required />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo electrónico
                  </label>
                  <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={onInputChange} required />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input id="password" name="password" type="password" minLength={6} className="form-control" value={form.password} onChange={onInputChange} required />
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? "Registrando..." : "Registrarme"}
                  </button>
                </div>
              </form>

              <p className="text-center mt-3 mb-0">
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
