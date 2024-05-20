export default function Folder({ params }: { params: { foldername: string } }) {
  return <div>{params.foldername}</div>;
}
