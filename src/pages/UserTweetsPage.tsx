import { Link, useParams } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAsyncData } from "../hooks/useAsyncData";
import { usePagination } from "../hooks/usePagination";
import { getUserByUsername } from "../services/userService";
import { getTweetsByUser } from "../services/tweetService";
import { followUser, getFollowCounts, isFollowing } from "../services/followService";
import { TweetCard } from "../ui/components/TweetCard";
import { Pagination } from "../ui/components/Pagination";
import { FollowCounters } from "../ui/components/FollowCounters";
import { LoadingState } from "../ui/components/LoadingState";

export const UserTweetsPage = () => {
  const me = useCurrentUser();
  const { username } = useParams<{ username: string }>();

  const { data, loading, error, reload } = useAsyncData(async () => {
    const user = await getUserByUsername(username ?? "");
    if (!user) return null;

    const [tweets, counts, following] = await Promise.all([
      getTweetsByUser(user.uid),
      getFollowCounts(user.uid),
      user.uid === me.uid ? Promise.resolve(true) : isFollowing(me.uid, user.uid),
    ]);
    return { user, tweets, counts, following };
  }, [username, me.uid]);

  const { items, currentPage, totalPages, setPage } = usePagination(data?.tweets ?? []);

  const onFollow = async () => {
    if (!data) return;
    await followUser(me, data.user);
    reload();
  };

  if (loading || error) {
    return (
      <section className="container py-4">
        <LoadingState loading={loading} error={error} />
      </section>
    );
  }

  if (!data) {
    return (
      <section className="container py-4">
        <div className="alert alert-warning">
          Usuario no encontrado. <Link to="/">Volver al inicio</Link>
        </div>
      </section>
    );
  }

  const { user, counts, following } = data;

  return (
    <section className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 x-column p-0">
          <div className="text-center mb-4">
            <h2 className="mb-0">{user.fullName}</h2>
            <p className="text-muted">@{user.username}</p>

            <FollowCounters
              followers={counts.followers}
              following={counts.following}
              followersTo={`/user/${user.username}/followers`}
              followingTo={`/user/${user.username}/following`}
            />

            {/* "[Seguir]" button only if the user is not followed yet */}
            {!following && (
              <button type="button" className="btn btn-primary mt-3" onClick={onFollow}>
                [Seguir]
              </button>
            )}
          </div>

          {items.length === 0 && <p className="text-secondary text-center py-4">Este usuario aún no ha publicado tweets.</p>}

          {items.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </section>
  );
};
