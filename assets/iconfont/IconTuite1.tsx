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

let IconTuite1: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1252 1024" width={size} height={size} {...rest}>
      <Path
        d="M1101.108929 278.777498a659.891681 659.891681 0 0 0-0.739534-31.85684 496.9667 496.9667 0 0 0 125.436306-125.720742A510.164534 510.164534 0 0 1 1081.425953 158.005943 243.477275 243.477275 0 0 0 1192.014696 23.410795c-48.638568 27.476524-102.396985 47.102613-159.625522 57.342312A257.699079 257.699079 0 0 0 848.927909 0.087037c-138.804802-2.161714-251.441485 107.232398-251.441485 244.21681 0 19.512314 2.275489 38.398869 6.54203 56.659665A722.126293 722.126293 0 0 1 85.785935 33.991817 245.752764 245.752764 0 0 0 51.767381 159.371236c0 86.809888 44.372027 163.94895 111.840263 209.458722a253.148102 253.148102 0 0 1-113.888202-32.482599v3.185684c0 121.28354 86.696114 222.940991 201.665173 246.662959-21.048269 5.574947-43.29117 8.533082-66.15983 8.419308a245.183892 245.183892 0 0 1-47.273275-4.835414 252.57923 252.57923 0 0 0 234.773532 174.473085 506.97885 506.97885 0 0 1-312.140142 105.98088c-20.308735 0-40.389922-1.308406-60.016011-3.583895a712.79679 712.79679 0 0 0 385.410874 112.636684c462.2655 0.113774 715.072278-375.057401 715.072278-700.509152z"
        fill={getIconColor(color, 0, '#AEAEAE')}
      />
    </Svg>
  );
};

IconTuite1.defaultProps = {
  size: 18,
};

IconTuite1 = React.memo ? React.memo(IconTuite1) : IconTuite1;

export default IconTuite1;