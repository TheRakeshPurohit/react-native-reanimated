#include <reanimated/CSS/interpolation/groups/ObjectPropertiesInterpolator.h>

namespace reanimated {

ObjectPropertiesInterpolator::ObjectPropertiesInterpolator(
    jsi::Runtime &rt,
    const jsi::Object &object,
    const ObjectPropertiesInterpolatorFactories &factories)
    : interpolators_(build(rt, object, factories)) {}

ObjectPropertiesInterpolators ObjectPropertiesInterpolator::build(
    jsi::Runtime &rt,
    const jsi::Object &object,
    const ObjectPropertiesInterpolatorFactories &factories) {
  ObjectPropertiesInterpolators interpolators;

  jsi::Array propertyNames = object.getPropertyNames(rt);
  size_t propertiesCount = propertyNames.size(rt);

  for (size_t i = 0; i < propertiesCount; ++i) {
    std::string propName =
        propertyNames.getValueAtIndex(rt, i).asString(rt).utf8(rt);
    jsi::Value propValue =
        object.getProperty(rt, jsi::PropNameID::forUtf8(rt, propName));

    auto factory = factories.find(propName);
    if (factory == factories.end()) {
      throw std::invalid_argument(
          "[Reanimated] No matching interpolator factory found for property: " +
          propName);
    }

    interpolators[propName] = factory->second(rt, propValue);
  }

  return interpolators;
}

void ObjectPropertiesInterpolator::setStyleValue(
    jsi::Runtime &rt,
    const jsi::Value &value) {
  for (const auto &pair : interpolators_) {
    const std::string &propName = pair.first;
    const std::shared_ptr<Interpolator> &interpolator = pair.second;

    jsi::Value propValue = jsi::Value::undefined();

    if (value.isObject()) {
      propValue = value.asObject(rt).getProperty(rt, propName.c_str());
    }

    interpolator->setStyleValue(rt, propValue);
  }
}

jsi::Value ObjectPropertiesInterpolator::update(
    const InterpolationUpdateContext context) {
  jsi::Runtime &rt = context.rt;
  jsi::Object result(rt);

  for (const auto &pair : interpolators_) {
    const std::string &propName = pair.first;
    const std::shared_ptr<Interpolator> &interpolator = pair.second;

    result.setProperty(rt, propName.c_str(), interpolator->update(context));
  }

  return result;
}

} // namespace reanimated
