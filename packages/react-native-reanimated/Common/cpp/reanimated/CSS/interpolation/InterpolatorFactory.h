#pragma once
#ifdef RCT_NEW_ARCH_ENABLED

#include <reanimated/CSS/interpolation/groups/ObjectPropertiesInterpolator.h>
#include <reanimated/CSS/interpolation/groups/TransformsStyleInterpolator.h>

#include <reanimated/CSS/interpolation/values/ColorValueInterpolator.h>
#include <reanimated/CSS/interpolation/values/DiscreteStringInterpolator.h>
#include <reanimated/CSS/interpolation/values/NumberStepsInterpolator.h>
#include <reanimated/CSS/interpolation/values/NumericValueInterpolator.h>
#include <reanimated/CSS/interpolation/values/RelativeOrNumericValueInterpolator.h>
#include <reanimated/CSS/interpolation/values/TransformOriginInterpolator.h>

#include <reanimated/CSS/interpolation/transforms/AngleTransformInterpolator.h>
#include <reanimated/CSS/interpolation/transforms/MatrixTransformInterpolator.h>
#include <reanimated/CSS/interpolation/transforms/PerspectiveTransformInterpolator.h>
#include <reanimated/CSS/interpolation/transforms/ScaleTransformInterpolator.h>
#include <reanimated/CSS/interpolation/transforms/TranslateTransformInterpolator.h>

#include <memory>
#include <string>
#include <utility>

namespace reanimated::Interpolators {

/**
 * Generic property interpolators
 * - can be used for multiple properties with the same interpolation behavior
 */

std::shared_ptr<PropertyInterpolatorFactory> object(
    const PropertyInterpolatorFactories &factories);

std::shared_ptr<PropertyInterpolatorFactory> color(
    const std::optional<Color> &defaultValue);
std::shared_ptr<PropertyInterpolatorFactory> color();

std::shared_ptr<PropertyInterpolatorFactory> numeric(
    const std::optional<double> &defaultValue);
std::shared_ptr<PropertyInterpolatorFactory> numeric();

std::shared_ptr<PropertyInterpolatorFactory> steps(
    const std::optional<int> &defaultValue);
std::shared_ptr<PropertyInterpolatorFactory> steps();

std::shared_ptr<PropertyInterpolatorFactory> discrete(
    const std::optional<std::string> &defaultValue);
std::shared_ptr<PropertyInterpolatorFactory> discrete();

std::shared_ptr<PropertyInterpolatorFactory> relOrNum(
    RelativeTo relativeTo,
    const std::string &relativeProperty,
    const std::optional<UnitValue> &defaultValue);
std::shared_ptr<PropertyInterpolatorFactory> relOrNum(
    RelativeTo relativeTo,
    const std::string &relativeProperty,
    double defaultValue);
std::shared_ptr<PropertyInterpolatorFactory> relOrNum(
    RelativeTo relativeTo,
    const std::string &relativeProperty,
    const std::string &defaultValue);
std::shared_ptr<PropertyInterpolatorFactory> relOrNum(
    RelativeTo relativeTo,
    const std::string &relativeProperty);

/**
 * Specific property interpolators
 * - can be used only for a single (specific) property
 */

std::shared_ptr<PropertyInterpolatorFactory> transforms(
    const TransformInterpolatorsMap &interpolators);

std::shared_ptr<PropertyInterpolatorFactory> transformOrigin(
    const TransformOrigin &defaultValue);
std::shared_ptr<PropertyInterpolatorFactory> transformOrigin(
    const std::variant<double, std::string> &x,
    const std::variant<double, std::string> &y,
    double z);

std::shared_ptr<PropertyInterpolatorFactory> display(
    const std::string &defaultValue);

/**
 * Transform interpolators
 * - can be used only within the transforms group interpolator
 */

std::shared_ptr<TransformInterpolator> perspective(double defaultValue);

std::shared_ptr<TransformInterpolator> rotate(const AngleValue &defaultValue);
std::shared_ptr<TransformInterpolator> rotate(const std::string &defaultValue);
std::shared_ptr<TransformInterpolator> rotateX(const AngleValue &defaultValue);
std::shared_ptr<TransformInterpolator> rotateX(const std::string &defaultValue);
std::shared_ptr<TransformInterpolator> rotateY(const AngleValue &defaultValue);
std::shared_ptr<TransformInterpolator> rotateY(const std::string &defaultValue);
std::shared_ptr<TransformInterpolator> rotateZ(const AngleValue &defaultValue);
std::shared_ptr<TransformInterpolator> rotateZ(const std::string &defaultValue);

std::shared_ptr<TransformInterpolator> scale(double defaultValue);
std::shared_ptr<TransformInterpolator> scaleX(double defaultValue);
std::shared_ptr<TransformInterpolator> scaleY(double defaultValue);

std::shared_ptr<TransformInterpolator> translateX(
    RelativeTo relativeTo,
    const std::string &relativeProperty,
    const UnitValue &defaultValue);
std::shared_ptr<TransformInterpolator> translateX(
    RelativeTo relativeTo,
    const std::string &relativeProperty,
    double defaultValue);
std::shared_ptr<TransformInterpolator> translateY(
    RelativeTo relativeTo,
    const std::string &relativeProperty,
    const UnitValue &defaultValue);
std::shared_ptr<TransformInterpolator> translateY(
    RelativeTo relativeTo,
    const std::string &relativeProperty,
    double defaultValue);

std::shared_ptr<TransformInterpolator> skewX(const AngleValue &defaultValue);
std::shared_ptr<TransformInterpolator> skewX(const std::string &defaultValue);
std::shared_ptr<TransformInterpolator> skewY(const AngleValue &defaultValue);
std::shared_ptr<TransformInterpolator> skewY(const std::string &defaultValue);

std::shared_ptr<TransformInterpolator> matrix(
    const TransformMatrix &defaultValue);

} // namespace reanimated::Interpolators

#endif // RCT_NEW_ARCH_ENABLED
