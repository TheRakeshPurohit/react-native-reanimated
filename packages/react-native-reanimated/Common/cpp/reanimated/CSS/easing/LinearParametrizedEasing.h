#pragma once

#include <reanimated/CSS/util/algorithms.h>
#include <reanimated/CSS/util/easingFunction.h>

#include <functional>
#include <vector>

double interpolateValue(
    double x,
    std::size_t leftIdx,
    std::vector<double> arrX,
    std::vector<double> arrY);

namespace reanimated {

EasingFunction createLinearEasingFunction(
    std::vector<double> arrX,
    std::vector<double> arrY);

} // namespace reanimated
