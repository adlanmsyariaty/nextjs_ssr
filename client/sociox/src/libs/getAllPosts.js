export default async function getAllPosts() {
  const res = await fetch(`http://localhost:3000/posts`, {
    cache: "no-store"
  });
  return await res.json();
}
