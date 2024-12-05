#ifdef RCT_NEW_ARCH_ENABLED
#include <reanimated/CSS/interpolation/groups/ObjectPropertiesInterpolator.h>

namespace reanimated {

ObjectPropertiesInterpolator::ObjectPropertiesInterpolator(
    const PropertyInterpolatorFactories &factories,
    const PropertyPath &propertyPath,
    const std::shared_ptr<KeyframeProgressProvider> &progressProvider,
    const std::shared_ptr<ViewStylesRepository> &viewStylesRepository)
    : PropertyInterpolator(
          propertyPath,
          progressProvider,
          viewStylesRepository),
      factories_(factories) {}

jsi::Value ObjectPropertiesInterpolator::getStyleValue(
    jsi::Runtime &rt,
    const ShadowNode::Shared &shadowNode) const {
  return mapInterpolators(rt, [&](PropertyInterpolator &interpolator) {
    return interpolator.getStyleValue(rt, shadowNode);
  });
}

jsi::Value ObjectPropertiesInterpolator::getCurrentValue(
    jsi::Runtime &rt,
    const ShadowNode::Shared &shadowNode) const {
  return mapInterpolators(rt, [&](PropertyInterpolator &interpolator) {
    return interpolator.getCurrentValue(rt, shadowNode);
  });
}

jsi::Value ObjectPropertiesInterpolator::getFirstKeyframeValue(
    jsi::Runtime &rt) const {
  return mapInterpolators(rt, [&](PropertyInterpolator &interpolator) {
    return interpolator.getFirstKeyframeValue(rt);
  });
}

jsi::Value ObjectPropertiesInterpolator::getLastKeyframeValue(
    jsi::Runtime &rt) const {
  return mapInterpolators(rt, [&](PropertyInterpolator &interpolator) {
    return interpolator.getLastKeyframeValue(rt);
  });
}

bool ObjectPropertiesInterpolator::equalsReversingAdjustedStartValue(
    jsi::Runtime &rt,
    const jsi::Value &propertyValue) const {
  const auto propertyValuesObject = propertyValue.asObject(rt);
  const auto propertyNames = propertyValuesObject.getPropertyNames(rt);
  const auto propertiesCount = propertyNames.size(rt);

  for (size_t i = 0; i < propertiesCount; ++i) {
    const auto propertyName =
        propertyNames.getValueAtIndex(rt, i).asString(rt).utf8(rt);
    const auto propertyValue = propertyValuesObject.getProperty(
        rt, jsi::PropNameID::forUtf8(rt, propertyName));

    const auto interpolatorIt = interpolators_.find(propertyName);
    if (interpolatorIt == interpolators_.end() ||
        !interpolatorIt->second->equalsReversingAdjustedStartValue(
            rt, propertyValue)) {
      return false;
    }
  }

  return true;
}

jsi::Value ObjectPropertiesInterpolator::update(
    jsi::Runtime &rt,
    const ShadowNode::Shared &shadowNode) {
  return mapInterpolators(rt, [&](PropertyInterpolator &interpolator) {
    return interpolator.update(rt, shadowNode);
  });
}

jsi::Value ObjectPropertiesInterpolator::reset(
    jsi::Runtime &rt,
    const ShadowNode::Shared &shadowNode) {
  return mapInterpolators(rt, [&](PropertyInterpolator &interpolator) {
    return interpolator.reset(rt, shadowNode);
  });
}

void ObjectPropertiesInterpolator::updateKeyframes(
    jsi::Runtime &rt,
    const jsi::Value &keyframes) {
  // TODO - maybe add a possibility to remove interpolators that are no longer
  // used  (for now, for simplicity, we only add new ones)
  const jsi::Object keyframesObject = keyframes.asObject(rt);

  jsi::Array propertyNames = keyframesObject.getPropertyNames(rt);
  size_t propertiesCount = propertyNames.size(rt);

  for (size_t i = 0; i < propertiesCount; ++i) {
    const std::string propertyName =
        propertyNames.getValueAtIndex(rt, i).asString(rt).utf8(rt);
    const jsi::Value &propertyKeyframes = keyframesObject.getProperty(
        rt, jsi::PropNameID::forUtf8(rt, propertyName));
    auto interpolatorIt = interpolators_.find(propertyName);

    if (interpolatorIt == interpolators_.end()) {
      const auto newInterpolator = createPropertyInterpolator(
          propertyName,
          propertyPath_,
          factories_,
          progressProvider_,
          viewStylesRepository_);
      interpolatorIt =
          interpolators_.emplace(propertyName, newInterpolator).first;
    }

    interpolatorIt->second->updateKeyframes(rt, propertyKeyframes);
  }
}

void ObjectPropertiesInterpolator::updateKeyframesFromStyleChange(
    jsi::Runtime &rt,
    const jsi::Value &oldStyleValue,
    const jsi::Value &newStyleValue) {
  // TODO - maybe add a possibility to remove interpolators that are no longer
  // used  (for now, for simplicity, we only add new ones)
  const jsi::Array propertyNames = newStyleValue.isObject()
      ? newStyleValue.asObject(rt).getPropertyNames(rt)
      : oldStyleValue.asObject(rt).getPropertyNames(rt);
  const size_t propertiesCount = propertyNames.size(rt);

  for (size_t i = 0; i < propertiesCount; ++i) {
    const std::string propertyName =
        propertyNames.getValueAtIndex(rt, i).asString(rt).utf8(rt);
    auto interpolatorIt = interpolators_.find(propertyName);

    if (interpolatorIt == interpolators_.end()) {
      const auto newInterpolator = createPropertyInterpolator(
          propertyName,
          propertyPath_,
          factories_,
          progressProvider_,
          viewStylesRepository_);
      interpolatorIt =
          interpolators_.emplace(propertyName, newInterpolator).first;
    }

    interpolatorIt->second->updateKeyframesFromStyleChange(
        rt,
        oldStyleValue.isObject()
            ? oldStyleValue.asObject(rt).getProperty(rt, propertyName.c_str())
            : jsi::Value::undefined(),
        newStyleValue.isObject()
            ? newStyleValue.asObject(rt).getProperty(rt, propertyName.c_str())
            : jsi::Value::undefined());
  }
}

jsi::Value ObjectPropertiesInterpolator::mapInterpolators(
    jsi::Runtime &rt,
    const std::function<jsi::Value(PropertyInterpolator &)> &callback) const {
  jsi::Object result(rt);

  for (const auto &[propName, interpolator] : interpolators_) {
    jsi::Value value = callback(*interpolator);
    result.setProperty(rt, propName.c_str(), value);
  }

  return result;
}

} // namespace reanimated

#endif // RCT_NEW_ARCH_ENABLED
