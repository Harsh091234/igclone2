import ExploreItem from "../components/ExploreItem";
import { useGetAllPostsQuery } from "../services/postApi";
import Masonry from "react-masonry-css";
const ExplorePage = () => {
  const { isLoading: isPostsLoading, data: postData } =
    useGetAllPostsQuery(undefined);
  console.log("data", postData);

  const posts = postData?.posts;
  const breakpoints = {
    default: 4,
    1100: 3,
    768: 2,
  };

  return (
    <div className="h-screen overflow-y-auto px-5 pt-7">
      <Masonry
        breakpointCols={breakpoints}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {isPostsLoading ? (
          <>LOading.....</>
        ) : (
          posts?.flatMap(
            (post: any) =>
              post.media?.map((item: any, i: number) => (
                <ExploreItem key={`${post._id}-${i}`} item={item} />
              )) || [],
          )
        )}
      </Masonry>
    </div>
  );
};

export default ExplorePage;
