import { motion } from 'framer-motion';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Minus, DollarSign, AlertCircle } from 'lucide-react';
import type { BudgetData } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface CostBreakdownProps {
  data: BudgetData;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ data }) => {
  const { currentColors } = useTheme();
  const budgetUsagePercentage = (data.totalCost / data.budget) * 100;
  const isOverBudget = budgetUsagePercentage > 100;

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'stable':
        return <Minus className="w-4 h-4" style={{ color: currentColors.secondary }} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05, ease: 'easeOut' }}
          className="rounded-2xl p-6 transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            transform: 'translateZ(0)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: currentColors.textSecondary }}>Total Spend</span>
            <DollarSign className="w-5 h-5" style={{ color: currentColors.primary }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: currentColors.text }}>
            ${data.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs mt-1" style={{ color: currentColors.textSecondary }}>This month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08, ease: 'easeOut' }}
          className="rounded-2xl p-6 transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: currentColors.card,
            border: `1px solid ${isOverBudget ? '#ef4444' : currentColors.border}`,
            transform: 'translateZ(0)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: currentColors.textSecondary }}>Budget Usage</span>
            {isOverBudget && <AlertCircle className="w-5 h-5 text-red-500" />}
          </div>
          <div className={`text-3xl font-bold ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
            {budgetUsagePercentage.toFixed(1)}%
          </div>
          <div className="text-xs mt-1" style={{ color: currentColors.textSecondary }}>
            ${data.budget.toLocaleString()} budget
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.11, ease: 'easeOut' }}
          className="rounded-2xl p-6 transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            transform: 'translateZ(0)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: currentColors.textSecondary }}>Remaining</span>
            <DollarSign className="w-5 h-5" style={{ color: currentColors.secondary }} />
          </div>
          <div className={`text-3xl font-bold`} style={{ color: isOverBudget ? '#ef4444' : currentColors.secondary }}>
            ${Math.abs(data.budget - data.totalCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs mt-1" style={{ color: currentColors.textSecondary }}>
            {isOverBudget ? 'Over budget' : 'Available'}
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.14, ease: 'easeOut' }}
          className="rounded-2xl p-6"
          style={{
            backgroundColor: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            transform: 'translateZ(0)'
          }}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{
              backgroundImage: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.secondary})`
            }}>
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
                labelLine={{ stroke: currentColors.border, strokeWidth: 1 }}
              >
                {data.costBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: currentColors.card,
                  border: `1px solid ${currentColors.border}`,
                  borderRadius: '8px',
                  color: currentColors.text,
                }}
                labelStyle={{ color: currentColors.text }}
                itemStyle={{ color: currentColors.text }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.17, ease: 'easeOut' }}
          className="rounded-2xl p-6"
          style={{
            backgroundColor: currentColors.card,
            border: `1px solid ${currentColors.border}`,
            transform: 'translateZ(0)'
          }}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{
              backgroundImage: `linear-gradient(to right, ${currentColors.accent}, ${currentColors.tertiary})`
            }}>
              30-Day Trend
            </span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.timeSeriesData}>
              <defs>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentColors.primary} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={currentColors.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                stroke={currentColors.border}
                tick={{ fill: currentColors.textSecondary }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getMonth() + 1}/${date.getDate()}`;
                }}
              />
              <YAxis
                stroke={currentColors.border}
                tick={{ fill: currentColors.textSecondary }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: currentColors.card,
                  border: `1px solid ${currentColors.border}`,
                  borderRadius: '8px',
                  color: currentColors.text,
                }}
                labelStyle={{ color: currentColors.text }}
                itemStyle={{ color: currentColors.text }}
                formatter={(value: number | undefined) => [`$${value?.toFixed(2) ?? '0'}`, 'Cost']}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="cost"
                stroke={currentColors.primary}
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2, ease: 'easeOut' }}
        className="rounded-2xl p-6"
        style={{
          backgroundColor: currentColors.card,
          border: `1px solid ${currentColors.border}`,
          transform: 'translateZ(0)'
        }}
      >
        <h3 className="text-xl font-semibold mb-4" style={{ color: currentColors.text }}>Service Breakdown</h3>
        <div className="space-y-3">
          {data.costBreakdown.map((item, index) => (
            <motion.div
              key={item.service}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15, delay: 0.23 + index * 0.03, ease: 'easeOut' }}
              className="flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: `${currentColors.primary}08`,
                border: `1px solid ${currentColors.border}`,
                transform: 'translateZ(0)'
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="font-medium" style={{ color: currentColors.text }}>{item.service}</div>
                  <div className="text-sm" style={{ color: currentColors.textSecondary }}>{item.percentage}% of total</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getTrendIcon(item.trend)}
                <div className="text-right">
                  <div className="font-semibold text-lg" style={{ color: currentColors.text }}>
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
