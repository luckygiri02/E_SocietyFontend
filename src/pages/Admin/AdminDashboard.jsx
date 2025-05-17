import { useEffect, useState } from 'react';


import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import './AdminDashboard.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const AdminDashboard = () => {
  const [paymentChartData, setPaymentChartData] = useState([]);
  const [wingChartData, setWingChartData] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [complaintStats, setComplaintStats] = useState({
    total: 0,
    solved: 0,
    inprogress: 0,
  });
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/payments`);
        const json = await res.json();

        if (json.success) {
          const grouped = json.data.reduce((acc, curr) => {
            const name = curr.customer_name || 'Unknown';
            const amount = parseFloat(curr.amount || 0);
            if (!acc[name]) acc[name] = 0;
            acc[name] += amount;
            return acc;
          }, {});

          const formatted = Object.entries(grouped).map(([name, value]) => ({
            name,
            value
          }));

          setPaymentChartData(formatted);

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const total = json.data.reduce((sum, item) => {
            const date = new Date(item.created_at);
            if (
              date.getMonth() === currentMonth &&
              date.getFullYear() === currentYear &&
              item.status === 'success'
            ) {
              return sum + parseFloat(item.amount);
            }
            return sum;
          }, 0);

          setMonthlyTotal(total);
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/items`);
        const json = await res.json();

        if (Array.isArray(json)) {
          setTotalUsers(json.length);

          const wingCounts = json.reduce((acc, user) => {
            const wing = user.wingNumber?.trim() || 'Unknown';
            const name = user.fullName || user.name || 'Unnamed';
            if (!acc[wing]) acc[wing] = new Set();
            acc[wing].add(name);
            return acc;
          }, {});

          const formatted = Object.entries(wingCounts).map(([wing, users]) => ({
            wing,
            users: users.size
          }));

          setWingChartData(formatted);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BaseURL_API}/api/complaints`);
        const json = await res.json();

        if (Array.isArray(json)) {
          const total = json.length;
          const solved = json.filter(c => c.status === 'solved').length;
          const inprogress = json.filter(c => c.status === 'inprogress').length;

          setComplaintStats({ total, solved, inprogress });
        }
      } catch (err) {
        console.error('Error fetching complaints:', err);
      }
    };

    fetchComplaints();
  }, []);

  // Calculate dynamic Y-axis ticks
  const maxUsers = Math.max(...wingChartData.map(d => d.users), 0);
  const roundedMax = Math.ceil(maxUsers / 5) * 5;
  const yTicks = [];
  for (let i = 0; i <= roundedMax; i += 5) {
    yTicks.push(i);
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome to the Admin Dashboard</h2>

      <div className="stats-container">
        <div className="stat-box blue">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
        <div className="stat-box orange">
          <h3>Complaints</h3>
          <p>Total: {complaintStats.total}</p>
          <p>Solved: {complaintStats.solved}</p>
          <p>In Progress: {complaintStats.inprogress}</p>
        </div>
        <div className="stat-box green">
          <h3>Monthly Payments</h3>
          <p>₹ {monthlyTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="chart-section">
        <div className="chart-box">
          <h3>Payments Distribution by Customer</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {paymentChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>User Count per Wing</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wingChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="wing" interval={0} />
              <YAxis domain={[0, roundedMax]} ticks={yTicks} />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#00C49F" name="Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
