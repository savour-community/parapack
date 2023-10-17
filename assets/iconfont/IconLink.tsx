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

let IconLink: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M833.535541 117.541135a51.565641 51.565641 0 0 0-72.923325 0L578.340477 299.812875a51.565641 51.565641 0 0 0 0 72.996467l72.923324 72.923324a51.565641 51.565641 0 0 0 72.923324 0L906.532008 263.314641a51.565641 51.565641 0 0 0 0-72.996467l-72.923325-72.850182z m72.55761-72.338182l72.703896 72.703896a154.331208 154.331208 0 0 1 0 218.257974l-181.832883 181.832883a154.331208 154.331208 0 0 1-218.257974 0l-72.703896-72.703896a154.331208 154.331208 0 0 1 0-218.257974L687.835177 45.202953a154.331208 154.331208 0 0 1 218.257974 0zM372.736199 578.267334a51.565641 51.565641 0 0 0-72.923324 0L117.467992 760.685359a51.565641 51.565641 0 0 0 0 72.996467l72.923325 72.850182a51.565641 51.565641 0 0 0 72.996467 0l182.271739-182.27174a51.565641 51.565641 0 0 0 0-72.996467l-72.923324-72.923324z m72.557611-72.26504l72.703896 72.703896a154.331208 154.331208 0 0 1 0 218.257974l-181.832883 181.832883a154.331208 154.331208 0 0 1-218.257974 0l-72.703896-72.703896a154.331208 154.331208 0 0 1 0-218.257974l181.832883-181.832883a154.331208 154.331208 0 0 1 218.257974 0z"
        fill={getIconColor(color, 0, '#1F9BF0')}
      />
      <Path
        d="M401.9933 614.399854l-60.708485-60.708485 212.479697-212.333411 60.635342 60.708485z"
        fill={getIconColor(color, 1, '#1F9BF0')}
      />
    </Svg>
  );
};

IconLink.defaultProps = {
  size: 18,
};

IconLink = React.memo ? React.memo(IconLink) : IconLink;

export default IconLink;
