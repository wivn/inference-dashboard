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
    {
      id: 'cf-1',
      type: 'cloudfront',
      data: {
        label: 'CloudFront Distribution',
        description: 'CDN for inference API',
        status: 'healthy',
        metrics: { requests: 125000, latency: 45 },
      },
      position: { x: 400, y: 50 },
    },
    {
      id: 'apigw-1',
      type: 'api-gateway',
      data: {
        label: 'API Gateway',
        description: 'Inference REST API',
        status: 'healthy',
        metrics: { requests: 98000, latency: 120 },
      },
      position: { x: 400, y: 200 },
    },
    {
      id: 'lambda-1',
      type: 'lambda',
      data: {
        label: 'Inference Handler',
        description: 'Main inference logic',
        status: 'healthy',
        metrics: { requests: 98000, latency: 850 },
      },
      position: { x: 200, y: 350 },
    },
    {
      id: 'lambda-2',
      type: 'lambda',
      data: {
        label: 'Model Preprocessor',
        description: 'Data preprocessing',
        status: 'healthy',
        metrics: { requests: 45000, latency: 320 },
      },
      position: { x: 600, y: 350 },
    },
    {
      id: 'ec2-1',
      type: 'ec2',
      data: {
        label: 'Model Server',
        description: 'EC2 GPU Instance',
        status: 'healthy',
        metrics: { uptime: 99.9 },
      },
      position: { x: 200, y: 500 },
    },
    {
      id: 's3-1',
      type: 's3',
      data: {
        label: 'Model Storage',
        description: 'Model artifacts',
        status: 'healthy',
      },
      position: { x: 600, y: 500 },
    },
    {
      id: 'dynamodb-1',
      type: 'dynamodb',
      data: {
        label: 'Inference Cache',
        description: 'Response caching',
        status: 'healthy',
        metrics: { requests: 125000, latency: 12 },
      },
      position: { x: 400, y: 650 },
    },
    {
      id: 'sqs-1',
      type: 'sqs',
      data: {
        label: 'Request Queue',
        description: 'Async inference queue',
        status: 'warning',
        metrics: { requests: 2300 },
      },
      position: { x: 100, y: 200 },
    },
    {
      id: 'sns-1',
      type: 'sns',
      data: {
        label: 'Notification Topic',
        description: 'Inference complete alerts',
        status: 'healthy',
      },
      position: { x: 700, y: 200 },
    },
  ];

  const edges: InfrastructureEdge[] = [
    { id: 'e1', source: 'cf-1', target: 'apigw-1', animated: true },
    { id: 'e2', source: 'apigw-1', target: 'lambda-1', animated: true },
    { id: 'e3', source: 'apigw-1', target: 'lambda-2', animated: true },
    { id: 'e4', source: 'lambda-1', target: 'ec2-1', label: 'Inference' },
    { id: 'e5', source: 'lambda-2', target: 's3-1', label: 'Load model' },
    { id: 'e6', source: 'lambda-1', target: 'dynamodb-1', label: 'Cache' },
    { id: 'e7', source: 'lambda-2', target: 'dynamodb-1', label: 'Check cache' },
    { id: 'e8', source: 'sqs-1', target: 'lambda-1', animated: true, label: 'Async' },
    { id: 'e9', source: 'lambda-1', target: 'sns-1', label: 'Notify' },
  ];

  const isolatedServices: IsolatedService[] = [
    {
      id: 'rds-1',
      type: 'rds',
      label: 'Analytics Database',
      description: 'RDS PostgreSQL for analytics',
      status: 'healthy',
      metrics: { latency: 25, uptime: 99.95 },
    },
    {
      id: 's3-2',
      type: 's3',
      label: 'Logs Bucket',
      description: 'Centralized logging storage',
      status: 'healthy',
    },
    {
      id: 'lambda-3',
      type: 'lambda',
      label: 'Cleanup Function',
      description: 'Scheduled cleanup tasks',
      status: 'healthy',
      metrics: { requests: 144, latency: 450 },
    },
    {
      id: 'ec2-2',
      type: 'ec2',
      label: 'Monitoring Instance',
      description: 'CloudWatch agent',
      status: 'healthy',
      metrics: { uptime: 99.8 },
    },
  ];

  return { nodes, edges, isolatedServices };
};
