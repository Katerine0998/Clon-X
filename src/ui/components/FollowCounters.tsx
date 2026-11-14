import { Link } from "react-router-dom";

interface FollowCountersProps {
  followers: number;
  following: number;
  // Optional: where each counter should link to (the lists of followers / followed users)
  followersTo?: string;
  followingTo?: string;
}

export const FollowCounters = ({ followers, following, followersTo, followingTo }: FollowCountersProps) => {
  const followersContent = (
    <>
      <strong className="text-body">{followers}</strong> Seguidores
    </>
  );
  const followingContent = (
    <>
      <strong className="text-body">{following}</strong> Seguidos
    </>
  );

  return (
    <div className="d-flex justify-content-center gap-4 text-secondary">
      {followersTo ? <Link to={followersTo} className="text-secondary text-decoration-none">{followersContent}</Link> : <span>{followersContent}</span>}
      {followingTo ? <Link to={followingTo} className="text-secondary text-decoration-none">{followingContent}</Link> : <span>{followingContent}</span>}
    </div>
  );
};
