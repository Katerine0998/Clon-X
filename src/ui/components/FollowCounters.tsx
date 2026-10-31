interface FollowCountersProps {
  followers: number;
  following: number;
}

export const FollowCounters = ({ followers, following }: FollowCountersProps) => {
  return (
    <div className="d-flex justify-content-center gap-4">
      <span>
        <strong>{followers}</strong> Seguidores
      </span>
      <span>
        <strong>{following}</strong> Seguidos
      </span>
    </div>
  );
};