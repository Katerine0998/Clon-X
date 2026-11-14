import { Link, useParams } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAsyncData } from "../hooks/useAsyncData";
import { usePagination } from "../hooks/usePagination";
import { getFollowing } from "../services/followService";
import { getUserByUsername } from "../services/userService";
import { sortByFullName } from "../utils/sorting";
import { UserListItem } from "../ui/components/UserListItem";
import { Pagination } from "../ui/components/Pagination";
import { LoadingState } from "../ui/components/LoadingState";

// Shows the people followed by the logged user, or by the user in the URL (/user/:username/following)
export const FollowingPage = () => {
  const me = useCurrentUser();
  const { username } = useParams<{ username: string }>();

  const { data, loading, error } = useAsyncData(async () => {
    const target = username ? await getUserByUsername(username) : me;
    if (!target) return null;
    return { target, users: sortByFullName(await getFollowing(target.uid)) };
  }, [username, me.uid]);

  const { items, currentPage, totalPages, setPage } = usePagination(data?.users ?? []);

  return (
    <section className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 x-column p-0">
          <h2 className="h4 page-title">{username ? `Seguidos de @${username}` : "Seguidos"}</h2>

          <LoadingState loading={loading} error={error} />

          {!loading && !error && !data && (
            <div className="alert alert-warning m-3">
              Usuario no encontrado. <Link to="/">Volver al inicio</Link>
            </div>
          )}

          {data && data.users.length === 0 && <p className="text-secondary text-center py-4">Aún no sigue a nadie.</p>}

          <ul className="list-group">
            {items.map((user) => (
              <UserListItem key={user.uid} user={user} />
            ))}
          </ul>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </section>
  );
};
