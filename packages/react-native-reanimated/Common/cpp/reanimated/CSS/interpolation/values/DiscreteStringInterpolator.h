#pragma once
#ifdef RCT_NEW_ARCH_ENABLED

#include <reanimated/CSS/interpolation/values/ValueInterpolator.h>

#include <string>

namespace reanimated {

/**
 * Generic discrete string interpolator
 */

class DiscreteStringInterpolator : public ValueInterpolator<std::string> {
 public:
  using ValueInterpolator<std::string>::ValueInterpolator;

 protected:
  std::string prepareKeyframeValue(jsi::Runtime &rt, const jsi::Value &value)
      const override;

  jsi::Value convertResultToJSI(jsi::Runtime &rt, const std::string &value)
      const override;

  std::string interpolate(
      double progress,
      const std::string &fromValue,
      const std::string &toValue,
      const ValueInterpolatorUpdateContext &context) const override;
};

/**
 * Specific discrete string interpolators
 */

class DisplayInterpolator : public DiscreteStringInterpolator {
 public:
  using DiscreteStringInterpolator::DiscreteStringInterpolator;

 protected:
  std::string interpolate(
      double progress,
      const std::string &fromValue,
      const std::string &toValue,
      const ValueInterpolatorUpdateContext &context) const override;
};

} // namespace reanimated

#endif // RCT_NEW_ARCH_ENABLED
