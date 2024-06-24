export default function Folder({ params }: { params: { foldername: string } }) {
  return (
    <div className="p-4">
      <h1 className="mb-4">{params.foldername}</h1>

      <div className="flex flex-col gap-5">
        {[1, 2, 3, 4, 5].map((item, i) => (
          <div key={i} className="w-full h-20 bg-[#eee] rounded-md"></div>
        ))}
      </div>
    </div>
  );
}
