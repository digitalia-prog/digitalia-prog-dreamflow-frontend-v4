export default function OverviewPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        🌍 International UGC Agency Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-[#1A1A2E] p-6 rounded-xl">
          <p className="text-gray-400">Active Clients</p>
          <h2 className="text-3xl font-bold">24</h2>
        </div>

        <div className="bg-[#1A1A2E] p-6 rounded-xl">
          <p className="text-gray-400">Monthly Revenue</p>
          <h2 className="text-3xl font-bold">$42,000</h2>
        </div>

        <div className="bg-[#1A1A2E] p-6 rounded-xl">
          <p className="text-gray-400">Active Campaigns</p>
          <h2 className="text-3xl font-bold">12</h2>
        </div>

        <div className="bg-[#1A1A2E] p-6 rounded-xl">
          <p className="text-gray-400">Average ROI</p>
          <h2 className="text-3xl font-bold">3.8x</h2>
        </div>
      </div>
    </div>
  );
}

