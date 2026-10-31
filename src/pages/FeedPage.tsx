import { currentUser, followingUsers, mockTweets } from "../data/mockData";
import { sortTweetsNewestFirst } from "../utils/sorting";
import { usePagination } from "../hooks/usePagination";
import { TweetCard } from "../ui/components/TweetCard";
import { Pagination } from "../ui/components/Pagination";


const feedAuthors = [currentUser.username, ...followingUsers.map((user) => user.username)];
const feedTweets = sortTweetsNewestFirst(mockTweets.filter((tweet) => feedAuthors.includes(tweet.authorUsername)));

export const FeedPage = () => {
  const { items, currentPage, totalPages, setPage } = usePagination(feedTweets);

  return (
    <section className="container py-4">
      <div className="row justify-content-center">
       <div className="col-md-8 col-lg-6 x-column p-0">
          <h2 className="h4 page-title">Feed</h2>

          {items.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </section>
  );
};