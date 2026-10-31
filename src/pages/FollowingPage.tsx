import { followingUsers } from "../data/mockData";
import { sortByFullName } from "../utils/sorting";
import { usePagination } from "../hooks/usePagination";
import { UserListItem } from "../ui/components/UserListItem";
import { Pagination } from "../ui/components/Pagination";


const sortedFollowing = sortByFullName(followingUsers);

export const FollowingPage = () => {
  const { items, currentPage, totalPages, setPage } = usePagination(sortedFollowing);

  return (
    <section className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="h4 mb-3">Seguidos</h2>

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