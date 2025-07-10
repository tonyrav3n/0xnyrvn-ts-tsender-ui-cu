import AirdropForm from "@/components/AirdropForm";

export default function Home() {
  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome to TSender</h1>
        <p className="text-gray-600 mt-2">Web3 token transfer application</p>
      </div>
      <div>
        <AirdropForm />
      </div>
    </div>
  );
}
