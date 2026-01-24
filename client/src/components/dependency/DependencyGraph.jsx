import { useState, useCallback, useEffect, useRef } from "react";
import ApiNode from "./ApiNode";
import GraphControls from "./GraphControls";
import ImpactHighlight from "./ImpactHighlight";
import useDependencies from "../../hooks/useDependencies";
import { DEPENDENCY_RELATIONSHIPS } from "../../utils/constants";

const EDGE_COLORS = {
  [DEPENDENCY_RELATIONSHIPS.CALLS]: "#6366f1",
  [DEPENDENCY_RELATIONSHIPS.DEPENDS_ON]: "#8b5cf6",
  [DEPENDENCY_RELATIONSHIPS.TRIGGERS]: "#f59e0b",
  [DEPENDENCY_RELATIONSHIPS.READS_FROM]: "#10b981",
  [DEPENDENCY_RELATIONSHIPS.WRITES_TO]: "#ef4444",
};

const DependencyGraph = () => {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [prevGraph, setPrevGraph] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [filter, setFilter] = useState("");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(null);

  const { graph, loading, fetchGraph, fetchImpactAnalysis } = useDependencies();

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  // Adjust state during rendering to derive nodes from graph
  // This avoids "setState in effect" errors by updating state immediately during render
  if (graph !== prevGraph) {
    setPrevGraph(graph);
    if (graph && graph.nodes) {
      const layoutNodes = graph.nodes.map((node, index) => ({
        ...node,
        x: (index % 4) * 220 + 100,
        y: Math.floor(index / 4) * 160 + 100,
      }));
      setNodes(layoutNodes);
    }
  }

  // Derive display state during render (highlighting)
  const edges = graph?.edges || [];

  const displayNodes = nodes.map((node) => ({
    ...node,
    highlighted: impactData?.affectedApis?.some((a) => a.id === node.id),
  }));

  const handleNodeClick = useCallback(
    async (node) => {
      setSelectedNode(node.id);
      const analysis = await fetchImpactAnalysis(node.id);
      if (analysis) {
        setImpactData({
          sourceApi: { id: node.id, name: node.name },
          affectedApis: analysis.affectedApis,
          totalImpact: analysis.totalImpact,
        });
      }
    },
    [fetchImpactAnalysis],
  );

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));
  const handleFitView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };
  const handleRefresh = () => {
    setImpactData(null);
    setSelectedNode(null);
    fetchGraph();
  };

  const handleMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setDragging(nodeId);
  };

  const handleMouseMove = (e) => {
    if (dragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / zoom;
      const y = (e.clientY - rect.top - offset.y) / zoom;
      setNodes((prev) =>
        prev.map((n) => (n.id === dragging ? { ...n, x, y } : n)),
      );
    }
  };

  const handleMouseUp = () => setDragging(null);

  const filterOptions = Object.values(DEPENDENCY_RELATIONSHIPS).map((rel) => ({
    value: rel,
    label: rel.replace(/_/g, " "),
  }));

  const getNodePosition = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  // Only show loading if we don't have nodes yet
  if (loading && !nodes.length) {
    return (
      <div className='h-full flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='h-full w-full relative'>
      <div
        ref={containerRef}
        className='h-full w-full overflow-hidden bg-muted/20'
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width='100%'
          height='100%'
          style={{
            transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
            transformOrigin: "0 0",
          }}
        >
          <defs>
            <marker
              id='arrowhead'
              markerWidth='10'
              markerHeight='7'
              refX='9'
              refY='3.5'
              orient='auto'
            >
              <polygon points='0 0, 10 3.5, 0 7' fill='#888' />
            </marker>
          </defs>
          {edges.map((edge) => {
            const source = getNodePosition(edge.source);
            const target = getNodePosition(edge.target);
            const color = EDGE_COLORS[edge.relationship] || "#888";
            return (
              <line
                key={edge.id}
                x1={source.x + 80}
                y1={source.y + 30}
                x2={target.x}
                y2={target.y + 30}
                stroke={color}
                strokeWidth={2}
                markerEnd='url(#arrowhead)'
              />
            );
          })}
        </svg>

        <div
          style={{
            transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)`,
            transformOrigin: "0 0",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {displayNodes.map((node) => (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: node.x,
                top: node.y,
                cursor: "grab",
              }}
              onMouseDown={(e) => handleMouseDown(e, node.id)}
              onClick={() => handleNodeClick(node)}
            >
              <ApiNode
                data={{
                  label: node.name,
                  endpoint: node.endpoint,
                  type: node.type,
                  health: node.health,
                  metrics: node.metrics,
                  highlighted: node.highlighted,
                }}
                selected={selectedNode === node.id}
              />
            </div>
          ))}
        </div>
      </div>

      <GraphControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
        onRefresh={handleRefresh}
        filterOptions={filterOptions}
        selectedFilter={filter}
        onFilterChange={setFilter}
      />

      {impactData && (
        <ImpactHighlight
          impactData={impactData}
          onNodeClick={(nodeId) => {
            const node = nodes.find((n) => n.id === nodeId);
            if (node) {
              setOffset({ x: -node.x + 200, y: -node.y + 200 });
            }
          }}
        />
      )}
    </div>
  );
};

export default DependencyGraph;
