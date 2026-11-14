import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAsyncData } from "../hooks/useAsyncData";
import { usePagination } from "../hooks/usePagination";
import { getFeedTweets } from "../services/tweetService";
import { getFollowing } from "../services/followService";
import { TweetCard } from "../ui/components/TweetCard";
import { Pagination } from "../ui/components/Pagination";
import { LoadingState } from "../ui/components/LoadingState";

export const FeedPage = () => {
  const me = useCurrentUser();

  // Tweets from me and from the people I follow, newest first
  const { data, loading, error } = useAsyncData(async () => {
    const following = await getFollowing(me.uid);
    return getFeedTweets([me.uid, ...following.map((user) => user.uid)]);
  }, [me.uid]);

  const { items, currentPage, totalPages, setPage } = usePagination(data ?? []);

  return (
    <section className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 x-column p-0">
          <h2 className="h4 page-title">Feed</h2>

          <LoadingState loading={loading} error={error} />

          {!loading && !error && items.length === 0 && (
            <p className="text-secondary text-center py-4">Aún no hay tweets. ¡Publica el primero o sigue a alguien!</p>
          )}

          {items.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </section>
  );
};