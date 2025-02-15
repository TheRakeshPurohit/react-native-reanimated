#pragma once
#ifdef RCT_NEW_ARCH_ENABLED

#include <reanimated/CSS/common/definitions.h>
#include <reanimated/CSS/registry/StaticPropsRegistry.h>
#include <reanimated/Fabric/updates/AnimatedPropsRegistry.h>

#include <react/renderer/components/view/ViewProps.h>
#include <react/renderer/core/LayoutableShadowNode.h>
#include <react/renderer/dom/DOM.h>

#include <map>
#include <memory>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

namespace reanimated {

using namespace facebook;
using namespace react;

struct CachedShadowNode {
  LayoutMetrics layoutMetrics;
  std::shared_ptr<const ViewProps> viewProps;
};

class ViewStylesRepository {
 public:
  ViewStylesRepository(
      const std::shared_ptr<StaticPropsRegistry> &staticPropsRegistry,
      const std::shared_ptr<AnimatedPropsRegistry> &animatedPropsRegistry);

  void setUIManager(const std::shared_ptr<UIManager> &uiManager) {
    uiManager_ = uiManager;
  }

  jsi::Value getNodeProp(
      const ShadowNode::Shared &shadowNode,
      const std::string &propName);
  jsi::Value getParentNodeProp(
      const ShadowNode::Shared &shadowNode,
      const std::string &propName);
  folly::dynamic getStyleProp(Tag tag, const PropertyPath &propertyPath);

  void clearNodesCache();

 private:
  std::shared_ptr<UIManager> uiManager_;
  std::shared_ptr<StaticPropsRegistry> staticPropsRegistry_;
  std::shared_ptr<AnimatedPropsRegistry> animatedPropsRegistry_;

  std::unordered_map<int, CachedShadowNode> shadowNodeCache_;

  void updateCacheIfNeeded(
      CachedShadowNode &cachedNode,
      const ShadowNode::Shared &shadowNode);

  static folly::dynamic getPropertyValue(
      const folly::dynamic &value,
      const PropertyPath &propertyPath);
};

} // namespace reanimated

#endif // RCT_NEW_ARCH_ENABLED
