import React, { useState, useMemo } from 'react';

// Types
interface Point {
  x: number;
  y: number;
}

type RoofType = 'hip' | 'cathedral' | 'scissor' | 'skillion';
type SkylightType = 'FS' | 'FCM';
type LightwellType = 'standard' | 'plumb' | 'perpendicular' | 'square';

interface SkylightSize {
  code: string;
  width: number;
}

const FS_SIZES: SkylightSize[] = [
  { code: '01', width: 700 },
  { code: '02', width: 780 },
  { code: '04', width: 980 },
  { code: '06', width: 1180 },
  { code: '08', width: 1400 },
];

const FCM_SIZES: SkylightSize[] = [
  { code: '14', width: 488 },
  { code: '22', width: 692 },
  { code: '30', width: 895 },
  { code: '34', width: 997 },
  { code: '46', width: 1302 },
  { code: '55', width: 1527 },
  { code: '70', width: 1911 },
  { code: '72', width: 1959 },
];

// Utility functions
const degToRad = (deg: number) => (deg * Math.PI) / 180;
const radToDeg = (rad: number) => (rad * 180) / Math.PI;
const lineIntersection = (p1: Point, p2: Point, p3: Point, p4: Point): Point | null => {
  const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(denom) < 0.0001) return null;
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
};

// Slider Component
const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  disabled?: boolean;
}> = ({ label, value, min, max, step, unit = 'm', onChange, disabled }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-xs">
      <span className={disabled ? 'text-gray-400' : 'text-gray-300'}>{label}</span>
      <span className={`font-mono ${disabled ? 'text-gray-500' : 'text-cyan-400'}`}>
        {value.toFixed(step < 1 ? 1 : 0)} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      disabled={disabled}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed"
    />
  </div>
);

// Toggle Component
const Toggle: React.FC<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}> = ({ label, checked, onChange, disabled }) => (
  <label className={`flex items-center gap-2 cursor-pointer ${disabled ? 'opacity-40' : ''}`}>
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <div className={`w-10 h-5 rounded-full transition-colors ${checked ? 'bg-cyan-500' : 'bg-gray-600'}`} />
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </div>
    <span className="text-xs text-gray-300">{label}</span>
  </label>
);

