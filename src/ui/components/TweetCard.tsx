import { Link } from "react-router-dom";
import type { Tweet } from "../../types/models";

interface TweetCardProps {
  tweet: Tweet;
}

export const TweetCard = ({ tweet }: TweetCardProps) => {
  const publishedAt = new Date(tweet.createdAt).toLocaleString("es-CO");

  return (
  <article className="tweet-card d-flex gap-3 px-3 py-3">
    <div className="avatar rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0">
      {tweet.authorFullName.charAt(0)}
    </div>
    <div className="flex-grow-1">
      <header className="mb-1">
        <strong>{tweet.authorFullName}</strong>,{" "}
        <Link to={`/user/${tweet.authorUsername}`} className="text-secondary text-decoration-none">
          @{tweet.authorUsername}
        </Link>{" "}
        - <span className="text-secondary">{publishedAt}</span>
      </header>
      <p className="mb-0">{tweet.body}</p>
    </div>
  </article>

  );
};