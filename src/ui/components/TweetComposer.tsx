import { useState, type ChangeEvent, type FormEvent } from "react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { MAX_TWEET_LENGTH, publishTweet } from "../../services/tweetService";
import { Avatar } from "./Avatar";

interface TweetComposerProps {
  onPublished?: () => void;
}

// "¿Qué está pasando?" box: multiline text, 280 characters and the [Publicar] button
export const TweetComposer = ({ onPublished }: TweetComposerProps) => {
  const me = useCurrentUser();
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tooLong = body.length > MAX_TWEET_LENGTH;
  const counterClass = tooLong ? "text-danger fw-bold" : body.length > 260 ? "text-warning" : "text-secondary";

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
      onPublished?.();
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : "No se pudo publicar el tweet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="x-composer" onSubmit={onSubmit}>
      <Avatar name={me.fullName} />

      <div className="flex-grow-1" style={{ minWidth: 0 }}>
        <textarea
          className="x-composer-input"
          rows={Math.min(8, Math.max(2, body.split("\n").length))}
          placeholder="¿Qué está pasando?"
          value={body}
          onChange={onChange}
        />

        {error && (
          <div className="alert alert-danger py-2 mt-2 mb-0" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success py-2 mt-2 mb-0" role="alert">
            ¡Tweet publicado con éxito!
          </div>
        )}

        <div className="x-composer-footer">
          <small className={counterClass}>
            {body.length}/{MAX_TWEET_LENGTH}
          </small>
          <button type="submit" className="btn btn-primary" disabled={isLoading || !body.trim() || tooLong}>
            {isLoading ? "Publicando..." : "[Publicar]"}
          </button>
        </div>
      </div>
    </form>
  );
};