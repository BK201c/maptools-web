import { h, VNode } from "vue";
import * as $Icon from "@ant-design/icons-vue";

/**
 *
 * @param props
 * @returns
 */
export const AntIcon = (props: { icon: string }): VNode => {
  const { icon } = props;
  const iconMapper: { [key: string]: any } = $Icon;
  return h(iconMapper[icon]);
};

export default AntIcon;
