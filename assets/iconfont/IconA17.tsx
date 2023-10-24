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

let IconA17: FunctionComponent<Props> = ({ size, color, ...rest }) => {
  return (
    <Svg viewBox="0 0 1024 1024" width={size} height={size} {...rest}>
      <Path
        d="M615.857231 106.338462c74.082462 112.088615 115.633231 231.187692 124.573538 357.533538h184.280616A408.024615 408.024615 0 0 0 825.107692 236.701538C768.393846 171.52 698.683077 128 615.817846 106.338462h0.039385z m-105.747693 11.933538c-10.712615 14.060308-20.913231 28.514462-30.562461 43.323077-9.767385 15.163077-20.873846 34.264615-33.319385 57.383385-12.248615 22.882462-23.197538 46.434462-32.807384 70.537846-9.412923 23.630769-17.92 51.003077-25.521231 81.723077-7.483077 30.444308-12.484923 61.44-14.966154 92.632615h274.471385a572.179692 572.179692 0 0 0-15.005539-92.790154 643.032615 643.032615 0 0 0-25.521231-81.998769 713.649231 713.649231 0 0 0-32.610461-70.380308 705.575385 705.575385 0 0 0-33.319385-57.225846 700.928 700.928 0 0 0-30.759384-43.204923h-0.07877zM924.750769 556.504615h-184.32c-8.900923 126.188308-50.412308 245.444923-124.534154 357.336616 82.786462-21.661538 152.576-65.142154 209.250462-130.284308 56.753231-65.142154 89.954462-140.8 99.643077-227.052308h-0.039385zM404.361846 106.338462c-82.747077 21.700923-152.576 65.181538-209.250461 130.363076a407.315692 407.315692 0 0 0-99.603693 227.170462h184.674462c8.507077-126.030769 49.860923-245.169231 124.179692-357.494154z m243.003077 450.166153h-274.510769c2.520615 31.271385 7.522462 62.306462 15.044923 92.790154 7.601231 30.877538 16.147692 58.210462 25.521231 81.998769 9.412923 23.788308 20.243692 47.143385 32.610461 70.380308 12.327385 23.236923 23.433846 42.220308 33.240616 57.225846 9.767385 14.690462 20.086154 29.065846 30.798769 43.047385 10.830769-13.981538 21.070769-28.396308 30.759384-43.204923 9.885538-15.123692 21.031385-34.264615 33.319385-57.501539 12.169846-22.843077 23.04-46.316308 32.571077-70.380307 9.452308-23.788308 17.959385-50.963692 25.521231-81.880616 7.561846-30.326154 12.603077-61.282462 15.005538-92.475077h0.118154z m-367.182769 0H95.507692c9.649231 86.252308 42.850462 161.870769 99.603693 227.052308 56.674462 65.142154 126.503385 108.622769 209.250461 130.284308C372.972308 866.461538 345.678769 812.425846 322.402462 752.246154c-23.236923-60.179692-37.376-125.479385-42.220308-195.741539zM510.109538 0.275692c8.664615 0 15.202462 0.157538 19.574154 0.433231 44.898462 1.693538 88.536615 9.058462 130.914462 22.252308 42.338462 13.154462 81.526154 30.877538 117.484308 52.972307a510.188308 510.188308 0 0 1 99.052307 80.147693 514.835692 514.835692 0 0 1 76.406154 102.006154c20.873846 36.667077 37.139692 76.603077 48.836923 119.689846a503.729231 503.729231 0 0 1 17.565539 132.411077c0 45.056-5.868308 89.245538-17.526154 132.292923a513.063385 513.063385 0 0 1-48.876308 119.689846 514.835692 514.835692 0 0 1-76.406154 102.006154 510.424615 510.424615 0 0 1-99.052307 80.147692 510.503385 510.503385 0 0 1-117.484308 52.972308 503.020308 503.020308 0 0 1-130.914462 22.370461c-4.332308 0.275692-10.870154 0.275692-19.574154 0.275693-8.664615 0-15.202462 0-19.534769-0.275693a503.020308 503.020308 0 0 1-130.953846-22.370461 510.503385 510.503385 0 0 1-117.484308-52.972308 510.109538 510.109538 0 0 1-99.052307-80.187077 514.284308 514.284308 0 0 1-76.36677-102.006154 514.284308 514.284308 0 0 1-48.876307-119.650461 503.453538 503.453538 0 0 1-17.565539-132.292923c0-45.174154 5.907692-89.403077 17.565539-132.411077a513.969231 513.969231 0 0 1 48.876307-119.729231 514.284308 514.284308 0 0 1 76.406154-101.966769 510.345846 510.345846 0 0 1 99.012923-80.147693C278.134154 53.838769 317.282462 36.155077 359.620923 22.961231a502.705231 502.705231 0 0 1 130.953846-22.252308c4.332308-0.275692 10.870154-0.393846 19.574154-0.393846z"
        fill={getIconColor(color, 0, '#000000')}
      />
    </Svg>
  );
};

IconA17.defaultProps = {
  size: 18,
};

IconA17 = React.memo ? React.memo(IconA17) : IconA17;

export default IconA17;
