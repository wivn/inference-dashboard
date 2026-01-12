# AWS Inference Dashboard

A modern, beautiful web dashboard for monitoring AWS infrastructure and costs, specifically focused on inference workloads.

## Features

### 🎨 Modern Design
- **Unique color scheme** with cyber-purple, blue, and pink gradients
- **Glassmorphism effects** with backdrop blur and transparency
- **Smooth animations** using Framer Motion
- **Dark theme** with custom scrollbar and accent colors
- **Responsive layout** that works on all screen sizes

### 💰 Cost Analytics
- Real-time AWS cost breakdown by service
- Interactive pie chart showing cost distribution
- 30-day cost trend visualization with area chart
- Budget tracking with usage percentage
- Service-by-service breakdown with trend indicators (up/down/stable)

### 🏗️ Architecture Visualization
- Interactive infrastructure diagram using React Flow
- Visual representation of all AWS services tagged with "inference"
- Real-time metrics display (requests, latency, uptime)
- Status indicators (healthy/warning/error) with color-coding
- Animated connections showing data flow
- Draggable and zoomable canvas

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Beautiful charts for cost analytics
- **React Flow** - Interactive node-based diagrams
- **Lucide React** - Modern icon library

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the dashboard.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── CostBreakdown.tsx       # Cost analytics component
│   └── ArchitectureDiagram.tsx # Infrastructure diagram
├── data/               # Mock data generators
│   └── mockData.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component
├── index.css           # Global styles with Tailwind
└── main.tsx            # App entry point
```

## Features in Detail

### Cost Breakdown Component
- **Total Spend Card**: Shows current month's total AWS costs
- **Budget Usage Card**: Displays percentage of budget used with alerts
- **Remaining Budget Card**: Shows available budget or overage
- **Pie Chart**: Visual distribution of costs across services
- **Trend Chart**: 30-day historical cost data
- **Service List**: Detailed breakdown with costs and trends

### Architecture Diagram Component
- **Custom Nodes**: Each AWS service has a unique styled node
- **Service Icons**: Visual icons for EC2, Lambda, S3, RDS, etc.
- **Live Metrics**: Shows requests, latency, and uptime per service
- **Status Indicators**: Color-coded health status (green/yellow/red)
- **Animated Edges**: Flowing animations on active connections
- **Interactive Controls**: Pan, zoom, and drag functionality

## Customization

### Changing the Color Scheme

Edit `tailwind.config.js`:

```javascript
colors: {
  'cyber-purple': '#9333ea',
  'cyber-blue': '#0ea5e9',
  'cyber-pink': '#ec4899',
  'cyber-orange': '#f97316',
  'dark-bg': '#0a0a0f',
  'dark-card': '#1a1a24',
  'dark-border': '#2d2d3d',
}
```

### Adding Real Data

Replace mock data in `src/data/mockData.ts` with API calls to your AWS backend:

```typescript
// Example: Replace mock data with real API call
export const getMockBudgetData = async (): Promise<BudgetData> => {
  const response = await fetch('/api/aws/costs');
  return response.json();
};
```

## Future Enhancements

When ready to integrate with real AWS data:

1. **AWS SDK Integration**: Use `@aws-sdk/client-cost-explorer` for cost data
2. **Resource Tagging**: Use `@aws-sdk/client-resource-groups-tagging-api` for infrastructure discovery
3. **Real-time Updates**: Implement WebSocket connections for live data
4. **Authentication**: Add AWS Cognito or similar auth solution
5. **Alerts & Notifications**: Set up budget alerts and threshold notifications

## Libraries Used

### Visualization
- **Recharts**: For cost breakdown charts (pie charts, area charts)
- **React Flow**: For architecture diagrams and node-based visualizations

### Styling & Animation
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready animation library

### Icons
- **Lucide React**: Modern, customizable icon library

## License

MIT
