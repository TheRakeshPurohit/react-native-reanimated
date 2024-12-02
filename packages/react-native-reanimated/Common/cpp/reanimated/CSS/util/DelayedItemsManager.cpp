#ifdef RCT_NEW_ARCH_ENABLED
#include <reanimated/CSS/util/DelayedItemsManager.h>

namespace reanimated {

template <typename Identifier>
DelayedItem<Identifier>::DelayedItem(double timestamp, Identifier id)
    : timestamp(timestamp), id(id) {}

template <typename Identifier>
std::ostream &operator<<(
    std::ostream &os,
    const DelayedItem<Identifier> &item) {
  os << "DelayedItem(" << item.timestamp << ", " << item.id << ")";
  return os;
}

template <typename Identifier>
bool DelayedItemComparator<Identifier>::operator()(
    const DelayedItem<Identifier> &lhs,
    const DelayedItem<Identifier> &rhs) const {
  if (lhs.timestamp != rhs.timestamp) {
    return lhs.timestamp < rhs.timestamp;
  }
  return lhs.id < rhs.id;
}

template <typename Identifier>
void DelayedItemsManager<Identifier>::add(
    const double timestamp,
    const Identifier id) {
  auto result = items_.emplace(timestamp, id);
  if (result.second) {
    itemMap_[result.first->id] = result.first;
  }
}

template <typename Identifier>
typename DelayedItemsManager<Identifier>::Item
DelayedItemsManager<Identifier>::pop() {
  if (items_.empty()) {
    throw std::runtime_error("[Reanimated] No delayed items available to pop");
  }
  auto it = items_.begin();
  Item result = std::move(*it);
  itemMap_.erase(it->id);
  items_.erase(it);
  return result;
}

template <typename Identifier>
bool DelayedItemsManager<Identifier>::remove(const Identifier &id) {
  auto mapIt = itemMap_.find(id);
  if (mapIt != itemMap_.end()) {
    items_.erase(mapIt->second);
    itemMap_.erase(mapIt);
    return true;
  }
  return false;
}

template <typename Identifier>
const typename DelayedItemsManager<Identifier>::Item &
DelayedItemsManager<Identifier>::top() const {
  if (items_.empty()) {
    throw std::runtime_error("[Reanimated] No delayed items available");
  }
  return *items_.begin();
}

template <typename Identifier>
bool DelayedItemsManager<Identifier>::empty() const {
  return items_.empty();
}

template <typename Identifier>
size_t DelayedItemsManager<Identifier>::size() const {
  return items_.size();
}

// Declare the types that will be used in the DelayedItemsManager class
template class DelayedItemsManager<CSSAnimationId>;
template class DelayedItemsManager<Tag>;
template struct DelayedItem<CSSAnimationId>;
template struct DelayedItem<Tag>;
template struct DelayedItemComparator<CSSAnimationId>;
template struct DelayedItemComparator<Tag>;

} // namespace reanimated

#endif // RCT_NEW_ARCH_ENABLED
