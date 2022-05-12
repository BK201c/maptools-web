import { MenuItem } from "@/interface";

/**
 * 侧边栏导航
 * icon:https://www.antdv.com/components/icon-cn
 */
export const baseRouter: Array<MenuItem> = [
  {
    meta: {
      title: "首页",
      icon: "HomeOutlined",
    },
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/dashboard/index.vue"),
  },
  {
    meta: {
      title: "3D",
      icon: "experiment-outlined",
    },
    path: "/threeD",
    name: "threeD",
    component: () => import("@/views/threeD/index.vue"),
  },
  {
    meta: {
      title: "关于",
      icon: "SettingOutlined",
    },
    path: "/about",
    name: "about",
    component: () => import("@/views/about/index.vue"),
  },
];
