#include <reanimated/CSS/interpolation/values/NumericValueInterpolator.h>

namespace reanimated {

double NumericValueInterpolator::prepareKeyframeValue(
    jsi::Runtime &rt,
    const jsi::Value &value) const {
  return value.asNumber();
}

double NumericValueInterpolator::interpolateBetweenKeyframes(
    double localProgress,
    const double &fromValue,
    const double &toValue,
    const InterpolationUpdateContext context) const {
  return fromValue + localProgress * (toValue - fromValue);
}

} // namespace reanimated
