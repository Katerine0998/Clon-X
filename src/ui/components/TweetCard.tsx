import { Link } from "react-router-dom";
import type { Tweet } from "../../types/models";

interface TweetCardProps {
  tweet: Tweet;
}

// Format required by the assignment:
// ------------------------------------------------------
// Full name, @username - Publication date and time
// Message body
// ------------------------------------------------------
export const TweetCard = ({ tweet }: TweetCardProps) => {
  const publishedAt = new Date(tweet.createdAt).toLocaleString("es-CO");

  return (
    <article className="my-3">
      {/* STYLE: the two <hr> are the separator lines. Replace them with a Bootstrap "card" if you prefer */}
      <hr className="my-2" />
      <header className="mb-1">
        <strong>{tweet.authorFullName}</strong>,{" "}
        <Link to={`/user/${tweet.authorUsername}`} className="text-decoration-none">
          @{tweet.authorUsername}
        </Link>{" "}
        - <span className="text-muted">{publishedAt}</span>
      </header>
      <p className="mb-0">{tweet.body}</p>
      <hr className="my-2" />
    </article>
  );
};