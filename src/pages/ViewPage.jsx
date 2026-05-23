import { useParams, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

export default function ViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("data")) || [];
  const item = data[id];

  if (!item) return <div className="text-center mt-20"><h2>No Data Found</h2></div>;

  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-white shadow-2xl rounded-3xl border border-gray-100">
      <SEO 
        title={`View Lead: ${item.name || 'Detail'}`} 
        description={`Detailed record profile for client ${item.name} located in ${item.village || 'Tirupati'}.`} 
      />
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-2">
        ← Back to Dashboard
      </button>
      <h2 className="text-4xl font-black text-gray-900 mb-4">{item.name}</h2>
      <div className="bg-indigo-50 inline-block px-4 py-1 rounded-full text-indigo-700 font-bold mb-8">
        📍 {item.village}
      </div>
      <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Description</h4>
        <p className="text-xl text-gray-700 leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
}