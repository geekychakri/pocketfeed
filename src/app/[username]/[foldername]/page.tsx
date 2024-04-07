export default function Folder({ params }: { params: { foldername: string } }) {
  return (
    <div className="w-full max-w-[720px] mx-auto py-20">
      {params.foldername}
    </div>
  );
}
