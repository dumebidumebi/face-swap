import { Icon } from '@iconify/react';
import { SideNavItem } from './types';
import { BadgePlus, CircleDollarSign, Folder, Mic2, PersonStanding} from 'lucide-react';


export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Explore',
    path: '/',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-telescope"><path d="m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44"/><path d="m13.56 11.747 4.332-.924"/><path d="m16 21-3.105-6.21"/><path d="M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z"/><path d="m6.158 8.633 1.114 4.456"/><path d="m8 21 3.105-6.21"/><circle cx="12" cy="13" r="2"/></svg>
  },
  {
    title: 'Create',
    path: '/create',
    icon: <BadgePlus />,
    submenu: true,
    subMenuItems: [
      { title: 'Face Swap', path: '/create/face-swap' },
      { title: 'Lip Sync', path: '/create/lip-sync' },
    ],
  },  {
    title: 'Library',
    path: '/library',
    icon: <Folder/>
  },
  {
    title: 'Avatars',
    path: '/avatars',
    icon: <PersonStanding/>
  },
  {
    title: 'Affiliate',
    path: 'https://createdeepakes.tolt.io/login',
    icon: <CircleDollarSign/>
  },
];

export const PRODUCT_ITEMS = [
  {
    title: '50 Credits',
    credits: 50,
    description: 'About 50 videos',
    cost: '$10',
    priceId: 'price_1PBGUbI5A32hK8RPTRnrLuKS'
  },
  {
    title: '100 Credits',
    credits: 100,
    description: 'About 100 videos',
    cost: '$20',
    priceId: 'price_1PBGXoI5A32hK8RPEEB0MEM3'
  },  
  {
    title: '500 Credits',
    credits: 500,
    description: 'For large video needs',
    cost: '$80',
    priceId: 'price_1PBGYrI5A32hK8RP81RZZggE'
  },
];

export const AVATARS = [
  {
    title: 'MKBeeHD',
    videoUrl: 'https://upcdn.io/12a1yvy/raw/uploads/2024/05/mkbhd-usable.mp4',
    customThumbnail: 'https://upcdn.io/12a1yvy/raw/Screenshot%202024-05-22%20at%2023.20.36.png?w=300&h=3=200&f=webp&fit=crop',
    createdBy: 'cd team',
    gender: 'male'
  },
  {
    title: 'Leebron',
    videoUrl: 'https://upcdn.io/12a1yvy/raw/lebron%20talk%202-4hrb.mp4',
    customThumbnail: 'https://upcdn.io/12a1yvy/image/lebron.webp?w=300&h=200&f=webp&fit=crop',
    createdBy: 'cd team',
    gender: 'male'
  },
  {
    title: 'Mark Goldbridge',
    videoUrl: 'https://upcdn.io/12a1yvy/raw/goldbridge%20talking.mp4',
    customThumbnail: 'https://upcdn.io/12a1yvy/raw/Screenshot%202024-05-22%20at%2023.17.41.png?w=300&h=200&f=webp&fit=crop',
    createdBy: 'cd team',
    gender: 'male'
  },
];