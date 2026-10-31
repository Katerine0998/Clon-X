interface FollowCountersProps {
  followers: number;
  following: number;
}

export const FollowCounters = ({ followers, following }: FollowCountersProps) => {
  return (
  <div className="d-flex justify-content-center gap-4 text-secondary">
  <span><strong className="text-body">{followers}</strong> Seguidores</span>
  <span><strong className="text-body">{following}</strong> Seguidos</span>
</div>
  );
};