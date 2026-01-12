import { useCallback } from 'react';
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import {
  Server,
  Zap,
  Database,
  BarChart3,
  HardDrive,
  Globe,
  Cloud,
  Table,
  MessageSquare,
  Bell,
} from 'lucide-react';
import type { ArchitectureDiagramData, InfrastructureNode } from '../types';

interface ArchitectureDiagramProps {
  data: ArchitectureDiagramData;
}

const getServiceIcon = (type: string) => {
  const iconClass = "w-5 h-5";
  switch (type) {
    case 'ec2':
      return <Server className={iconClass} />;
    case 'lambda':
      return <Zap className={iconClass} />;
    case 'rds':
      return <Database className={iconClass} />;
    case 'elb':
      return <BarChart3 className={iconClass} />;
    case 's3':
      return <HardDrive className={iconClass} />;
    case 'api-gateway':
      return <Globe className={iconClass} />;
    case 'cloudfront':
      return <Cloud className={iconClass} />;
    case 'dynamodb':
      return <Table className={iconClass} />;
    case 'sqs':
      return <MessageSquare className={iconClass} />;
    case 'sns':
      return <Bell className={iconClass} />;
    default:
      return <Server className={iconClass} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'border-green-500';
    case 'warning':
      return 'border-yellow-500';
    case 'error':
      return 'border-red-500';
    default:
      return 'border-gray-500';
  }
};

const CustomNode = ({ data }: { data: InfrastructureNode['data'] }) => {
  const statusColor = getStatusColor(data.status);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`px-4 py-3 rounded-xl border-2 ${statusColor} bg-dark-card/90 backdrop-blur-md shadow-xl min-w-[200px]`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-cyber-purple/20 rounded-lg">
          {getServiceIcon(data.label.toLowerCase())}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="text-xs text-gray-400">{data.description}</div>
        </div>
      </div>
      {data.metrics && (
        <div className="flex gap-2 mt-2 pt-2 border-t border-gray-700">
          {data.metrics.requests && (
            <div className="text-xs">
              <span className="text-gray-500">Req:</span>{' '}
              <span className="text-cyber-blue font-medium">
                {(data.metrics.requests / 1000).toFixed(0)}k
              </span>
            </div>
          )}
          {data.metrics.latency && (
            <div className="text-xs">
              <span className="text-gray-500">Lat:</span>{' '}
              <span className="text-cyber-purple font-medium">{data.metrics.latency}ms</span>
            </div>
          )}
          {data.metrics.uptime && (
            <div className="text-xs">
              <span className="text-gray-500">Up:</span>{' '}
              <span className="text-green-400 font-medium">{data.metrics.uptime}%</span>
            </div>
          )}
        </div>
      )}
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
        style={{
          backgroundColor: data.status === 'healthy' ? '#10b981' : data.status === 'warning' ? '#f59e0b' : '#ef4444'
        }}
      />
    </motion.div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ data }) => {
  const flowNodes: Node[] = data.nodes.map((node) => ({
    id: node.id,
    type: 'custom',
    position: node.position,
    data: node.data,
  }));

  const flowEdges: Edge[] = data.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    animated: edge.animated,
    label: edge.label,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#666',
    },
    style: {
      stroke: edge.animated ? '#9333ea' : '#666',
      strokeWidth: edge.animated ? 2 : 1,
    },
    labelStyle: {
      fill: '#999',
      fontSize: 10,
    },
    labelBgStyle: {
      fill: '#1a1a24',
      fillOpacity: 0.8,
    },
  }));

  const [nodes, , onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => [...eds, params]),
    [setEdges]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 h-[800px]"
    >
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span className="bg-gradient-to-r from-cyber-purple to-cyber-pink bg-clip-text text-transparent">
            Infrastructure Architecture
          </span>
        </h3>
        <p className="text-sm text-gray-400">
          Tagged with "inference" - {data.nodes.length} services
        </p>
      </div>
      <div className="h-[calc(100%-5rem)] rounded-xl overflow-hidden border border-dark-border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          style={{
            background: '#0a0a0f',
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#2d2d3d"
          />
          <Controls
            style={{
              background: '#1a1a24',
              border: '1px solid #2d2d3d',
            }}
          />
        </ReactFlow>
      </div>
    </motion.div>
  );
};

export default ArchitectureDiagram;
