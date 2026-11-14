import { useState, type FormEvent } from "react";
import type { AppUser } from "../../types/models";
import { followUser } from "../../services/followService";
import { getUserByUsername, normalizeUsername } from "../../services/userService";

interface FollowByUsernameFormProps {
  currentUser: AppUser;
  onFollowed?: () => void;
}

type Feedback = { kind: "success" | "warning" | "danger"; text: string } | null;

export const FollowByUsernameForm = ({ currentUser, onFollowed }: FollowByUsernameFormProps) => {
  const [username, setUsername] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clean = normalizeUsername(username.replace(/^@/, ""));
    if (!clean) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const target = await getUserByUsername(clean);
      if (!target) {
        setFeedback({ kind: "danger", text: `No existe ningún usuario con el nombre @${clean}.` });
        return;
      }

      const result = await followUser(currentUser, target);
      if (result === "self") {
        setFeedback({ kind: "warning", text: "No puedes seguirte a ti mismo." });
      } else if (result === "already") {
        setFeedback({ kind: "warning", text: `Ya sigues a @${target.username}.` });
      } else {
        setFeedback({ kind: "success", text: `¡Ahora sigues a @${target.username}!` });
        setUsername("");
        onFollowed?.();
      }
    } catch {
      setFeedback({ kind: "danger", text: "No se pudo completar la acción. Inténtalo de nuevo." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="x-follow-form">
      <div className="x-pill">
        <i className="bi bi-at text-secondary"></i>
        <input
          id="followUsername"
          type="text"
          placeholder="nombre de usuario"
          aria-label="Seguir a alguien por su nombre de usuario"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <button type="submit" className="btn btn-light btn-sm" disabled={isLoading || !username.trim()}>
          [Seguir]
        </button>
      </div>
      {feedback && (
        <div className={`alert alert-${feedback.kind} py-2 mt-2 mb-0`} role="alert">
          {feedback.text}
        </div>
      )}
    </form>
  );
};