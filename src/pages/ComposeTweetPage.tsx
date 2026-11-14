import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { MAX_TWEET_LENGTH, publishTweet } from "../services/tweetService";

export const ComposeTweetPage = () => {
  const me = useCurrentUser();
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tooLong = body.length > MAX_TWEET_LENGTH;

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBody(event.target.value);
    setSuccess(false);
    setError(null);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (tooLong) {
      setError(`El mensaje no puede superar los ${MAX_TWEET_LENGTH} caracteres.`);
      return;
    }

    setIsLoading(true);
    try {
      await publishTweet(me, body);
      setBody("");
      setSuccess(true);
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "No se pudo publicar el tweet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="h4 page-title">Publicar tweet</h2>

          <form onSubmit={onSubmit}>
            <div className="mb-2">
              <textarea
                className="form-control border-0 fs-5"
                rows={5}
                placeholder="¿Qué está pasando?"
                value={body}
                onChange={onChange}
                required
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <small className={tooLong ? "text-danger fw-bold" : "text-secondary"}>
                {body.length}/{MAX_TWEET_LENGTH}
              </small>
              <button type="submit" className="btn btn-primary" disabled={isLoading || !body.trim() || tooLong}>
                {isLoading ? "Publicando..." : "[Publicar]"}
              </button>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" role="alert">
                ¡Tweet publicado con éxito! <Link to="/feed">Ver el feed</Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
