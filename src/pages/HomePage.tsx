import { Link } from "react-router-dom";
import { currentUser, followerUsers, followingUsers } from "../data/mockData";
import { FollowCounters } from "../ui/components/FollowCounters";

export const HomePage = () => {
  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* STYLE: profile card. Try "border-primary" or "bg-light" on this card */}
          <div className="card shadow-sm">
            <div className="card-body text-center p-4">
              <h2 className="fw-bold mb-0">{currentUser.fullName}</h2>
              <p className="text-muted">@{currentUser.username}</p>

              <FollowCounters followers={followerUsers.length} following={followingUsers.length} />

              <div className="d-grid gap-2 mt-4">
                {/* "Tweet" link required by the assignment */}
                <Link to="/tweet" className="btn btn-primary">
                  Tweet
                </Link>
                <Link to="/feed" className="btn btn-outline-primary">
                  Ver feed
                </Link>
                <Link to={`/user/${currentUser.username}`} className="btn btn-outline-secondary">
                  Mis tweets
                </Link>
                <div className="d-flex gap-2">
                  <Link to="/followers" className="btn btn-outline-dark flex-fill">
                    Seguidores
                  </Link>
                  <Link to="/following" className="btn btn-outline-dark flex-fill">
                    Seguidos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};