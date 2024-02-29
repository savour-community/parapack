/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import { ViewProps } from 'react-native';
import { Svg, GProps, Path } from 'react-native-svg';
import { getIconColor } from './helper';

interface Props extends GProps, ViewProps {
  size?: number;
  color?: string | string[];
}

let IconXingzhuangjiehe1: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M512 0c282.624 0 512 229.376 512 512S794.624 1024 512 1024 0 794.624 0 512 229.376 0 512 0z m59.029333 290.176l-2.922666-0.021333c-13.568 0.469333-25.301333 8.085333-29.226667 24.426666v378.197334l-0.064 2.624c0 6.357333 1.194667 12.650667 3.498667 18.602666 4.949333 12.458667 14.677333 19.861333 30.250666 19.861334l3.349334-0.106667c16.149333-1.109333 24.277333-10.453333 26.709333-25.685333 0.768-4.992 0.96-9.386667 0.768-16.704V400l43.605333 41.408 1.664 1.557333c5.738667 4.949333 13.077333 7.68 20.522667 7.573334l2.794667-0.192c6.528-0.725333 12.992-3.669333 18.410666-9.28l1.728-1.941334 1.557334-2.218666c11.733333-17.450667 5.290667-35.968-9.6-50.773334l-78.314667-77.269333-2.24-2.154667c-7.04-6.613333-16.704-13.674667-23.466667-15.232a44.949333 44.949333 0 0 0-9.024-1.301333z m-135.061333-0.021333l-2.517333 0.064-2.069334 0.256-2.133333 0.426666c-12.074667 3.264-23.509333 17.216-23.509333 29.162667v294.293333l-37.930667-40.32-1.578667-1.344a20.842667 20.842667 0 0 0-12.522666-3.498666l-2.88 0.149333c-7.744 0.768-15.786667 4.288-20.8 9.664-9.173333 10.517333-6.208 35.008 0.682666 42.389333l74.453334 78.890667c6.229333 6.250667 16.426667 14.016 22.912 15.104l2.474666 0.597333c20.352 4.224 36.757333-8.661333 36.693334-24.085333V318.250667c-1.408-11.733333-15.701333-25.621333-28.693334-27.818667l-2.581333-0.277333z"
        fill={getIconColor(color, 0, '#DBDBDB')}
      />
    </Svg>
  );
};

IconXingzhuangjiehe1.defaultProps = {
  size: 18,
};

IconXingzhuangjiehe1 = React.memo ? React.memo(IconXingzhuangjiehe1) : IconXingzhuangjiehe1;

export default IconXingzhuangjiehe1;
