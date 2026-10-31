import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export const ComposeTweetPage = () => {
  const [body, setBody] = useState("");
  const navigate = useNavigate();

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => setBody(event.target.value);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Milestone 2: validate the 280 character limit, save in Firestore and notify the user.
    console.log("Mock publish:", body);
    setBody("");
    navigate("/feed");
  };

  return (
    <section className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="h4 mb-3">Publicar tweet</h2>

          <form onSubmit={onSubmit}>
            <div className="mb-3">
    
              <textarea
                className="form-control"
                rows={5}
                placeholder="¿Qué está pasando?"
                value={body}
                onChange={onChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              [Publicar]
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};