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

let IconZichandianjihou: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1256 1024" width={size} height={size} {...rest}>
      <Path
        d="M46.745533 976.533145h1162.144417v-232.284607s-290.716449-58.431842-290.716449-233.005988c0-173.852765 290.716449-232.284607 290.716449-232.284607V46.673336H46.745533v929.859809z"
        fill={getIconColor(color, 0, '#3B28CC')}
      />
      <Path
        d="M46.745533 929.85981h1162.144417v46.673335h-46.673336v-232.284607h46.673336l-9.233674 45.735541a559.286509 559.286509 0 0 1-49.630997-12.984854 670.811976 670.811976 0 0 1-107.485734-42.128637c-47.538993-23.805565-85.411483-51.218035-113.473195-82.237407-38.377457-42.272913-57.566185-89.451215-57.566185-141.390631s19.188728-98.901303 57.566185-141.102078c28.13385-30.875097 66.00634-58.215428 113.545333-81.948855 32.678549-16.375343 68.531173-30.37013 107.413596-42.056499 19.549419-5.915322 36.069038-10.243607 49.630997-12.984854l9.233674 45.807679h-46.673336V46.673336h46.673336v46.601197H46.745533V46.673336h46.601198v929.859809H46.745533z m0 93.274533a46.312645 46.312645 0 0 1-38.810285-20.703628 46.673336 46.673336 0 0 1-7.863051-25.969708V46.673336A46.52906 46.52906 0 0 1 46.745533 0h1162.144417a46.52906 46.52906 0 0 1 46.601198 46.673336v232.284607a46.52906 46.52906 0 0 1-37.439662 45.735541c-10.676435 2.164142-24.38267 5.771046-41.118704 10.820711a579.990137 579.990137 0 0 0-92.553152 36.069039c-79.712575 39.892356-119.604931 86.421416-119.604932 139.659316 0 53.526453 39.892356 100.271927 119.604932 140.236421 27.917436 13.994787 58.720395 26.041846 92.481014 36.213315 16.808172 5.049665 30.514406 8.656569 41.190842 10.820712a46.745474 46.745474 0 0 1 37.5118 45.73554v232.284607a46.312645 46.312645 0 0 1-20.775766 38.738148 46.384783 46.384783 0 0 1-25.969708 7.935188z"
        fill={getIconColor(color, 1, '#3B28CC')}
      />
      <Path
        d="M1208.962088 558.204438h-58.14329a46.601198 46.601198 0 1 1 0-93.346671h58.14329a46.601198 46.601198 0 1 1 0 93.346671z"
        fill={getIconColor(color, 2, '#3B28CC')}
      />
    </Svg>
  );
};

IconZichandianjihou.defaultProps = {
  size: 18,
};

IconZichandianjihou = React.memo ? React.memo(IconZichandianjihou) : IconZichandianjihou;

export default IconZichandianjihou;
