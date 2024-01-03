import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function UpdatePost({ post }) {
  const [message, setMessage] = useState();

  const router = useRouter();

  useEffect(() => {
    setMessage(post.message);
  }, [post]);

  function updateMessage(e) {
    setMessage(e.target.value);
  }

  function showModal() {
    document.getElementById("modal_update" + "_" + post.id).showModal();
  }

  async function updatePost() {
    await fetch(`http://localhost:3000/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });
    router.refresh();
  }

  return (
    <>
      <li>
        <a onClick={showModal} className="font-bold">
          Update
        </a>
      </li>
      <dialog id={"modal_update" + "_" + post.id} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg mb-2">{post.username}</h3>
          {post.imageUrl && (
            <>
              <img src={post.imageUrl} />
              <i className="mt-1 text-red-400">(can only edit caption)</i>
            </>
          )}
          <textarea
            className="w-full p-3 bg-emerald-50 rounded-xl outline-none display scroll-m-0 border-emerald-200 border-2 mt-4 h-[100px]"
            placeholder="What is happening?!"
            value={message}
            onChange={updateMessage}
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary mr-2" onClick={updatePost}>
                Update
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
