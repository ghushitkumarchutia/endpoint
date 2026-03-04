import { memo, useMemo } from "react";

const pseudoRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const HeroBackground = ({ className = "" }) => {
  const network = useMemo(() => {
    const nodes = [];
    const lines = [];

    const numRows = 5;
    const numCols = 8;
    const points = [];

    for (let r = 0; r <= numRows; r++) {
      for (let c = 0; c <= numCols; c++) {
        const seed = r * 10 + c + 1;
        const jitterX = (pseudoRandom(seed) - 0.5) * 10;
        const jitterY = (pseudoRandom(seed + 100) - 0.5) * 10;
        points.push({
          x: (c / numCols) * 100 + jitterX,
          y: (r / numRows) * 100 + jitterY,
          id: `${r}-${c}`,
          isCore: pseudoRandom(seed + 200) > 0.85,
        });
      }
    }

    points.forEach((node, i) => {
      if (node.isCore) {
        nodes.push(
          <circle
            key={`glow-${i}`}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r='8'
            fill='rgba(34, 197, 94, 0.2)'
            className='animate-pulse'
          />,
        );
        nodes.push(
          <circle
            key={`node-${i}`}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r='3'
            fill='rgba(34, 197, 94, 1)'
          />,
        );
      } else {
        nodes.push(
          <circle
            key={`node-${i}`}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r='1.5'
            fill='rgba(255, 255, 255, 0.8)'
          />,
        );
      }

      points.forEach((target, j) => {
        if (i < j) {
          const dx = node.x - target.x;
          const dy = node.y - target.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 22) {
            const opacity = Math.max(0.05, 0.3 - dist / 100);
            lines.push(
              <line
                key={`line-${i}-${j}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke={`rgba(255, 255, 255, ${opacity})`}
                strokeWidth='1'
              />,
            );
          }
        }
      });
    });

    return { nodes, lines };
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black ${className}`}
    >
      <div
        className='absolute inset-0 opacity-100'
        style={{
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      >
        <svg className='w-full h-full' xmlns='http://www.w3.org/2000/svg'>
          {network.lines}
          {network.nodes}
        </svg>
      </div>
    </div>
  );
};

export default memo(HeroBackground);
