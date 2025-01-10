export interface NavigationItem {
  id: string;
  title: string;
  type: 'collapsable' | 'item';
  borderClass?: string;
  hoverClass?: string;
  activeClass?: string;
  collapsed?: boolean;
  translate?: string;
  url?: string;
  permission: string;
  callback?: any;
  children?: NavigationItem[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
