interface MaterialColor {
  dot: string;
  bar: string;
  text: string;
}

const MATERIAL_COLORS: Record<string, MaterialColor> = {
  plastic: { dot: "bg-blue-500", bar: "bg-blue-500", text: "text-blue-500" },
  paper: { dot: "bg-yellow-500", bar: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400" },
  glass: { dot: "bg-cyan-500", bar: "bg-cyan-500", text: "text-cyan-600 dark:text-cyan-400" },
  metal: { dot: "bg-zinc-400", bar: "bg-zinc-400", text: "text-zinc-500" },
  organic: { dot: "bg-green-500", bar: "bg-green-500", text: "text-green-600 dark:text-green-400" },
};

const DEFAULT_MATERIAL_COLOR: MaterialColor = { dot: "bg-accent", bar: "bg-accent", text: "text-accent" };

export function getMaterialColor(material: string): MaterialColor {
  return MATERIAL_COLORS[material.toLowerCase()] ?? DEFAULT_MATERIAL_COLOR;
}