// Select Component
const Select: React.FC<{
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  disabled?: boolean;
}> = ({ label, value, options, onChange, disabled }) => (
  <div className="flex flex-col gap-1">
    <span className={`text-xs ${disabled ? 'text-gray-500' : 'text-gray-300'}`}>{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="bg-gray-700 text-white text-xs rounded px-2 py-1.5 border border-gray-600 focus:border-cyan-500 focus:outline-none disabled:opacity-40"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// Control Panel Section
const ControlSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border border-gray-600 rounded-lg p-3 bg-gray-800/50">
    <h3 className="text-xs font-semibold text-cyan-400 mb-2 uppercase tracking-wide">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

// Human SVG Component
const HumanFigure: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => {
  const h = 1750 * scale;
  const headR = 100 * scale;
  const bodyTop = y - h + headR * 2;

  return (
    <g>
      {/* Head */}
      <circle cx={x} cy={y - h + headR} r={headR} fill="#8B7355" stroke="#5D4E37" strokeWidth={2} />
      {/* Hair */}
      <ellipse cx={x} cy={y - h + headR * 0.6} rx={headR * 0.8} ry={headR * 0.5} fill="#3D2314" />
      {/* Body */}
      <path
        d={`M ${x - 60 * scale} ${bodyTop + 30 * scale}
             Q ${x - 80 * scale} ${bodyTop + 400 * scale} ${x - 50 * scale} ${bodyTop + 600 * scale}
            L ${x + 50 * scale} ${bodyTop + 600 * scale}
            Q ${x + 80 * scale} ${bodyTop + 400 * scale} ${x + 60 * scale} ${bodyTop + 30 * scale}
            Z`}
        fill="#4A90D9"
        stroke="#2E5A87"
        strokeWidth={2}
      />
      {/* Arms */}
      <path
        d={`M ${x - 60 * scale} ${bodyTop + 80 * scale}
             Q ${x - 120 * scale} ${bodyTop + 300 * scale} ${x - 80 * scale} ${bodyTop + 450 * scale}`}
        fill="none"
        stroke="#8B7355"
        strokeWidth={25 * scale}
        strokeLinecap="round"
      />
      <path
        d={`M ${x + 60 * scale} ${bodyTop + 80 * scale}
             Q ${x + 120 * scale} ${bodyTop + 300 * scale} ${x + 80 * scale} ${bodyTop + 450 * scale}`}
        fill="none"
        stroke="#8B7355"
        strokeWidth={25 * scale}
        strokeLinecap="round"
      />
      {/* Legs */}
      <path
        d={`M ${x - 30 * scale} ${bodyTop + 600 * scale}
             L ${x - 40 * scale} ${bodyTop + 1000 * scale}
            L ${x - 70 * scale} ${bodyTop + 1020 * scale}
            L ${x - 70 * scale} ${bodyTop + 1050 * scale}
            L ${x - 20 * scale} ${bodyTop + 1050 * scale}
            L ${x - 10 * scale} ${bodyTop + 600 * scale} Z`}
        fill="#2D3748"
      />
      <path
        d={`M ${x + 30 * scale} ${bodyTop + 600 * scale}
             L ${x + 40 * scale} ${bodyTop + 1000 * scale}
            L ${x + 70 * scale} ${bodyTop + 1020 * scale}
            L ${x + 70 * scale} ${bodyTop + 1050 * scale}
            L ${x + 20 * scale} ${bodyTop + 1050 * scale}
            L ${x + 10 * scale} ${bodyTop + 600 * scale} Z`}
        fill="#2D3748"
      />
    </g>
  );
};

// Main App
export default function SPLAYApp() {
  // Structure state
  const [ceilingHeight, setCeilingHeight] = useState(2.4);
  const [roomWidth, setRoomWidth] = useState(8);
  const [roofPitch, setRoofPitch] = useState(28);
  const [roofType, setRoofType] = useState<RoofType>('hip');
  // Skylight state
  const [skylightType, setSkylightType] = useState<SkylightType>('FS');
  const [skylightSizeIndex, setSkylightSizeIndex] = useState(2);
  const [skylightPosition, setSkylightPosition] = useState(-0.9);
  // Lightwell state
  const [lightwellOn, setLightwellOn] = useState(false);
  const [lightwellType, setLightwellType] = useState<LightwellType>('standard');
  const [lightwellAdjustLeft, setLightwellAdjustLeft] = useState(0);
  const [lightwellAdjustRight, setLightwellAdjustRight] = useState(0);
  // Daylight state
  const [daylightSkylight, setDaylightSkylight] = useState(false);
  const [daylightWindows, setDaylightWindows] = useState(false);
  // Multi state
  const [tandem, setTandem] = useState(false);
  const [mirror, setMirror] = useState(false);
  // Elements state
  const [showKitchenBench, setShowKitchenBench] = useState(false);
  const [showIsland, setShowIsland] = useState(false);
  const [islandPosition, setIslandPosition] = useState(1.8);
  const [showHuman, setShowHuman] = useState(false);
  const [humanPosition, setHumanPosition] = useState(0);
  const [showDashedLine, setShowDashedLine] = useState(false);
  // View state
  const [zoom, setZoom] = useState(1);
  // Divide state
  const [showInternalWall, setShowInternalWall] = useState(false);
  const [internalWallPosition, setInternalWallPosition] = useState(1);

  // Derived values
  const effectiveSkylightType = roofPitch < 15 ? 'FCM' : skylightType;
  const sizes = effectiveSkylightType === 'FS' ? FS_SIZES : FCM_SIZES;
  const currentSize = sizes[Math.min(skylightSizeIndex, sizes.length - 1)];
  const skylightWidth = currentSize.width / 1000;
  const skylightThickness = 0.07;
  const fcmUpstand = effectiveSkylightType === 'FCM' ? 0.14 : 0;

  // Scale for SVG (pixels per meter)
  const baseScale = 100;
  const scale = baseScale * zoom;

  // SVG dimensions
  const svgWidth = 1200;
  const svgHeight = 500;

  // Building geometry calculations
  const geometry = useMemo(() => {
    const overhang = 0.6;
    const totalWidth = roomWidth + overhang * 2;
    const halfRoom = roomWidth / 2;
    const pitchRad = degToRad(roofPitch);

    // Floor level (SVG Y increases downward, so floor is at max Y)
    const floorY = svgHeight - 80;
    const wallHeight = ceilingHeight;

    // Walls
    const leftWallX = (svgWidth - roomWidth * scale) / 2;
    const rightWallX = leftWallX + roomWidth * scale;
    const wallTopY = floorY - wallHeight * scale;

    // Roof apex
    const apexX = svgWidth / 2;
    let roofRise: number;
    let apexY: number;
    let ceilingY: number;
    let leftCeilingY: number;
    let rightCeilingY: number;
    // Roof edges (with overhang)
    const leftRoofX = leftWallX - overhang * scale;
    const rightRoofX = rightWallX + overhang * scale;
    if (roofType === 'hip' || roofType === 'cathedral') {
      roofRise = (halfRoom + overhang) * Math.tan(pitchRad);
      apexY = wallTopY - roofRise * scale;

      if (roofType === 'cathedral') {
        ceilingY = apexY;
        leftCeilingY = floorY - wallHeight * scale;
        rightCeilingY = floorY - wallHeight * scale;
      } else {
        ceilingY = wallTopY;
        leftCeilingY = wallTopY;
        rightCeilingY = wallTopY;
      }
    } else if (roofType === 'scissor') {
      roofRise = (halfRoom + overhang) * Math.tan(pitchRad);
      apexY = wallTopY - roofRise * scale;
      const scissorPitch = roofPitch - 15;
      const scissorRad = degToRad(scissorPitch);
      const ceilingRise = halfRoom * Math.tan(scissorRad);
      ceilingY = wallTopY - ceilingRise * scale;
      leftCeilingY = wallTopY;
      rightCeilingY = wallTopY;
    } else {
      // Skillion
      roofRise = totalWidth * Math.tan(pitchRad);
      if (roofPitch >= 0) {
        apexY = wallTopY - roofRise * scale;
        ceilingY = apexY;
        leftCeilingY = wallTopY;
        rightCeilingY = apexY + overhang * Math.tan(pitchRad) * scale;
      } else {
        apexY = wallTopY;
        ceilingY = wallTopY - Math.abs(roofRise) * scale;
        leftCeilingY = wallTopY - Math.abs(roofRise) * scale + overhang * Math.tan(Math.abs(pitchRad)) * scale;
        rightCeilingY = wallTopY;
      }
    }
    return {
      floorY,
      wallTopY,
      leftWallX,
      rightWallX,
      leftRoofX,
      rightRoofX,
      apexX,
      apexY,
      ceilingY,
      leftCeilingY,
      rightCeilingY,
      pitchRad,
      overhang,
      halfRoom,
    };
  }, [ceilingHeight, roomWidth, roofPitch, roofType, scale, svgWidth, svgHeight]);

  // Calculate skylight and lightwell geometry
  const skylightGeometry = useMemo(() => {
    const { apexX, apexY, leftRoofX, rightRoofX, floorY, wallTopY, pitchRad, leftWallX, rightWallX, leftCeilingY, rightCeilingY } = geometry;

    // Skylight center position relative to apex
    const skylightCenterX = apexX + skylightPosition * scale;
    const isLeftSide = skylightPosition < 0;

    // Calculate roof line
    let roofStartX: number, roofStartY: number, roofEndX: number, roofEndY: number;

    if (roofType === 'skillion') {
      if (roofPitch >= 0) {
        roofStartX = leftRoofX;
        roofStartY = wallTopY;
        roofEndX = rightRoofX;
        roofEndY = apexY + geometry.overhang * Math.tan(Math.abs(pitchRad)) * scale;
      } else {
        roofStartX = leftRoofX;
        roofStartY = apexY - geometry.overhang * Math.tan(Math.abs(pitchRad)) * scale;
        roofEndX = rightRoofX;
        roofEndY = wallTopY;
      }
    } else if (isLeftSide) {
      roofStartX = leftRoofX;
      roofStartY = wallTopY;
      roofEndX = apexX;
      roofEndY = apexY;
    } else {
      roofStartX = apexX;
      roofStartY = apexY;
      roofEndX = rightRoofX;
      roofEndY = wallTopY;
    }
    // Calculate skylight corners on roof
    const halfWidth = (skylightWidth * scale) / 2;
    const roofAngle = Math.atan2(roofEndY - roofStartY, roofEndX - roofStartX);

    // Points a and b on roof surface
    const pointA: Point = {
      x: skylightCenterX - halfWidth * Math.cos(roofAngle),
      y: roofStartY + ((skylightCenterX - halfWidth * Math.cos(roofAngle)) - roofStartX) * Math.tan(roofAngle),
    };
    const pointB: Point = {
      x: skylightCenterX + halfWidth * Math.cos(roofAngle),
      y: roofStartY + ((skylightCenterX + halfWidth * Math.cos(roofAngle)) - roofStartX) * Math.tan(roofAngle),
    };
    // Skylight top surface (offset by thickness perpendicular to roof)
    const perpAngle = roofAngle - Math.PI / 2;
    const thicknessOffset = (skylightThickness + fcmUpstand) * scale;
    const skylightTopA: Point = {
      x: pointA.x + thicknessOffset * Math.cos(perpAngle),
      y: pointA.y + thicknessOffset * Math.sin(perpAngle),
    };
    const skylightTopB: Point = {
      x: pointB.x + thicknessOffset * Math.cos(perpAngle),
      y: pointB.y + thicknessOffset * Math.sin(perpAngle),
    };
    // Lightwell geometry
    let pointC: Point = { x: pointB.x, y: wallTopY };
    let pointD: Point = { x: pointA.x, y: wallTopY };

    // Determine ceiling intersection Y for each side
    let ceilingYAtC: number;
    let ceilingYAtD: number;

    if (roofType === 'cathedral') {
      // Cathedral: ceiling follows roof line
      const roofSlope = (roofEndY - roofStartY) / (roofEndX - roofStartX);
      ceilingYAtC = roofStartY + (pointB.x - roofStartX) * roofSlope + skylightThickness * scale / Math.cos(pitchRad);
      ceilingYAtD = roofStartY + (pointA.x - roofStartX) * roofSlope + skylightThickness * scale / Math.cos(pitchRad);
    } else if (roofType === 'scissor') {
      // Scissor: sloped ceiling at reduced pitch
      const scissorPitch = roofPitch - 15;
      const scissorRad = degToRad(scissorPitch);
      const ceilingSlope = isLeftSide ? Math.tan(scissorRad) : -Math.tan(scissorRad);
      ceilingYAtC = wallTopY - (pointB.x - (isLeftSide ? leftWallX : rightWallX)) * ceilingSlope;
      ceilingYAtD = wallTopY - (pointA.x - (isLeftSide ? leftWallX : rightWallX)) * ceilingSlope;
    } else {
      // Hip or Skillion with flat ceiling
      ceilingYAtC = wallTopY;
      ceilingYAtD = wallTopY;
    }

    if (lightwellOn) {
      const adjustLeft = lightwellAdjustLeft * scale;
      const adjustRight = lightwellAdjustRight * scale;

      switch (lightwellType) {
        case 'standard':
          // Left (downslope) is plumb, right (upslope) is perpendicular
          pointD = { x: pointA.x + adjustLeft, y: ceilingYAtD };
          pointC = {
            x: pointB.x + (ceilingYAtC - pointB.y) * Math.tan(pitchRad) + adjustRight,
            y: ceilingYAtC,
          };
          break;
        case 'plumb':
          pointD = { x: pointA.x + adjustLeft, y: ceilingYAtD };
          pointC = { x: pointB.x + adjustRight, y: ceilingYAtC };
          break;
        case 'perpendicular':
          pointD = {
            x: pointA.x + (ceilingYAtD - pointA.y) * Math.tan(pitchRad) + adjustLeft,
            y: ceilingYAtD,
          };
          pointC = {
            x: pointB.x + (ceilingYAtC - pointB.y) * Math.tan(pitchRad) + adjustRight,
            y: ceilingYAtC,
          };
          break;
        case 'square':
          // Left is plumb, right is horizontal
          pointD = { x: pointA.x + adjustLeft, y: ceilingYAtD };
          pointC = { x: pointD.x + skylightWidth * scale + adjustRight, y: ceilingYAtC };
          break;
      }
    }
    // Floor intersections (x and y points)
    const lineDA = { x: pointD.x - pointA.x, y: ceilingYAtD - pointA.y };
    const lineCB = { x: pointC.x - pointB.x, y: ceilingYAtC - pointB.y };

    // Extend lines to floor
    let pointX: Point;
    let pointY: Point;

    if (Math.abs(lineDA.x) < 0.001) {
      pointX = { x: pointA.x, y: floorY };
    } else {
      const slopeDA = lineDA.y / lineDA.x;
      pointX = { x: pointA.x + (floorY - pointA.y) / slopeDA, y: floorY };
    }

    if (Math.abs(lineCB.x) < 0.001) {
      pointY = { x: pointB.x, y: floorY };
    } else {
      const slopeCB = lineCB.y / lineCB.x;
      pointY = { x: pointB.x + (floorY - pointB.y) / slopeCB, y: floorY };
    }
    // Clamp to walls
    pointX.x = Math.max(leftWallX, Math.min(rightWallX, pointX.x));
    pointY.x = Math.max(leftWallX, Math.min(rightWallX, pointY.x));
    return {
      pointA,
      pointB,
      pointC,
      pointD,
      pointX,
      pointY,
      skylightTopA,
      skylightTopB,
      roofAngle,
      ceilingYAtC,
      ceilingYAtD,
    };
  }, [geometry, skylightPosition, skylightWidth, skylightThickness, fcmUpstand, lightwellOn, lightwellType, lightwellAdjustLeft, lightwellAdjustRight, roofType, roofPitch, scale]);

  // Generate daylight polygon
  const daylightPolygon = useMemo(() => {
    if (!lightwellOn || !daylightSkylight) return null;

    const { pointA, pointB, pointC, pointD, pointX, pointY } = skylightGeometry;
    const { leftWallX, floorY } = geometry;

    let points = [pointA, pointB, pointC, pointY, pointX, pointD];

    // Handle internal wall truncation
    if (showInternalWall) {
      const wallX = geometry.leftWallX + (roomWidth / 2 + internalWallPosition) * scale;
      // Truncate polygon at internal wall
      points = points.map(p => ({
        x: Math.min(p.x, wallX),
        y: p.y,
      }));
    }
    // Handle kitchen bench obstruction
    if (showKitchenBench) {
      // Simple truncation - in real implementation would need proper polygon clipping
      void (floorY - 0.9 * scale);
      void (leftWallX + 0.8 * scale);
    }
    return points.map(p => `${p.x},${p.y}`).join(' ');
  }, [skylightGeometry, geometry, lightwellOn, daylightSkylight, showInternalWall, internalWallPosition, roomWidth, scale, showKitchenBench]);

  // Window daylight polygons
  const windowDaylightPolygons = useMemo(() => {
    if (!daylightWindows) return { left: null, right: null };

    const { leftWallX, rightWallX, floorY } = geometry;

    // Left window: 1200-1800mm H
    const leftWindowTop = floorY - 1.8 * scale;
    const leftWindowBottom = floorY - 1.2 * scale;
    const leftDaylightExtent = 2 * scale; // How far light extends into room

    const leftPolygon = [
      { x: leftWallX, y: leftWindowTop },
      { x: leftWallX + leftDaylightExtent, y: leftWindowTop + leftDaylightExtent },
      { x: leftWallX + leftDaylightExtent, y: leftWindowBottom + leftDaylightExtent },
      { x: leftWallX, y: leftWindowBottom },
    ];
    // Right window: 400-2000mm H
    const rightWindowTop = floorY - 2.0 * scale;
    const rightWindowBottom = floorY - 0.4 * scale;
    const rightDaylightExtent = 2 * scale;

    const rightPolygon = [
      { x: rightWallX, y: rightWindowTop },
      { x: rightWallX - rightDaylightExtent, y: rightWindowTop + rightDaylightExtent },
      { x: rightWallX - rightDaylightExtent, y: Math.min(floorY, rightWindowBottom + rightDaylightExtent) },
      { x: rightWallX, y: rightWindowBottom },
    ];
    return {
      left: leftPolygon.map(p => `${p.x},${p.y}`).join(' '),
      right: rightPolygon.map(p => `${p.x},${p.y}`).join(' '),
    };
  }, [daylightWindows, geometry, scale]);

  // Handle skylight type change based on roof pitch
  React.useEffect(() => {
    if (roofPitch < 15 && skylightType === 'FS') {
      setSkylightType('FCM');
      setSkylightSizeIndex(2); // Default FCM size
    }
  }, [roofPitch, skylightType]);

  // Render roof path
  const roofPath = useMemo(() => {
    const { apexX, apexY, leftRoofX, rightRoofX, wallTopY } = geometry;

    if (roofType === 'skillion') {
      if (roofPitch >= 0) {
        const rightY = apexY + geometry.overhang * Math.tan(geometry.pitchRad) * scale;
        return `M ${leftRoofX} ${wallTopY} L ${rightRoofX} ${rightY}`;
      } else {
        const leftY = apexY - geometry.overhang * Math.tan(Math.abs(geometry.pitchRad)) * scale;
        return `M ${leftRoofX} ${leftY} L ${rightRoofX} ${wallTopY}`;
      }
    }
    return `M ${leftRoofX} ${wallTopY} L ${apexX} ${apexY} L ${rightRoofX} ${wallTopY}`;
  }, [geometry, roofType, roofPitch, scale]);

  // Render ceiling path
  const ceilingPath = useMemo(() => {
    const { leftWallX, rightWallX, wallTopY, apexX, ceilingY } = geometry;

    if (roofType === 'cathedral') {
      return roofPath;
    } else if (roofType === 'scissor') {
      return `M ${leftWallX} ${wallTopY} L ${apexX} ${ceilingY} L ${rightWallX} ${wallTopY}`;
    }
    return `M ${leftWallX} ${wallTopY} L ${rightWallX} ${wallTopY}`;
  }, [geometry, roofType, roofPath]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            <span className="text-cyan-400">SPLAY</span>
            <span className="text-gray-400 text-sm ml-2">Skylight Placement – Lightwell Angles – You!</span>
          </h1>
        </div>
        <div className="text-xs text-gray-500">KLiCk Crafted</div>
      </div>
      {/* SVG Visualization */}
      <div className="flex-1 overflow-hidden p-4">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full"
          style={{ maxHeight: 'calc(100vh - 320px)' }}
        >
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#87CEEB" />
              <stop offset="100%" stopColor="#B0E0E6" />
            </linearGradient>
            <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B7355" />
              <stop offset="100%" stopColor="#6B5344" />
            </linearGradient>
            <pattern id="roofPattern" patternUnits="userSpaceOnUse" width="20" height="10">
              <rect width="20" height="10" fill="#8B4513" />
              <rect x="0" y="0" width="10" height="5" fill="#A0522D" />
              <rect x="10" y="5" width="10" height="5" fill="#A0522D" />
            </pattern>
          </defs>
          {/* Sky background */}
          <rect x="0" y="0" width={svgWidth} height={geometry.floorY} fill="url(#skyGradient)" />

          {/* Ground */}
          <rect x="0" y={geometry.floorY} width={svgWidth} height={svgHeight - geometry.floorY} fill="url(#groundGradient)" />
          {/* Window daylight (lighter shade) */}
          {daylightWindows && windowDaylightPolygons.left && (
            <polygon
              points={windowDaylightPolygons.left}
              fill="rgba(255, 255, 200, 0.25)"
            />
          )}
          {daylightWindows && windowDaylightPolygons.right && (
            <polygon
              points={windowDaylightPolygons.right}
              fill="rgba(255, 255, 200, 0.25)"
            />
          )}
          {/* Skylight daylight polygon */}
          {daylightPolygon && (
            <polygon
              points={daylightPolygon}
              fill="rgba(255, 255, 150, 0.35)"
            />
          )}
          {/* Building structure */}
          {/* Walls */}
          <line
            x1={geometry.leftWallX}
            y1={geometry.floorY}
            x2={geometry.leftWallX}
            y2={geometry.wallTopY}
            stroke="#4A5568"
            strokeWidth="8"
          />
          <line
            x1={geometry.rightWallX}
            y1={geometry.floorY}
            x2={geometry.rightWallX}
            y2={geometry.wallTopY}
            stroke="#4A5568"
            strokeWidth="8"
          />
          {/* Floor */}
          <line
            x1={geometry.leftWallX}
            y1={geometry.floorY}
            x2={geometry.rightWallX}
            y2={geometry.floorY}
            stroke="#4A5568"
            strokeWidth="6"
          />
          {/* Ceiling */}
          <path
            d={ceilingPath}
            stroke="#718096"
            strokeWidth="4"
            fill="none"
          />
          {/* Roof surface */}
          <path
            d={roofPath}
            stroke="#8B4513"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
          />
          {/* Soffit (overhang underside) */}
          <line
            x1={geometry.leftRoofX}
            y1={geometry.wallTopY}
            x2={geometry.leftWallX}
            y2={geometry.wallTopY}
            stroke="#A0AEC0"
            strokeWidth="3"
          />
          <line
            x1={geometry.rightWallX}
            y1={geometry.wallTopY}
            x2={geometry.rightRoofX}
            y2={geometry.wallTopY}
            stroke="#A0AEC0"
            strokeWidth="3"
          />
          {/* Left window (1200-1800mm H) */}
          <rect
            x={geometry.leftWallX - 4}
            y={geometry.floorY - 1.8 * scale}
            width="8"
            height={0.6 * scale}
            fill="#87CEEB"
            stroke="#2D3748"
            strokeWidth="2"
          />
          {/* Kitchen bench window adjustment */}
          {showKitchenBench && (
            <rect
              x={geometry.leftWallX - 4}
              y={geometry.floorY - 1.8 * scale}
              width="8"
              height={0.6 * scale}
              fill="#87CEEB"
              stroke="#2D3748"
              strokeWidth="2"
            />
          )}
          {/* Right window (400-2000mm H) */}
          <rect
            x={geometry.rightWallX - 4}
            y={geometry.floorY - 2.0 * scale}
            width="8"
            height={1.6 * scale}
            fill="#87CEEB"
            stroke="#2D3748"
            strokeWidth="2"
          />
          {/* Lightwell */}
          {lightwellOn && (
            <g>
              {/* Lightwell walls */}
              <line
                x1={skylightGeometry.pointA.x}
                y1={skylightGeometry.pointA.y}
                x2={skylightGeometry.pointD.x}
                y2={skylightGeometry.ceilingYAtD}
                stroke="#718096"
                strokeWidth="3"
              />
              <line
                x1={skylightGeometry.pointB.x}
                y1={skylightGeometry.pointB.y}
                x2={skylightGeometry.pointC.x}
                y2={skylightGeometry.ceilingYAtC}
                stroke="#718096"
                strokeWidth="3"
              />
              {/* Ceiling opening */}
              <line
                x1={skylightGeometry.pointD.x}
                y1={skylightGeometry.ceilingYAtD}
                x2={skylightGeometry.pointC.x}
                y2={skylightGeometry.ceilingYAtC}
                stroke="#718096"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            </g>
          )}
          {/* Skylight */}
          <g>
            {/* Skylight frame */}
            <line
              x1={skylightGeometry.pointA.x}
              y1={skylightGeometry.pointA.y}
              x2={skylightGeometry.pointB.x}
              y2={skylightGeometry.pointB.y}
              stroke="#2D3748"
              strokeWidth="4"
            />
            <line
              x1={skylightGeometry.skylightTopA.x}
              y1={skylightGeometry.skylightTopA.y}
              x2={skylightGeometry.skylightTopB.x}
              y2={skylightGeometry.skylightTopB.y}
              stroke="#4299E1"
              strokeWidth="6"
            />
            {/* Skylight sides */}
            <line
              x1={skylightGeometry.pointA.x}
              y1={skylightGeometry.pointA.y}
              x2={skylightGeometry.skylightTopA.x}
              y2={skylightGeometry.skylightTopA.y}
              stroke="#2D3748"
              strokeWidth="3"
            />
            <line
              x1={skylightGeometry.pointB.x}
              y1={skylightGeometry.pointB.y}
              x2={skylightGeometry.skylightTopB.x}
              y2={skylightGeometry.skylightTopB.y}
              stroke="#2D3748"
              strokeWidth="3"
            />
            {/* Glass effect */}
            <polygon
              points={`${skylightGeometry.pointA.x},${skylightGeometry.pointA.y} ${skylightGeometry.pointB.x},${skylightGeometry.pointB.y} ${skylightGeometry.skylightTopB.x},${skylightGeometry.skylightTopB.y} ${skylightGeometry.skylightTopA.x},${skylightGeometry.skylightTopA.y}`}
              fill="rgba(135, 206, 235, 0.4)"
            />
          </g>
          {/* Tandem skylight */}
          {tandem && (
            <g>
              {/* Second skylight 100mm below first */}
              {/* Implementation similar to primary skylight with offset */}
            </g>
          )}
          {/* Mirror skylight */}
          {mirror && (
            <g transform={`scale(-1, 1) translate(${-svgWidth}, 0)`}>
              {/* Mirrored skylight and lightwell */}
            </g>
          )}
          {/* Kitchen bench */}
          {showKitchenBench && (
            <rect
              x={geometry.leftWallX}
              y={geometry.floorY - 0.9 * scale}
              width={0.8 * scale}
              height={0.9 * scale}
              fill="#8B7355"
              stroke="#5D4E37"
              strokeWidth="2"
            />
          )}
          {/* Island */}
          {showIsland && (
            <rect
              x={geometry.leftWallX + islandPosition * scale}
              y={geometry.floorY - 0.9 * scale}
              width={1.2 * scale}
              height={0.9 * scale}
              fill="#A0AEC0"
              stroke="#718096"
              strokeWidth="2"
            />
          )}
          {/* Internal wall */}
          {showInternalWall && (
            <line
              x1={geometry.leftWallX + (roomWidth / 2 + internalWallPosition) * scale}
              y1={geometry.floorY}
              x2={geometry.leftWallX + (roomWidth / 2 + internalWallPosition) * scale}
              y2={geometry.wallTopY}
              stroke="#4A5568"
              strokeWidth="6"
            />
          )}
          {/* Dashed line at 0.9m */}
          {showDashedLine && (
            <line
              x1={geometry.leftWallX}
              y1={geometry.floorY - 0.9 * scale}
              x2={geometry.rightWallX}
              y2={geometry.floorY - 0.9 * scale}
              stroke="#CBD5E0"
              strokeWidth="1"
              strokeDasharray="8,4"
              opacity="0.6"
            />
          )}
          {/* Human figure */}
          {showHuman && (
            <HumanFigure
              x={geometry.apexX + humanPosition * scale}
              y={geometry.floorY}
              scale={scale / 100}
            />
          )}
          {/* Labels */}
          <text x={geometry.apexX} y={geometry.apexY - 20} textAnchor="middle" fill="#CBD5E0" fontSize="12">
            Apex
          </text>

          {/* Point labels for skylight/lightwell */}
          {lightwellOn && (
            <>
              <text x={skylightGeometry.pointA.x - 15} y={skylightGeometry.pointA.y} fill="#E53E3E" fontSize="10" fontWeight="bold">a</text>
              <text x={skylightGeometry.pointB.x + 8} y={skylightGeometry.pointB.y} fill="#E53E3E" fontSize="10" fontWeight="bold">b</text>
              <text x={skylightGeometry.pointC.x + 8} y={skylightGeometry.ceilingYAtC} fill="#E53E3E" fontSize="10" fontWeight="bold">c</text>
              <text x={skylightGeometry.pointD.x - 15} y={skylightGeometry.ceilingYAtD} fill="#E53E3E" fontSize="10" fontWeight="bold">d</text>
              {daylightSkylight && (
                <>
                  <text x={skylightGeometry.pointX.x - 15} y={skylightGeometry.pointX.y - 5} fill="#E53E3E" fontSize="10" fontWeight="bold">x</text>
                  <text x={skylightGeometry.pointY.x + 8} y={skylightGeometry.pointY.y - 5} fill="#E53E3E" fontSize="10" fontWeight="bold">y</text>
                </>
              )}
            </>
          )}
          {/* Dimension annotations */}
          <text x={geometry.leftWallX - 30} y={(geometry.floorY + geometry.wallTopY) / 2} fill="#A0AEC0" fontSize="10" transform={`rotate(-90, ${geometry.leftWallX - 30}, ${(geometry.floorY + geometry.wallTopY) / 2})`} textAnchor="middle">
            {ceilingHeight.toFixed(1)}m
          </text>
        </svg>
      </div>
      {/* Control Panel */}
      <div className="bg-gray-800 border-t border-gray-700 p-3 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {/* Structure */}
          <ControlSection title="Structure">
            <Slider label="Ceiling Height" value={ceilingHeight} min={2.4} max={3.6} step={0.1} onChange={setCeilingHeight} />
            <Slider label="Room Width" value={roomWidth} min={4} max={12} step={0.5} onChange={setRoomWidth} />
            <Slider label="Roof Pitch" value={roofPitch} min={2} max={60} step={1} unit="°" onChange={setRoofPitch} />
            <Select
              label="Roof Type"
              value={roofType}
              options={[
                { value: 'hip', label: 'Hip (flat ceiling)' },
                { value: 'cathedral', label: 'Cathedral' },
                { value: 'scissor', label: 'Scissor Truss' },
                { value: 'skillion', label: 'Skillion' },
              ]}
              onChange={(v) => setRoofType(v as RoofType)}
            />
          </ControlSection>
          {/* Skylight */}
          <ControlSection title="Skylight">
            <Select
              label="Type"
              value={effectiveSkylightType}
              options={[
                { value: 'FS', label: 'FS (≥15°)' },
                { value: 'FCM', label: 'FCM (<15°)' },
              ]}
              onChange={(v) => setSkylightType(v as SkylightType)}
              disabled={roofPitch < 15}
            />
            <Select
              label="Size"
              value={skylightSizeIndex.toString()}
              options={sizes.map((s, i) => ({ value: i.toString(), label: `${s.width}mm (${s.code})` }))}
              onChange={(v) => setSkylightSizeIndex(parseInt(v))}
            />
            <Slider
              label="Position from Apex"
              value={skylightPosition}
              min={-4}
              max={4}
              step={0.1}
              onChange={setSkylightPosition}
            />
          </ControlSection>
          {/* Lightwell */}
          <ControlSection title="Lightwell">
            <Toggle label="Enable" checked={lightwellOn} onChange={setLightwellOn} />
            <Select
              label="Type"
              value={lightwellType}
              options={[
                { value: 'standard', label: 'Standard' },
                { value: 'plumb', label: 'Plumb' },
                { value: 'perpendicular', label: 'Perpendicular' },
                { value: 'square', label: 'Square' },
              ]}
              onChange={(v) => setLightwellType(v as LightwellType)}
              disabled={!lightwellOn}
            />
            <Slider
              label="Left Adjust"
              value={lightwellAdjustLeft}
              min={-1}
              max={1}
              step={0.05}
              onChange={setLightwellAdjustLeft}
              disabled={!lightwellOn}
            />
            <Slider
              label="Right Adjust"
              value={lightwellAdjustRight}
              min={-1}
              max={1}
              step={0.05}
              onChange={setLightwellAdjustRight}
              disabled={!lightwellOn}
            />
          </ControlSection>
          {/* Daylight */}
          <ControlSection title="Daylight">
            <Toggle
              label="Thru Skylights"
              checked={daylightSkylight}
              onChange={setDaylightSkylight}
              disabled={!lightwellOn}
            />
            <Toggle
              label="Thru Windows"
              checked={daylightWindows}
              onChange={setDaylightWindows}
            />
          </ControlSection>
          {/* Multi */}
          <ControlSection title="Multi">
            <Toggle label="Tandem" checked={tandem} onChange={setTandem} />
            <Toggle label="Mirror" checked={mirror} onChange={setMirror} />
          </ControlSection>
          {/* Elements */}
          <ControlSection title="Elements">
            <Toggle label="Kitchen Bench" checked={showKitchenBench} onChange={setShowKitchenBench} />
            <Toggle label="Island" checked={showIsland} onChange={setShowIsland} />
            {showIsland && (
              <Slider
                label="Island Position"
                value={islandPosition}
                min={1}
                max={roomWidth - 2}
                step={0.1}
                onChange={setIslandPosition}
              />
            )}
            <Toggle label="Human Figure" checked={showHuman} onChange={setShowHuman} />
            {showHuman && (
              <Slider
                label="Human Position"
                value={humanPosition}
                min={-roomWidth / 2 + 0.5}
                max={roomWidth / 2 - 0.5}
                step={0.1}
                onChange={setHumanPosition}
              />
            )}
            <Toggle label="0.9m Line" checked={showDashedLine} onChange={setShowDashedLine} />
          </ControlSection>
          {/* View */}
          <ControlSection title="View">
            <Slider label="Zoom" value={zoom} min={0.5} max={2} step={0.1} unit="x" onChange={setZoom} />
          </ControlSection>
          {/* Divide */}
          <ControlSection title="Divide">
            <Toggle label="Internal Wall" checked={showInternalWall} onChange={setShowInternalWall} />
            {showInternalWall && (
              <Slider
                label="Wall Position"
                value={internalWallPosition}
                min={-roomWidth / 2 + 1}
                max={roomWidth / 2 - 1}
                step={0.1}
                onChange={setInternalWallPosition}
              />
            )}
          </ControlSection>
        </div>
      </div>
    </div>
  );
}
