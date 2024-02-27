import { OrganizationResource, UserResource } from "@clerk/types";

export type SideNavItem = {
    title: string;
    path: string;
    icon?: JSX.Element;
    submenu?: boolean;
    subMenuItems?: SideNavItem[];
  };

export type MenuItemWithSubMmenuProps = {
  item: SideNavItem;
  toggleOpen: () => void
}

export interface UserInfo {
  user: UserResource | null|undefined,
  organization: OrganizationResource|null|undefined,
}
export interface CompanyInfo {
  company_uuid: string;
  access_token: string;
  refresh_token: string;
}
export type Data = {
  url?: string;
  expires_at?: string;
  status?: number;
}
export type UseStore = {
  companyInfo: CompanyInfo | null,
  userInfo: object ,
  setCompanyInfo: (companyInfo: CompanyInfo) => void;
};
