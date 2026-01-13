import type { BudgetData, ArchitectureDiagramData, InfrastructureNode, InfrastructureEdge, IsolatedService } from '../types';

export const getMockBudgetData = (): BudgetData => {
  const services = [
    { service: 'EC2 Instances', cost: 2450.32, percentage: 35.2, trend: 'up' as const, color: '#9333ea' },
    { service: 'Lambda Functions', cost: 1823.45, percentage: 26.1, trend: 'stable' as const, color: '#0ea5e9' },
    { service: 'RDS Database', cost: 1234.67, percentage: 17.7, trend: 'down' as const, color: '#ec4899' },
    { service: 'S3 Storage', cost: 789.12, percentage: 11.3, trend: 'up' as const, color: '#f97316' },
    { service: 'CloudFront CDN', cost: 456.78, percentage: 6.6, trend: 'stable' as const, color: '#8b5cf6' },
    { service: 'API Gateway', cost: 215.89, percentage: 3.1, trend: 'up' as const, color: '#06b6d4' },
  ];

  const totalCost = services.reduce((sum, s) => sum + s.cost, 0);

  const timeSeriesData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      cost: totalCost * 0.8 + Math.random() * totalCost * 0.4,
    };
  });

  return {
    totalCost,
    budget: 10000,
    costBreakdown: services,
    timeSeriesData,
    lastUpdated: new Date().toISOString(),
  };
};

export const getMockArchitectureData = (): ArchitectureDiagramData => {
  const nodes: InfrastructureNode[] = [
    // Top row - Entry points
    {
      id: 'cf-1',
      type: 'cloudfront',
      data: {
        label: 'CloudFront CDN',
        description: 'Global edge locations',
        status: 'healthy',
        metrics: { requests: 125000, latency: 45 },
      },
      position: { x: 400, y: 0 },
    },
    // Second row - Gateway
    {
      id: 'apigw-1',
      type: 'api-gateway',
      data: {
        label: 'API Gateway',
        description: 'REST API endpoint',
        status: 'healthy',
        metrics: { requests: 98000, latency: 120 },
      },
      position: { x: 400, y: 180 },
    },
    // Third row - Processing
    {
      id: 'lambda-1',
      type: 'lambda',
      data: {
        label: 'Inference Handler',
        description: 'Main processing function',
        status: 'healthy',
        metrics: { requests: 98000, latency: 850 },
      },
      position: { x: 400, y: 360 },
    },
    // Fourth row - Support services
    {
      id: 's3-1',
      type: 's3',
      data: {
        label: 'Model Storage',
        description: 'ML model artifacts',
        status: 'healthy',
      },
      position: { x: 100, y: 540 },
    },
    {
      id: 'ec2-1',
      type: 'ec2',
      data: {
        label: 'GPU Server',
        description: 'Model inference compute',
        status: 'healthy',
        metrics: { uptime: 99.9 },
      },
      position: { x: 400, y: 540 },
    },
    {
      id: 'dynamodb-1',
      type: 'dynamodb',
      data: {
        label: 'Response Cache',
        description: 'Fast result lookup',
        status: 'healthy',
        metrics: { requests: 125000, latency: 12 },
      },
      position: { x: 700, y: 540 },
    },
  ];

  const edges: InfrastructureEdge[] = [
    // Main request flow - all animated
    { id: 'e1', source: 'cf-1', target: 'apigw-1', animated: true, label: 'HTTPS Request' },
    { id: 'e2', source: 'apigw-1', target: 'lambda-1', animated: true, label: 'Invoke' },
    { id: 'e3', source: 'lambda-1', target: 'ec2-1', animated: true, label: 'Run Model' },

    // Support connections
    { id: 'e4', source: 's3-1', target: 'lambda-1', label: 'Load Model', animated: false },
    { id: 'e5', source: 'lambda-1', target: 'dynamodb-1', label: 'Check Cache', animated: false },
    { id: 'e6', source: 'dynamodb-1', target: 'lambda-1', label: 'Cache Hit', animated: false },
  ];

  const isolatedServices: IsolatedService[] = [
    {
      id: 'rds-1',
      type: 'rds',
      label: 'Analytics DB',
      description: 'Usage metrics & reporting',
      status: 'healthy',
      metrics: { latency: 25, uptime: 99.95 },
    },
    {
      id: 's3-2',
      type: 's3',
      label: 'Logs Archive',
      description: 'Long-term log storage',
      status: 'healthy',
    },
    {
      id: 'sqs-1',
      type: 'sqs',
      label: 'Dead Letter Queue',
      description: 'Failed request handling',
      status: 'warning',
      metrics: { requests: 23 },
    },
    {
      id: 'sns-1',
      type: 'sns',
      label: 'Alert Topic',
      description: 'System notifications',
      status: 'healthy',
    },
    {
      id: 'lambda-monitoring',
      type: 'lambda',
      label: 'Health Check',
      description: 'Periodic system validation',
      status: 'healthy',
      metrics: { requests: 144, latency: 450 },
    },
  ];

  return { nodes, edges, isolatedServices };
};
