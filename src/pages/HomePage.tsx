import { useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useAsyncData } from "../hooks/useAsyncData";
import { usePagination } from "../hooks/usePagination";
import { getFeedTweets, getLatestTweets } from "../services/tweetService";
import { getFollowing } from "../services/followService";
import { TweetComposer } from "../ui/components/TweetComposer";
import { TweetCard } from "../ui/components/TweetCard";
import { Pagination } from "../ui/components/Pagination";
import { LoadingState } from "../ui/components/LoadingState";

type Tab = "forYou" | "following";

export const HomePage = () => {
  const me = useCurrentUser();
  const [tab, setTab] = useState<Tab>("forYou");

  // "Para ti": latest tweets of everybody.
  // "Siguiendo": only the tweets published by the people I follow.
  const { data, loading, error, reload } = useAsyncData(async () => {
    if (tab === "forYou") return { tweets: await getLatestTweets(), followingCount: 0 };

    const following = await getFollowing(me.uid);
    const tweets = await getFeedTweets(following.map((user) => user.uid));
    return { tweets, followingCount: following.length };
  }, [tab, me.uid]);

  const { items, currentPage, totalPages, setPage } = usePagination(data?.tweets ?? []);

  const changeTab = (newTab: Tab) => {
    setTab(newTab);
    setPage(1);
  };

  // After publishing, go to "Para ti" so the new tweet is visible right away
  const onPublished = () => {
    if (tab === "following") changeTab("forYou");
    else reload();
  };

  const emptyMessage =
    tab === "forYou"
      ? "Todavía no hay tweets. ¡Publica el primero!"
      : data?.followingCount === 0
        ? "Aún no sigues a nadie. Usa «A quién seguir» o «Seguir por usuario» para empezar."
        : "Las personas que sigues todavía no han publicado nada.";

  return (
    <>
      <div className="x-tabs x-tabs-sticky">
        <button type="button" className={`x-tab ${tab === "forYou" ? "active" : ""}`} onClick={() => changeTab("forYou")}>
          Para ti
        </button>
        <button type="button" className={`x-tab ${tab === "following" ? "active" : ""}`} onClick={() => changeTab("following")}>
          Siguiendo
        </button>
      </div>

      <TweetComposer onPublished={onPublished} />

      <LoadingState loading={loading} error={error} />

      {!loading && !error && items.length === 0 && <p className="text-secondary text-center py-5 px-3">{emptyMessage}</p>}

      {items.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
};