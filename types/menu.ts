import { IconType } from "react-icons/lib";

export interface SubMenuItem {
  name: string;
  href: string;
  icon?: IconType;
}

export interface DropdownItem {
  name: string;
  icon?: IconType;
  childrens: SubMenuItem[];
}

export interface MenuItem {
  title: string;
  childrens: {
    dropdowns: DropdownItem[];
  };
}

export type MenuItems = MenuItem[];
