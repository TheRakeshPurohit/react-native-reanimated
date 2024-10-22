#include <reanimated/CSS/interpolation/values/RelativeOrNumericValueInterpolator.h>

namespace reanimated {

RelativeOrNumericValueInterpolator::RelativeOrNumericValueInterpolator(
    const RelativeTo relativeTo,
    const std::string &relativeProperty,
    const std::optional<UnitValue> &defaultValue,
    const std::shared_ptr<ViewStylesRepository> &viewStylesRepository,
    const PropertyPath &propertyPath)
    : ValueInterpolator<UnitValue>(
          defaultValue,
          viewStylesRepository,
          propertyPath),
      relativeTo_(relativeTo),
      relativeProperty_(relativeProperty),
      viewStylesRepository_(viewStylesRepository) {};

UnitValue RelativeOrNumericValueInterpolator::prepareKeyframeValue(
    jsi::Runtime &rt,
    const jsi::Value &value) const {
  return UnitValue(rt, value);
}

jsi::Value RelativeOrNumericValueInterpolator::convertResultToJSI(
    jsi::Runtime &rt,
    const UnitValue &value) const {
  if (value.isRelative) {
    return jsi::String::createFromUtf8(
        rt, std::to_string(value.value * 100) + "%");
  }
  return jsi::Value(value.value);
}

UnitValue RelativeOrNumericValueInterpolator::interpolate(
    const double localProgress,
    const UnitValue &fromValue,
    const UnitValue &toValue,
    const PropertyInterpolationUpdateContext context) const {
  if (localProgress == 0) {
    return fromValue;
  }
  if (localProgress == 1) {
    return toValue;
  }
  // If both value types are the same, we can interpolate without reading the
  // relative value from the shadow node
  // (also, when one of the values is 0, and the other is relative)
  if ((fromValue.isRelative == toValue.isRelative) ||
      (fromValue.isRelative && toValue.value == 0) ||
      (toValue.isRelative && fromValue.value == 0)) {
    return {
        fromValue.value + (toValue.value - fromValue.value) * localProgress,
        fromValue.isRelative || toValue.isRelative};
  }
  // Otherwise, we need to read the relative value from the shadow node and
  // interpolate values as numbers
  const auto from = resolveValue(fromValue, context.node);
  const auto to = resolveValue(toValue, context.node);

  if (!from.has_value() || !to.has_value()) {
    return localProgress < 0.5 ? fromValue : toValue;
  }
  return {from.value() + (to.value() - from.value()) * localProgress};
}

std::optional<double> RelativeOrNumericValueInterpolator::resolveValue(
    const UnitValue &value,
    const ShadowNode::Shared &shadowNode) const {
  return viewStylesRepository_->resolveUnitValue(
      value, shadowNode, relativeTo_, relativeProperty_);
}

} // namespace reanimated
