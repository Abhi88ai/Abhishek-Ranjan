
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { CivicIssue, IssueStatus, IssuePriority } from '../types';

interface PublicDashboardProps {
  issues: CivicIssue[];
}

const PublicDashboard: React.FC<PublicDashboardProps> = ({ issues }) => {
  const stats = {
    total: issues.length,
    resolved: issues.filter(i => i.status === IssueStatus.RESOLVED).length,
    pending: issues.filter(i => i.status !== IssueStatus.RESOLVED).length,
    critical: issues.filter(i => i.priority === IssuePriority.CRITICAL || i.priority === IssuePriority.HIGH).length,
  };

  const statusData = [
    { name: 'Reported', value: issues.filter(i => i.status === IssueStatus.REPORTED).length },
    { name: 'In Progress', value: issues.filter(i => i.status === IssueStatus.IN_PROGRESS).length },
    { name: 'Resolved', value: issues.filter(i => i.status === IssueStatus.RESOLVED).length },
  ].filter(d => d.value > 0);

  const categoryData = Object.entries(
    issues.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: value as number }))
   // Fixed: Explicitly cast values to number to satisfy TypeScript's arithmetic operation requirements
   .sort((a, b) => (b.value as number) - (a.value as number));

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.REPORTED: return 'bg-blue-100 text-blue-700';
      case IssueStatus.VERIFIED: return 'bg-purple-100 text-purple-700';
      case IssueStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-700';
      case IssueStatus.RESOLVED: return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case IssuePriority.CRITICAL: return 'text-red-600';
      case IssuePriority.HIGH: return 'text-orange-600';
      case IssuePriority.MEDIUM: return 'text-amber-600';
      case IssuePriority.LOW: return 'text-green-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reports', value: stats.total, icon: 'fa-file-lines', color: 'bg-indigo-500' },
          { label: 'Resolved', value: stats.resolved, icon: 'fa-check-double', color: 'bg-emerald-500' },
          { label: 'In Progress', value: stats.pending, icon: 'fa-clock', color: 'bg-amber-500' },
          { label: 'Urgent Action', value: stats.critical, icon: 'fa-bolt', color: 'bg-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <i className={`fa-solid ${stat.icon} text-xl`}></i>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Issue Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Resolution Status</h3>
          <div className="h-64 flex flex-col sm:flex-row items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Recent Reports</h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">LIVE FEED</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Issue Type</th>
                <th className="px-6 py-4">Summary</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.length > 0 ? issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{issue.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{issue.summary}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{issue.department}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(issue.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">No issues reported yet. Be the first!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PublicDashboard;
