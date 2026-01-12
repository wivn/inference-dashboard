export interface CostItem {
  service: string;
  cost: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

export interface TimeSeriesCost {
  date: string;
  cost: number;
}

export interface BudgetData {
  totalCost: number;
  budget: number;
  costBreakdown: CostItem[];
  timeSeriesData: TimeSeriesCost[];
  lastUpdated: string;
}

export interface InfrastructureNode {
  id: string;
  type: 'ec2' | 'lambda' | 'rds' | 'elb' | 's3' | 'api-gateway' | 'cloudfront' | 'dynamodb' | 'sqs' | 'sns';
  data: {
    label: string;
    description: string;
    status: 'healthy' | 'warning' | 'error';
    metrics?: {
      requests?: number;
      latency?: number;
      uptime?: number;
    };
  };
  position: {
    x: number;
    y: number;
  };
}

export interface InfrastructureEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
}

export interface ArchitectureDiagramData {
  nodes: InfrastructureNode[];
  edges: InfrastructureEdge[];
}
