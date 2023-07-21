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

let IconBukejian: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1433 1024" width={size} height={size} {...rest}>
      <Path
        d="M999.079306 812.916096c-84.638249 46.05467-175.724152 78.907001-279.807705 78.907001C452.359202 891.823097 217.992104 654.99975 140.006197 562.89041c51.990605-59.257009 182.171806-197.421018 351.448303-269.778022L387.268602 194.453051C218.094448 286.562391 94.360902 418.176403 29.270301 490.533407c-38.992954 46.05467-38.992954 105.209335 0 151.264004C133.456199 753.659088 393.8186 1023.43711 719.271601 1023.43711c143.178852 0 266.810054-52.604667 377.443606-118.411674l-97.635901-92.10934z m410.09125-328.932687C1304.882315 372.121733 1044.622258 102.343711 719.271601 102.343711c-58.642946 0-117.183549 6.549998-169.276498 26.302334L660.628654 240.507721c19.547649-6.549998 39.095298-6.549998 58.642947-6.549998 266.810054 0 501.177153 236.823347 579.265404 328.932687-32.5453 39.504672-91.085903 98.659337-162.726501 157.916346l91.085903 92.10934c78.088251-65.807006 143.281195-131.614012 175.724152-177.668682 39.095298-39.504672 39.095298-105.209335 6.549997-151.264005z"
        fill={getIconColor(color, 0, '#A3ADFF')}
      />
      <Path
        d="M716.405977 511.718555m-204.687422 0a204.687422 204.687422 0 1 0 409.374844 0 204.687422 204.687422 0 1 0-409.374844 0Z"
        fill={getIconColor(color, 1, '#A3ADFF')}
      />
      <Path
        d="M1116.774574 1003.480086L225.565539 117.695268a66.625756 66.625756 0 0 1 0-96.919495 67.546849 67.546849 0 0 1 97.431213 0l884.249662 878.92779a66.625756 66.625756 0 0 1 0 96.817151c-20.878117 34.592174-69.593723 34.592174-90.47184 6.959372z"
        fill={getIconColor(color, 2, '#FFFFFF')}
      />
    </Svg>
  );
};

IconBukejian.defaultProps = {
  size: 18,
};

IconBukejian = React.memo ? React.memo(IconBukejian) : IconBukejian;

export default IconBukejian;