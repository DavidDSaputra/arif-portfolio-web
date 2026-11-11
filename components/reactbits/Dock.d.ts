import type { CSSProperties, FC, ReactNode } from "react";

/** Tipe untuk React Bits — Dock (sumber: Dock.jsx, tabel props React Bits). */
export type DockMenuItem =
  | { separator: true }
  | {
      separator?: false;
      label: ReactNode;
      onClick?: () => void;
      icon?: ReactNode;
      checked?: boolean;
      disabled?: boolean;
      shortcut?: string;
      items?: DockMenuItem[];
    };

export type DockItemData =
  | { separator: true }
  | {
      separator?: false;
      icon: ReactNode;
      label: string;
      onClick?: () => void;
      className?: string;
      active?: boolean;
      badge?: number | string | boolean;
      menu?: DockMenuItem[];
    };

export interface DockProps {
  items?: DockItemData[];
  position?: "bottom" | "top" | "left" | "right";
  theme?: "dark" | "light";
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
  panelHeight?: number;
  gap?: number;
  roundness?: number;
  spring?: { mass?: number; stiffness?: number; damping?: number };
  bounce?: boolean;
  autoHide?: boolean;
  tiles?: boolean;
  showLabels?: boolean;
  showIndicators?: boolean;
  showBadges?: boolean;
  badgeColor?: string;
  accentColor?: string;
  className?: string;
  style?: CSSProperties;
}

declare const Dock: FC<DockProps>;
export default Dock;
