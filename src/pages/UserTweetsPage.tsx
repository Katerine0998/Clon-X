import { useState } from "react";
import { useParams } from "react-router-dom";
import { currentUser, followingUsers, getFollowCounts, mockTweets, mockUsers } from "../data/mockData";
import { sortTweetsNewestFirst } from "../utils/sorting";
import { usePagination } from "../hooks/usePagination";
import { TweetCard } from "../ui/components/TweetCard";
import { Pagination } from "../ui/components/Pagination";
import { FollowCounters } from "../ui/components/FollowCounters";

export const UserTweetsPage = () => {
  const { username } = useParams<{ username: string }>();

  const user = username === currentUser.username ? currentUser : mockUsers.find((u) => u.username === username);
  const isOwnProfile = user?.username === currentUser.username;

  const [isFollowing, setIsFollowing] = useState(followingUsers.some((u) => u.username === username));

  const userTweets = sortTweetsNewestFirst(mockTweets.filter((tweet) => tweet.authorUsername === username));
  const { items, currentPage, totalPages, setPage } = usePagination(userTweets);

  if (!user) {
    return (
      <section className="container py-4">
        <div className="alert alert-warning">Usuario no encontrado.</div>
      </section>
    );
  }

  const { followers, following } = getFollowCounts(user.username);

  return (
    <section className="container py-4">
      <div className="row justify-content-center">
     <div className="col-md-8 col-lg-6 x-column p-0">
          <div className="text-center mb-4">
            <h2 className="mb-0">{user.fullName}</h2>
            <p className="text-muted">@{user.username}</p>

            <FollowCounters followers={followers} following={following} />

            {/* "[Seguir]" button only if the user is not followed yet */}
            {!isOwnProfile && !isFollowing && (
              <button type="button" className="btn btn-primary mt-3" onClick={() => setIsFollowing(true)}>
                [Seguir]
              </button>
            )}
          </div>

          {items.map((tweet) => (
            <TweetCard key={tweet.id} tweet={tweet} />
          ))}

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </section>
  );
};