#pragma once
#ifdef RCT_NEW_ARCH_ENABLED

#include <reanimated/CSS/config/CSSTransitionConfig.h>
#include <reanimated/CSS/easing/EasingFunctions.h>
#include <reanimated/CSS/interpolation/TransitionStyleInterpolator.h>
#include <reanimated/CSS/progress/TransitionProgressProvider.h>

#include <memory>
#include <string>
#include <unordered_set>
#include <utility>

namespace reanimated {

class CSSTransition {
 public:
  CSSTransition(
      ShadowNode::Shared shadowNode,
      const CSSTransitionConfig &config,
      const std::shared_ptr<ViewStylesRepository> &viewStylesRepository);

  Tag getViewTag() const {
    return shadowNode_->getTag();
  }
  ShadowNode::Shared getShadowNode() const {
    return shadowNode_;
  }
  const TransitionProperties &getProperties() const {
    return properties_;
  }
  double getMinDelay(double timestamp) const {
    return progressProvider_.getMinDelay(timestamp);
  }
  TransitionProgressState getState() const {
    return progressProvider_.getState();
  }
  jsi::Value getCurrentInterpolationStyle(jsi::Runtime &rt) const {
    return styleInterpolator_.getCurrentInterpolationStyle(rt, shadowNode_);
  }

  void updateSettings(const PartialCSSTransitionConfig &config);

  jsi::Value
  run(jsi::Runtime &rt, const ChangedProps &changedProps, double timestamp);
  jsi::Value update(jsi::Runtime &rt, double timestamp);

 private:
  const ShadowNode::Shared shadowNode_;
  TransitionProperties properties_;

  const std::shared_ptr<ViewStylesRepository> viewStylesRepository_;
  TransitionProgressProvider progressProvider_;
  TransitionStyleInterpolator styleInterpolator_;

  void updateTransitionProperties(const TransitionProperties &properties);
};

} // namespace reanimated

#endif // RCT_NEW_ARCH_ENABLED
