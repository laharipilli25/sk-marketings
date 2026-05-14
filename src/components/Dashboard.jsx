import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaUsers,
  FaClipboardList,
  FaEnvelope,
  FaCheckCircle,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaMoneyBillWave,
} from "react-icons/fa";
import { motion } from "framer-motion";

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];

const StatCard = ({ icon, label, value, subtext, color, trend, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    onClick={onClick}
    className={`bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 group hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer`}
  >
    <div className="flex justify-between items-start">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
          {trend > 0 ? <FaArrowUp /> : <FaArrowDown />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">{label}</div>
      {subtext && <div className="text-xs text-gray-400 mt-2">{subtext}</div>}
    </div>
  </motion.div>
);

export default function Dashboard({ role, leads = [], agents = [], inquiries = [], stats = {}, onTabChange }) {
  const isAdmin = role === "ADMIN";

  // Data processing for Charts (Robust & Dynamic)
  const leadGrowthData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = [];
    const now = new Date();
    
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = months[d.getMonth()];
      const year = d.getFullYear();
      
      const monthLeads = leads.filter(l => {
        const leadDate = new Date(l.created_at || l.createdAt);
        if (isNaN(leadDate.getTime())) return false;
        return leadDate.getMonth() === d.getMonth() && leadDate.getFullYear() === year;
      });
      
      const revenue = monthLeads.reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0);
      
      result.push({
        name: monthLabel,
        leads: monthLeads.length,
        revenue: revenue,
      });
    }
    return result;
  }, [leads]);

  const leadStatusData = useMemo(() => {
    const statusCounts = leads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const agentPerformanceData = useMemo(() => {
    if (!isAdmin) return [];
    
    return agents.slice(0, 5).map(agent => {
      const agentLeads = leads.filter(l => String(l.agent_id) === String(agent.id));
      const wonLeads = agentLeads.filter(l => l.status === "WON").length;
      const agentRevenue = agentLeads.reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0);
      return {
        name: agent.full_name?.split(' ')[0] || "Agent",
        leads: agentLeads.length,
        won: wonLeads,
        revenue: agentRevenue
      };
    }).sort((a, b) => b.leads - a.leads);
  }, [agents, leads, isAdmin]);

  const customTooltipFormatter = (value, name) => {
    if (name === "revenue" || name === "Revenue") return [`₹${value.toLocaleString()}`, "Revenue"];
    if (name === "leads" || name === "Leads") return [value, "Total Leads"];
    if (name === "won" || name === "Won") return [value, "Won Leads"];
    return [value, name];
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <StatCard 
              icon={<FaClipboardList size={24} />} 
              label="Total Leads" 
              value={leads.length} 
              color="bg-blue-600" 
              trend={12}
              subtext="Overall system leads"
              onClick={() => onTabChange && onTabChange("leads")}
            />
            <StatCard 
              icon={<FaUsers size={24} />} 
              label="Active Agents" 
              value={agents.filter(a => a.status === "ACTIVE").length} 
              color="bg-orange-600" 
              subtext={`${agents.length} total registered`}
              onClick={() => onTabChange && onTabChange("agents")}
            />
            <StatCard 
              icon={<FaEnvelope size={24} />} 
              label="New Inquiries" 
              value={inquiries.filter(i => i.status === "NEW").length} 
              color="bg-purple-600" 
              subtext="Needs attention"
              onClick={() => onTabChange && onTabChange("inquiries")}
            />
            <StatCard 
              icon={<FaMoneyBillWave size={24} />} 
              label="Total Revenue" 
              value={`₹${leads.reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0).toLocaleString()}`} 
              color="bg-green-600" 
              trend={8}
              subtext="Collected this year"
            />
          </>
        ) : (
          <>
            <StatCard 
              icon={<FaClipboardList size={24} />} 
              label="My Leads" 
              value={leads.length} 
              color="bg-orange-600" 
              subtext="Assigned to me"
              onClick={() => onTabChange && onTabChange("leads")}
            />
            <StatCard 
              icon={<FaCheckCircle size={24} />} 
              label="Leads Won" 
              value={leads.filter(l => l.status === "WON").length} 
              color="bg-green-600" 
              trend={leads.length > 0 ? Math.round((leads.filter(l => l.status === "WON").length / leads.length) * 100) : 0}
              subtext="Closing rate (%)"
            />
            <StatCard 
              icon={<FaClock size={24} />} 
              label="In Progress" 
              value={leads.filter(l => ["NEW", "CONTACTED", "FOLLOW_UP"].includes(l.status)).length} 
              color="bg-blue-600" 
              subtext="Requires follow-up"
              onClick={() => onTabChange && onTabChange("leads")}
            />
            <StatCard 
              icon={<FaMoneyBillWave size={24} />} 
              label="My Earnings" 
              value={`₹${leads.reduce((sum, l) => sum + (parseFloat(l.paid_amount) || 0), 0).toLocaleString()}`} 
              color="bg-purple-600" 
              subtext="Total paid amount"
            />
          </>
        )}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-w-0"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-black text-gray-900">Performance Trends</h3>
              <p className="text-sm text-gray-500 font-medium">Monthly leads vs actual revenue</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs font-bold text-gray-600">Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadGrowthData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(val) => `₹${val >= 1000 ? (val/1000) + 'k' : val}`}
                />
                <Tooltip 
                  formatter={customTooltipFormatter}
                  contentStyle={{ 
                    borderRadius: "1rem", 
                    border: "none", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    padding: "1rem"
                  }} 
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-w-0"
        >
          <h3 className="text-xl font-black text-gray-900 mb-8">Lead Status Distribution</h3>
          <div className="h-[300px] w-full relative text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ 
                    borderRadius: "1rem", 
                    border: "none", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-xs font-bold text-gray-600 uppercase">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Admin Performance Row */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-w-0"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900">Top Performing Agents</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-xs font-bold text-gray-600">Total Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-gray-600">Won Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs font-bold text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  yAxisId="left"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(val) => `₹${val >= 1000 ? (val/1000) + 'k' : val}`}
                />
                <Tooltip 
                  formatter={customTooltipFormatter}
                   contentStyle={{ 
                    borderRadius: "1rem", 
                    border: "none", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
                  }} 
                />
                <Bar yAxisId="left" dataKey="leads" fill="#f97316" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar yAxisId="left" dataKey="won" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar yAxisId="right" dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}
