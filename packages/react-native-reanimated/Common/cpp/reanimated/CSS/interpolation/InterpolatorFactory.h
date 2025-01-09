#pragma once
#ifdef RCT_NEW_ARCH_ENABLED

#include <reanimated/CSS/interpolation/PropertyInterpolator.h>

#include <reanimated/CSS/interpolation/values/ResolvableValueInterpolator.h>
#include <reanimated/CSS/interpolation/values/ValueInterpolator.h>

#include <reanimated/CSS/interpolation/groups/ArrayPropertiesInterpolator.h>
#include <reanimated/CSS/interpolation/groups/RecordPropertiesInterpolator.h>

#include <reanimated/CSS/interpolation/transforms/TransformOperation.h>
#include <reanimated/CSS/interpolation/transforms/TransformOperationInterpolator.h>
#include <reanimated/CSS/interpolation/transforms/TransformsStyleInterpolator.h>

#include <memory>
#include <string>
#include <unordered_map>

namespace reanimated::Interpolators {

// Template class implementations
template <typename... AllowedTypes>
class ValueInterpolatorFactory : public PropertyInterpolatorFactory {
 public:
  template <typename DefaultType>
  explicit ValueInterpolatorFactory(const DefaultType &defaultValue)
      : PropertyInterpolatorFactory(), defaultValue_(defaultValue) {}

  bool isDiscreteProperty() const override {
    // The property is considered discrete if all of the allowed types are
    // discrete
    return (Discrete<AllowedTypes> && ...);
  }

  std::shared_ptr<PropertyInterpolator> create(
      const PropertyPath &propertyPath,
      const std::shared_ptr<KeyframeProgressProvider> &progressProvider,
      const std::shared_ptr<ViewStylesRepository> &viewStylesRepository)
      const override {
    return std::make_shared<ValueInterpolator<AllowedTypes...>>(
        propertyPath, defaultValue_, progressProvider, viewStylesRepository);
  }

 private:
  const CSSValueVariant<AllowedTypes...> defaultValue_;
};

template <typename... AllowedTypes>
class ResolvableValueInterpolatorFactory : public PropertyInterpolatorFactory {
 public:
  template <typename DefaultType>
  explicit ResolvableValueInterpolatorFactory(
      RelativeTo relativeTo,
      const std::string &relativeProperty,
      const DefaultType &defaultValue)
      : PropertyInterpolatorFactory(),
        relativeTo_(relativeTo),
        relativeProperty_(relativeProperty),
        defaultValue_(defaultValue) {}

  std::shared_ptr<PropertyInterpolator> create(
      const PropertyPath &propertyPath,
      const std::shared_ptr<KeyframeProgressProvider> &progressProvider,
      const std::shared_ptr<ViewStylesRepository> &viewStylesRepository)
      const override {
    return std::make_shared<ResolvableValueInterpolator<AllowedTypes...>>(
        propertyPath,
        defaultValue_,
        progressProvider,
        viewStylesRepository,
        relativeTo_,
        relativeProperty_);
  }

 private:
  const RelativeTo relativeTo_;
  const std::string relativeProperty_;
  const CSSValueVariant<AllowedTypes...> defaultValue_;
};

/**
 * Value interpolator factories
 */
template <typename... AllowedTypes>
auto value(const auto &defaultValue) -> std::enable_if_t<
    (std::is_constructible_v<AllowedTypes, decltype(defaultValue)> || ...),
    std::shared_ptr<PropertyInterpolatorFactory>> {
  return std::make_shared<ValueInterpolatorFactory<AllowedTypes...>>(
      CSSValueVariant<AllowedTypes...>(defaultValue));
}

template <typename... AllowedTypes>
auto value(
    RelativeTo relativeTo,
    const std::string &relativeProperty,
    const auto &defaultValue)
    -> std::enable_if_t<
        (std::is_constructible_v<AllowedTypes, decltype(defaultValue)> || ...),
        std::shared_ptr<PropertyInterpolatorFactory>> {
  return std::make_shared<ResolvableValueInterpolatorFactory<AllowedTypes...>>(
      relativeTo,
      relativeProperty,
      CSSValueVariant<AllowedTypes...>(defaultValue));
}

/**
 * Transform operation interpolator factories
 */
template <typename OperationType>
auto transformOp(const auto &defaultValue) -> std::enable_if_t<
    std::is_base_of_v<TransformOperation, OperationType> &&
        std::is_constructible_v<OperationType, decltype(defaultValue)>,
    std::shared_ptr<TransformInterpolator>> {
  return std::make_shared<TransformOperationInterpolator<OperationType>>(
      std::make_shared<OperationType>(defaultValue));
}

template <typename OperationType>
auto transformOp(
    RelativeTo relativeTo,
    const std::string &relativeProperty,
    const auto &defaultValue)
    -> std::enable_if_t<
        std::is_base_of_v<TransformOperation, OperationType> &&
            std::is_constructible_v<OperationType, decltype(defaultValue)> &&
            ResolvableOperation<OperationType>,
        std::shared_ptr<TransformInterpolator>> {
  return std::make_shared<TransformOperationInterpolator<OperationType>>(
      std::make_shared<OperationType>(defaultValue),
      relativeTo,
      relativeProperty);
}

/**
 * Record property interpolator factory
 */
std::shared_ptr<PropertyInterpolatorFactory> record(
    const InterpolatorFactoriesRecord &factories);

/**
 * Array property interpolator factory
 */
std::shared_ptr<PropertyInterpolatorFactory> array(
    const InterpolatorFactoriesArray &factories);

/**
 * Transform interpolators
 */
std::shared_ptr<PropertyInterpolatorFactory> transforms(
    const std::unordered_map<
        std::string,
        std::shared_ptr<TransformInterpolator>> &interpolators);

} // namespace reanimated::Interpolators

#endif // RCT_NEW_ARCH_ENABLED
