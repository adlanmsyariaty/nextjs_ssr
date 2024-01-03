import getAllPosts from "@/libs/getAllPosts";
import moment from "moment";
import Modal from "./Modal";

export default async function PostList() {
  const posts = await getAllPosts();

  return (
    <>
      {posts.data.items.length > 0 &&
        posts.data.items.map((post) => (
          <div
            className="flex flex-col w-full bg-white border-x-8 border-y-4 border-emerald-100 p-4 rounded-xl"
            key={post.id}
          >
            <div className="flex justify-between mb-2">
              <div className="flex">
                <p className="font-bold flex mr-2">{post.username}</p>
                <p className="flex mr-2 text-gray-300">|</p>
                <div className="flex justify-center items-center">
                  <p className="flex mr-4 text-gray-400 text-sm text-center">
                    {moment().diff(moment(post.createdAt), "hours") > 24
                      ? moment().diff(moment(post.createdAt), "days") + "d"
                      : moment().diff(moment(post.createdAt), "hours") == 0
                      ? moment().diff(moment(post.createdAt), "minutes") + "m"
                      : moment().diff(moment(post.createdAt), "hours") + "h"}
                  </p>
                </div>
              </div>

              <Modal post={post} />
            </div>

            <p className="mb-2">{post.message}</p>
            <div className="flex justify-center">
              <img src={post.imageUrl} width="750" />
            </div>
          </div>
        ))}
    </>
  );
}
