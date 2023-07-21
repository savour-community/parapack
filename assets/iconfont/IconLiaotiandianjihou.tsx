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

let IconLiaotiandianjihou: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1159 1024" width={size} height={size} {...rest}>
      <Path
        d="M906.520843 725.362906h-380.763501v-36.389068h36.332825v217.097063h-36.332825v-36.389067h299.211496a35.995368 35.995368 0 0 1 25.702942 10.686125l81.552005 81.552005-25.702942 25.702942-25.759185-25.702942 81.552005-81.552005a36.051611 36.051611 0 0 1 25.759185-10.686125h135.545058v36.389067h-36.389068V471.314348h36.389068v36.389067h-217.097063V471.314348h36.332825v217.65949a36.107853 36.107853 0 0 1-16.141673 30.258607 36.164096 36.164096 0 0 1-20.247395 6.130461z m0-72.778135v36.389067h-36.389067V471.314348a36.107853 36.107853 0 0 1 16.141673-30.258606 36.389067 36.389067 0 0 1 20.247394-6.130461h217.097063a36.276582 36.276582 0 0 1 36.332824 36.389067v434.756553a36.389067 36.389067 0 0 1-36.332824 36.389067h-135.545058v-36.389067l25.702943 25.702942-81.552006 81.552006a36.614038 36.614038 0 0 1-39.651147 7.873986 36.164096 36.164096 0 0 1-11.81098-7.873986l-81.552005-81.552006 25.759185-25.702942v36.389067h-299.211496a36.107853 36.107853 0 0 1-30.258606-16.197915 36.389067 36.389067 0 0 1-6.130461-20.191152v-217.097063a36.332824 36.332824 0 0 1 36.389067-36.389067z"
        fill={getIconColor(color, 0, '#3B28CC')}
      />
      <Path
        d="M36.44531 688.80511h136.107485l108.548531 108.548531 108.548531-108.548531h516.870986V36.389067H36.44531v652.416043z"
        fill={getIconColor(color, 1, '#3B28CC')}
      />
      <Path
        d="M36.44531 652.416043h136.107485a35.995368 35.995368 0 0 1 25.702942 10.686125l108.548531 108.548531-25.702942 25.702942-25.759185-25.759185 108.548531-108.548531a35.995368 35.995368 0 0 1 25.759185-10.629882h516.870986v36.389067h-36.389067V36.389067h36.389067v36.332825H36.44531V36.389067h36.332824v652.416043H36.44531z m0 72.721892a36.107853 36.107853 0 0 1-30.258606-16.141673 36.389067 36.389067 0 0 1-6.130461-20.247395V36.389067A36.276582 36.276582 0 0 1 36.44531 0h870.075533a36.276582 36.276582 0 0 1 36.332825 36.389067v652.416043a36.107853 36.107853 0 0 1-16.141673 30.202363 36.164096 36.164096 0 0 1-20.247395 6.186704h-516.870985v-36.389067l25.759185 25.702943-108.548532 108.548531a36.389067 36.389067 0 0 1-51.462127 0l-108.548531-108.548531 25.759185-25.702943v36.332825z"
        fill={getIconColor(color, 2, '#3B28CC')}
      />
      <Path
        d="M444.205337 326.208021h27.165254a36.276582 36.276582 0 0 1 35.657911 43.475656 36.276582 36.276582 0 0 1-35.657911 29.246236h-27.165254a36.332824 36.332824 0 1 1 0-72.721892zM634.474602 326.208021h27.165254a36.276582 36.276582 0 0 1 25.759185 62.09201 36.501553 36.501553 0 0 1-25.759185 10.686125h-27.165254a36.389067 36.389067 0 1 1 0-72.778135zM253.879829 326.208021h27.221497a36.276582 36.276582 0 0 1 35.657911 43.475656 36.276582 36.276582 0 0 1-35.657911 29.246236h-27.221497a36.332824 36.332824 0 1 1 0-72.721892z"
        fill={getIconColor(color, 3, '#FFFFFF')}
      />
    </Svg>
  );
};

IconLiaotiandianjihou.defaultProps = {
  size: 18,
};

IconLiaotiandianjihou = React.memo ? React.memo(IconLiaotiandianjihou) : IconLiaotiandianjihou;

export default IconLiaotiandianjihou;