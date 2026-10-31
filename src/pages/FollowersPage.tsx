import { useState } from "react";
import { followerUsers, followingUsers } from "../data/mockData";
import { sortByFullName } from "../utils/sorting";
import { usePagination } from "../hooks/usePagination";
import { UserListItem } from "../ui/components/UserListItem";
import { Pagination } from "../ui/components/Pagination";


const sortedFollowers = sortByFullName(followerUsers);

export const FollowersPage = () => {

  const [followedUsernames, setFollowedUsernames] = useState<string[]>(followingUsers.map((user) => user.username));
  const { items, currentPage, totalPages, setPage } = usePagination(sortedFollowers);

  const onFollow = (username: string) => {
    setFollowedUsernames((previous) => [...previous, username]);
  };

  return (
    <section className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="h4 mb-3">Seguidores</h2>

          <ul className="list-group">
            {items.map((user) => (
              <UserListItem
                key={user.uid}
                user={user}
                showFollowButton={!followedUsernames.includes(user.username)}
                onFollow={onFollow}
              />
            ))}
          </ul>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </section>
  );
};