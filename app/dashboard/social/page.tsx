export default function SocialPage() {
  const platforms = [
    { name: "TikTok", views: "2.4M", engagement: "8.2%", roi: "4.1x" },
    { name: "Instagram", views: "1.1M", engagement: "6.4%", roi: "3.2x" },
    { name: "YouTube Shorts", views: "3.2M", engagement: "7.9%", roi: "5.0x" },
    { name: "Meta Ads", views: "900K", engagement: "4.2%", roi: "2.8x" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">📊 Social Performance</h1>

      <div className="bg-[#1A1A2E] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-purple-700">
            <tr>
              <th className="p-4">Platform</th>
              <th className="p-4">Views</th>
              <th className="p-4">Engagement</th>
              <th className="p-4">ROI</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((p, index) => (
              <tr key={index} className="border-b border-gray-800">
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.views}</td>
                <td className="p-4">{p.engagement}</td>
                <td className="p-4 text-purple-400 font-bold">{p.roi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


