import { useCallback, useMemo } from 'react';
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
  Handle,
  Position,
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
  Box,
} from 'lucide-react';
import type { ArchitectureDiagramData, InfrastructureNode, IsolatedService } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface ArchitectureDiagramProps {
  data: ArchitectureDiagramData;
}

const getServiceIcon = (type: string, className = "w-5 h-5") => {
  switch (type) {
    case 'ec2':
      return <Server className={className} />;
    case 'lambda':
      return <Zap className={className} />;
    case 'rds':
      return <Database className={className} />;
    case 'elb':
      return <BarChart3 className={className} />;
    case 's3':
      return <HardDrive className={className} />;
    case 'api-gateway':
      return <Globe className={className} />;
    case 'cloudfront':
      return <Cloud className={className} />;
    case 'dynamodb':
      return <Table className={className} />;
    case 'sqs':
      return <MessageSquare className={className} />;
    case 'sns':
      return <Bell className={className} />;
    default:
      return <Server className={className} />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return '#10b981';
    case 'warning':
      return '#f59e0b';
    case 'error':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const CustomNode = ({ data }: { data: InfrastructureNode['data'] }) => {
  const { currentColors } = useTheme();
  const statusColor = getStatusColor(data.status);

  return (
    <>
      {/* Connection handles for edges */}
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="px-4 py-3 rounded-xl border-2 backdrop-blur-md shadow-xl min-w-[200px]"
        style={{
          borderColor: statusColor,
          backgroundColor: currentColors.card,
          color: currentColors.text,
          transform: 'translateZ(0)'
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${currentColors.primary}20` }}>
            {getServiceIcon(data.label.toLowerCase())}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">{data.label}</div>
            <div className="text-xs" style={{ color: currentColors.textSecondary }}>{data.description}</div>
          </div>
        </div>
        {data.metrics && (
          <div className="flex gap-2 mt-2 pt-2 border-t" style={{ borderColor: currentColors.border }}>
            {data.metrics.requests && (
              <div className="text-xs">
                <span style={{ color: currentColors.textSecondary }}>Req:</span>{' '}
                <span className="font-medium" style={{ color: currentColors.secondary }}>
                  {(data.metrics.requests / 1000).toFixed(0)}k
                </span>
              </div>
            )}
            {data.metrics.latency && (
              <div className="text-xs">
                <span style={{ color: currentColors.textSecondary }}>Lat:</span>{' '}
                <span className="font-medium" style={{ color: currentColors.primary }}>{data.metrics.latency}ms</span>
              </div>
            )}
            {data.metrics.uptime && (
              <div className="text-xs">
                <span style={{ color: currentColors.textSecondary }}>Up:</span>{' '}
                <span className="text-green-400 font-medium">{data.metrics.uptime}%</span>
              </div>
            )}
          </div>
        )}
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: statusColor }}
        />
      </motion.div>
    </>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const IsolatedServiceCard: React.FC<{ service: IsolatedService; index: number }> = ({ service, index }) => {
  const { currentColors } = useTheme();
  const statusColor = getStatusColor(service.status);

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15, delay: index * 0.03, ease: 'easeOut' }}
      className="p-4 rounded-xl border transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: currentColors.card,
        borderColor: currentColors.border,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: `${currentColors.primary}20` }}>
          {getServiceIcon(service.type, "w-5 h-5")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="font-semibold text-sm" style={{ color: currentColors.text }}>
              {service.label}
            </div>
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: statusColor }}
              title={service.status}
            />
          </div>
          <div className="text-xs mb-2" style={{ color: currentColors.textSecondary }}>
            {service.description}
          </div>
          {service.metrics && (
            <div className="flex gap-3 text-xs">
              {service.metrics.requests !== undefined && (
                <div>
                  <span style={{ color: currentColors.textSecondary }}>Req: </span>
                  <span className="font-medium" style={{ color: currentColors.secondary }}>
                    {service.metrics.requests > 1000 ? `${(service.metrics.requests / 1000).toFixed(1)}k` : service.metrics.requests}
                  </span>
                </div>
              )}
              {service.metrics.latency !== undefined && (
                <div>
                  <span style={{ color: currentColors.textSecondary }}>Lat: </span>
                  <span className="font-medium" style={{ color: currentColors.primary }}>
                    {service.metrics.latency}ms
                  </span>
                </div>
              )}
              {service.metrics.uptime !== undefined && (
                <div>
                  <span style={{ color: currentColors.textSecondary }}>Up: </span>
                  <span className="text-green-400 font-medium">
                    {service.metrics.uptime}%
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ data }) => {
  const { currentColors } = useTheme();

  const flowNodes: Node[] = data.nodes.map((node) => ({
    id: node.id,
    type: 'custom',
    position: node.position,
    data: node.data,
  }));

  const flowEdges: Edge[] = useMemo(() =>
    data.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: edge.animated,
      label: edge.label,
      type: 'smoothstep',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edge.animated ? currentColors.primary : currentColors.secondary,
      },
      style: {
        stroke: edge.animated ? currentColors.primary : currentColors.secondary,
        strokeWidth: edge.animated ? 3 : 2,
      },
      labelStyle: {
        fill: currentColors.textSecondary,
        fontSize: 11,
        fontWeight: 500,
      },
      labelBgStyle: {
        fill: currentColors.card,
        fillOpacity: 0.9,
      },
    })),
    [data.edges, currentColors]
  );

  const [nodes, , onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => [...eds, params]),
    [setEdges]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Flow Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="lg:col-span-3 rounded-2xl p-6 h-[800px]"
        style={{
          backgroundColor: currentColors.card,
          border: `1px solid ${currentColors.border}`,
        }}
      >
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 flex items-center gap-2" style={{ color: currentColors.text }}>
            <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{
              backgroundImage: `linear-gradient(to right, ${currentColors.primary}, ${currentColors.accent})`
            }}>
              Connected Infrastructure
            </span>
          </h3>
          <p className="text-sm" style={{ color: currentColors.textSecondary }}>
            {data.nodes.length} services in workflow
          </p>
        </div>
        <div className="h-[calc(100%-5rem)] rounded-xl overflow-hidden border" style={{ borderColor: currentColors.border }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            defaultEdgeOptions={{
              type: 'default',
              markerEnd: { type: MarkerType.ArrowClosed },
            }}
            style={{
              background: currentColors.bg,
            }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color={currentColors.border}
            />
            <Controls
              style={{
                background: currentColors.card,
                border: `1px solid ${currentColors.border}`,
              }}
            />
          </ReactFlow>
        </div>
      </motion.div>

      {/* Isolated Services Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.05, ease: 'easeOut' }}
        className="lg:col-span-1"
      >
        <div className="rounded-2xl p-6 h-[800px] flex flex-col" style={{
          backgroundColor: currentColors.card,
          border: `1px solid ${currentColors.border}`,
        }}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2" style={{ color: currentColors.text }}>
              <Box className="w-5 h-5" style={{ color: currentColors.accent }} />
              <span>Isolated Services</span>
            </h3>
            <p className="text-xs" style={{ color: currentColors.textSecondary }}>
              {data.isolatedServices.length} standalone resources
            </p>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {data.isolatedServices.map((service, index) => (
              <IsolatedServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ArchitectureDiagram;
