import { Link, useLocation } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useAsyncData } from "../../hooks/useAsyncData";
import { followUser, getSuggestedUsers } from "../../services/followService";
import { Avatar } from "../components/Avatar";
import type { AppUser } from "../../types/models";

export const RightColumn = () => {
  const me = useCurrentUser();
  const { pathname } = useLocation();

  // Suggestions are reloaded every time the person changes page
  const { data: suggestions, reload } = useAsyncData(() => getSuggestedUsers(me.uid), [me.uid, pathname]);

  const onFollow = async (user: AppUser) => {
    await followUser(me, user);
    reload();
  };

  return (
    <aside className="x-right">
      <div className="x-card">
        <h2 className="x-card-title">A quién seguir</h2>

        {suggestions && suggestions.length === 0 && (
          <p className="text-secondary px-3 mb-2">Por ahora no hay más personas para sugerir.</p>
        )}

        {suggestions?.map((user) => (
          <div key={user.uid} className="x-suggestion">
            <Avatar name={user.fullName} />
            <Link to={`/user/${user.username}`} className="x-suggestion-info">
              <strong className="text-truncate">{user.fullName}</strong>
              <span className="text-secondary text-truncate">@{user.username}</span>
            </Link>
            <button type="button" className="btn btn-light btn-sm" onClick={() => onFollow(user)}>
              [Seguir]
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};