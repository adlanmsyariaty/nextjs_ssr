import { useRouter } from "next/navigation";

export default function DeletePost({ postId }) {
  const router = useRouter();

  async function deletePost() {
    await fetch(`http://localhost:3000/posts/${postId}/delete`, {
      method: "DELETE",
    });
    router.refresh();
  }

  return (
    <>
      <li>
        <a className="text-red-800 font-bold" onClick={deletePost}>
          Delete
        </a>
      </li>
    </>
  );
}
