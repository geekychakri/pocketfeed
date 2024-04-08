export default function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  <div>{params.username}</div>;
}
