import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialForm = {
  fullName: "",
  username: "",
  email: "",
  password: "",
};

export const RegisterPage = () => {
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    console.log("Mock register:", form);
    navigate("/login");
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

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Registrarme
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