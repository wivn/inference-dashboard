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
        return <TrendingUp className="w-4 h-4" style={{ color: currentColors.error }} />;
      case 'down':
        return <TrendingDown className="w-4 h-4" style={{ color: currentColors.success }} />;
      case 'stable':
        return <Minus className="w-4 h-4" style={{ color: currentColors.textSecondary }} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.02, ease: [0.25, 1, 0.5, 1] }}
          className="rounded-md p-4 border"
          style={{
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium" style={{ color: currentColors.textSecondary }}>Total Spend</span>
            <div className="p-1 rounded border" style={{ borderColor: currentColors.border }}>
              <DollarSign className="w-3.5 h-3.5" style={{ color: currentColors.primary }} />
            </div>
          </div>
          <div className="text-2xl font-semibold font-mono tabular-nums" style={{ color: currentColors.text }}>
            ${data.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs mt-2" style={{ color: currentColors.textSecondary }}>This month</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.04, ease: [0.25, 1, 0.5, 1] }}
          className="rounded-md p-4 border"
          style={{
            backgroundColor: currentColors.card,
            borderColor: isOverBudget ? currentColors.error : currentColors.border,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium" style={{ color: currentColors.textSecondary }}>Budget Usage</span>
            {isOverBudget && <AlertCircle className="w-4 h-4" style={{ color: currentColors.error }} />}
          </div>
          <div className="text-2xl font-semibold font-mono tabular-nums" style={{ color: isOverBudget ? currentColors.error : currentColors.success }}>
            {budgetUsagePercentage.toFixed(1)}%
          </div>
          <div className="text-xs mt-2 font-mono tabular-nums" style={{ color: currentColors.textSecondary }}>
            ${data.budget.toLocaleString()} budget
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.06, ease: [0.25, 1, 0.5, 1] }}
          className="rounded-md p-4 border"
          style={{
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium" style={{ color: currentColors.textSecondary }}>Remaining</span>
            <div className="p-1 rounded border" style={{ borderColor: currentColors.border }}>
              <DollarSign className="w-3.5 h-3.5" style={{ color: currentColors.textSecondary }} />
            </div>
          </div>
          <div className="text-2xl font-semibold font-mono tabular-nums" style={{ color: isOverBudget ? currentColors.error : currentColors.text }}>
            ${Math.abs(data.budget - data.totalCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs mt-2" style={{ color: currentColors.textSecondary }}>
            {isOverBudget ? 'Over budget' : 'Available'}
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15, delay: 0.08, ease: [0.25, 1, 0.5, 1] }}
          className="rounded-md p-4 border"
          style={{
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: currentColors.text }}>
            Cost Distribution
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
                label={(props: any) => {
                  // Hide labels on small screens, show only on larger screens
                  if (window.innerWidth < 640) return null;
                  return `${props.service}: ${props.percentage}%`;
                }}
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
                  fontSize: '12px',
                }}
                labelStyle={{ color: currentColors.text }}
                itemStyle={{ color: currentColors.text }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.15, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          className="rounded-md p-4 border"
          style={{
            backgroundColor: currentColors.card,
            borderColor: currentColors.border,
          }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: currentColors.text }}>
            30-Day Trend
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
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, delay: 0.12, ease: [0.25, 1, 0.5, 1] }}
        className="rounded-md p-4 border"
        style={{
          backgroundColor: currentColors.card,
          borderColor: currentColors.border,
        }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: currentColors.text }}>Service Breakdown</h3>
        <div className="space-y-2">
          {data.costBreakdown.map((item, index) => (
            <motion.div
              key={item.service}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1, delay: 0.14 + index * 0.02, ease: [0.25, 1, 0.5, 1] }}
              className="flex items-center justify-between p-3 rounded border"
              style={{
                backgroundColor: currentColors.bg,
                borderColor: currentColors.border,
              }}
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm" style={{ color: currentColors.text }}>{item.service}</div>
                  <div className="text-xs font-mono tabular-nums" style={{ color: currentColors.textSecondary }}>{item.percentage}% of total</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getTrendIcon(item.trend)}
                <div className="text-right">
                  <div className="font-semibold text-sm font-mono tabular-nums" style={{ color: currentColors.text }}>
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
