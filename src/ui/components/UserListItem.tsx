import { Link } from "react-router-dom";
import type { AppUser } from "../../types/models";

interface UserListItemProps {
  user: AppUser;
  showFollowButton?: boolean;
  onFollow?: (username: string) => void;
}

export const UserListItem = ({ user, showFollowButton = false, onFollow }: UserListItemProps) => {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <div className="fw-bold">{user.fullName}</div>
        <Link to={`/user/${user.username}`} className="text-muted text-decoration-none">
          @{user.username}
        </Link>
      </div>

      {showFollowButton && (
        // STYLE: change "btn-primary" to "btn-outline-primary", "btn-dark", etc.
        <button type="button" className="btn btn-primary btn-sm" onClick={() => onFollow?.(user.username)}>
          [Seguir]
        </button>
      )}
    </li>
  );
};