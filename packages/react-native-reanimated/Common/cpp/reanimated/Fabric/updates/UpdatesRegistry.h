#pragma once
#ifdef RCT_NEW_ARCH_ENABLED

#include <reanimated/Fabric/ShadowTreeCloner.h>

#include <react/renderer/core/ShadowNode.h>

#include <jsi/jsi.h>
#include <memory>
#include <unordered_map>
#include <unordered_set>
#include <utility>
#include <vector>

namespace reanimated {

using namespace facebook;
using namespace react;

enum class FlushUpdatesMode {
  // Default merging: batch changes are merged into the registry
  // without removing existing entries.
  MergeAll,
  // Batch merging/replacing: batch changes are merged
  // first, then replace corresponding registry entries.
  ReplaceByMergedBatch,
  // Default replacing: the latest value from the batch completely
  // replaces any existing registry entries.
  ReplaceByLatest
};
using UpdatesBatch =
    std::vector<std::pair<ShadowNode::Shared, std::unique_ptr<jsi::Value>>>;

using RegistryMap =
    std::unordered_map<Tag, std::pair<ShadowNode::Shared, folly::dynamic>>;

class UpdatesRegistry {
 public:
  void flushUpdates(
      jsi::Runtime &rt,
      UpdatesBatch &updatesBatch,
      FlushUpdatesMode mode);
  void collectProps(PropsMap &propsMap);
  folly::dynamic get(Tag tag) const;

 protected:
  mutable std::mutex mutex_;

  UpdatesBatch updatesBatch_;
  std::unordered_set<Tag> tagsToRemove_;
  RegistryMap updatesRegistry_;

  void flushUpdatesToRegistry(
      jsi::Runtime &rt,
      const UpdatesBatch &updatesBatch,
      FlushUpdatesMode mode);

 private:
  void runMarkedRemovals();
};

} // namespace reanimated

#endif // RCT_NEW_ARCH_ENABLED
