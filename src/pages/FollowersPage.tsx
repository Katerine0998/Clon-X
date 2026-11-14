import { Link, useParams } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAsyncData } from "../hooks/useAsyncData";
import { usePagination } from "../hooks/usePagination";
import { followUser, getFollowers, getFollowing } from "../services/followService";
import { getUserByUsername } from "../services/userService";
import { sortByFullName } from "../utils/sorting";
import type { AppUser } from "../types/models";
import { UserListItem } from "../ui/components/UserListItem";
import { Pagination } from "../ui/components/Pagination";
import { LoadingState } from "../ui/components/LoadingState";

// Shows the followers of the logged user, or of the user in the URL (/user/:username/followers)
export const FollowersPage = () => {
  const me = useCurrentUser();
  const { username } = useParams<{ username: string }>();

  const { data, loading, error, reload } = useAsyncData(async () => {
    const target = username ? await getUserByUsername(username) : me;
    if (!target) return null;

    const [followers, myFollowing] = await Promise.all([getFollowers(target.uid), getFollowing(me.uid)]);
    return {
      target,
      users: sortByFullName(followers),
      followedUids: myFollowing.map((user) => user.uid),
    };
  }, [username, me.uid]);

  const { items, currentPage, totalPages, setPage } = usePagination(data?.users ?? []);

  const onFollow = async (user: AppUser) => {
    await followUser(me, user);
    reload();
  };

  return (
    <section className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 x-column p-0">
          <h2 className="h4 page-title">{username ? `Seguidores de @${username}` : "Seguidores"}</h2>

          <LoadingState loading={loading} error={error} />

          {!loading && !error && !data && (
            <div className="alert alert-warning m-3">
              Usuario no encontrado. <Link to="/">Volver al inicio</Link>
            </div>
          )}

          {data && data.users.length === 0 && <p className="text-secondary text-center py-4">Aún no tiene seguidores.</p>}

          <ul className="list-group">
            {items.map((user) => (
              <UserListItem
                key={user.uid}
                user={user}
                // "[Seguir]" only for people I am not following yet (and never for myself)
                showFollowButton={user.uid !== me.uid && !data?.followedUids.includes(user.uid)}
                onFollow={() => onFollow(user)}
              />
            ))}
          </ul>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </section>
  );
};
