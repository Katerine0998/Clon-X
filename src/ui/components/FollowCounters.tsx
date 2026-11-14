import { Link } from "react-router-dom";

interface FollowCountersProps {
  followers: number;
  following: number;
  // Optional: where each counter should link to (the lists of followers / followed users)
  followersTo?: string;
  followingTo?: string;
}

export const FollowCounters = ({ followers, following, followersTo, followingTo }: FollowCountersProps) => {
  const followingContent = (
    <>
      <strong className="text-body">{following}</strong> Seguidos
    </>
  );
  const followersContent = (
    <>
      <strong className="text-body">{followers}</strong> Seguidores
    </>
  );

  return (
    <div className="d-flex gap-4 text-secondary">
      {followingTo ? <Link to={followingTo} className="text-secondary">{followingContent}</Link> : <span>{followingContent}</span>}
      {followersTo ? <Link to={followersTo} className="text-secondary">{followersContent}</Link> : <span>{followersContent}</span>}
    </div>
  );
};
