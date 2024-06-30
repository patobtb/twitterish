import { useQuery } from "@tanstack/react-query";

import Post from "./Post";
import PostSkeleton from "../skeleton/PostSkeleton";
import { useEffect } from "react";
// import { POSTS } from "../../utils/db/dummy";

const Posts = ({feedType, userName, userId}) => {
  const getPostEndpoint = () => {
    switch (feedType){
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      case "posts":
        return `/api/posts/user/${userName}`;
      case "likes":
        return `/api/posts/likes/${userId}`;
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {data: posts, isLoading, isRefetching, refetch} = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const response = await fetch(POST_ENDPOINT);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Could not fetch posts");
        }

        return data;
      } catch (error) {
        console.log(error.message);
        throw new Error(error);
      }
    }
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch, userName]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
