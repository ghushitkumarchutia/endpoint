const DependencyEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style,
  data,
}) => {
  const edgePath = `M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY} ${targetX - 50} ${targetY} ${targetX} ${targetY}`;

  const getStrokeColor = () => {
    if (data?.isRequired) return "#ef4444";
    if (data?.relationship === "auth_depends") return "#f59e0b";
    return "#6b7280";
  };

  return (
    <>
      <path
        id={id}
        d={edgePath}
        fill='none'
        stroke={getStrokeColor()}
        strokeWidth={2}
        style={style}
        className='transition-colors'
      />
      {data?.label && (
        <text
          x={(sourceX + targetX) / 2}
          y={(sourceY + targetY) / 2 - 10}
          textAnchor='middle'
          fontSize={10}
          fill='var(--muted-foreground)'
        >
          {data.label}
        </text>
      )}
    </>
  );
};

export default DependencyEdge;
