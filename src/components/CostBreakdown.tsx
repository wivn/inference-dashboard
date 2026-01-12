import { motion } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus, DollarSign, AlertCircle } from 'lucide-react';
import type { BudgetData } from '../types';

interface CostBreakdownProps {
  data: BudgetData;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ data }) => {
  const budgetUsagePercentage = (data.totalCost / data.budget) * 100;
  const isOverBudget = budgetUsagePercentage > 100;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-400" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-2xl p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Spend</span>
            <DollarSign className="w-5 h-5 text-cyber-purple" />
          </div>
          <div className="text-3xl font-bold glow-text">
            ${data.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-500 mt-1">This month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`glass-effect rounded-2xl p-6 card-hover ${isOverBudget ? 'border-red-500/30' : ''}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Budget Usage</span>
            {isOverBudget && <AlertCircle className="w-5 h-5 text-red-400" />}
          </div>
          <div className={`text-3xl font-bold ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
            {budgetUsagePercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ${data.budget.toLocaleString()} budget
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-2xl p-6 card-hover"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Remaining</span>
            <DollarSign className="w-5 h-5 text-cyber-blue" />
          </div>
          <div className={`text-3xl font-bold ${isOverBudget ? 'text-red-400' : 'text-cyber-blue'}`}>
            ${Math.abs(data.budget - data.totalCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {isOverBudget ? 'Over budget' : 'Available'}
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r from-cyber-purple to-cyber-blue bg-clip-text text-transparent">
              Cost Distribution
            </span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.costBreakdown as any}
                dataKey="cost"
                nameKey="service"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(props: any) => `${props.service}: ${props.percentage}%`}
                labelLine={{ stroke: '#666', strokeWidth: 1 }}
              >
                {data.costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a24',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r from-cyber-pink to-cyber-orange bg-clip-text text-transparent">
              30-Day Trend
            </span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.timeSeriesData}>
              <defs>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke="#666"
                tick={{ fill: '#999' }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: '#999' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a24',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                formatter={(value: number | undefined) => [`$${value?.toFixed(2) ?? '0'}`, 'Cost']}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="cost"
                stroke="#9333ea"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCost)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Service Breakdown List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-effect rounded-2xl p-6"
      >
        <h3 className="text-xl font-semibold mb-4">Service Breakdown</h3>
        <div className="space-y-3">
          {data.costBreakdown.map((item, index) => (
            <motion.div
              key={item.service}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="flex items-center justify-between p-4 bg-dark-card/50 rounded-xl hover:bg-dark-card/80 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.service}</div>
                  <div className="text-sm text-gray-400">{item.percentage}% of total</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getTrendIcon(item.trend)}
                <div className="text-right">
                  <div className="font-semibold text-lg">
                    ${item.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CostBreakdown;
