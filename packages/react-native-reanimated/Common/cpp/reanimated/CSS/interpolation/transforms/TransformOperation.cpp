#ifdef RCT_NEW_ARCH_ENABLED
#include <reanimated/CSS/interpolation/transforms/TransformOperation.h>
namespace reanimated {

constexpr std::array<const char *, 14> transformOperationStrings = {
    "perspective",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scaleX",
    "scaleY",
    "translateX",
    "translateY",
    "skewX",
    "skewY",
    "matrix"};

TransformOperationType getTransformOperationType(const std::string &property) {
  static const std::unordered_map<std::string, TransformOperationType>
      stringToEnumMap = {
          {"perspective", TransformOperationType::Perspective},
          {"rotate", TransformOperationType::Rotate},
          {"rotateX", TransformOperationType::RotateX},
          {"rotateY", TransformOperationType::RotateY},
          {"rotateZ", TransformOperationType::RotateZ},
          {"scale", TransformOperationType::Scale},
          {"scaleX", TransformOperationType::ScaleX},
          {"scaleY", TransformOperationType::ScaleY},
          {"translateX", TransformOperationType::TranslateX},
          {"translateY", TransformOperationType::TranslateY},
          {"skewX", TransformOperationType::SkewX},
          {"skewY", TransformOperationType::SkewY},
          {"matrix", TransformOperationType::Matrix}};

  auto it = stringToEnumMap.find(property);
  if (it != stringToEnumMap.end()) {
    return it->second;
  } else {
    throw std::invalid_argument(
        "[Reanimated] Unknown transform operation: " + property);
  }
}

std::string getOperationNameFromType(const TransformOperationType type) {
  return transformOperationStrings[static_cast<size_t>(type)];
}

TransformOperation::TransformOperation(const TransformOperationType type)
    : type(type) {}

std::ostream &operator<<(
    std::ostream &os,
    const TransformOperation &operation) {
  os << operation.getOperationName() << "(" << operation.getOperationValue()
     << ")";
  return os;
}

bool TransformOperation::canConvertTo(
    const TransformOperationType targetType) const {
  return false;
}

void TransformOperation::assertCanConvertTo(
    const TransformOperationType targetType) const {
  if (!canConvertTo(targetType)) {
    throw std::invalid_argument(
        "[Reanimated] Cannot convert transform operation to type: " +
        getOperationNameFromType(targetType));
  }
}

TransformOperations TransformOperation::convertTo(
    const TransformOperationType targetType) const {
  throw std::invalid_argument(
      "[Reanimated] Cannot convert transform operation to type: " +
      getOperationNameFromType(targetType));
}

std::string TransformOperation::getOperationName() const {
  return transformOperationStrings[static_cast<size_t>(type)];
}

bool TransformOperation::isRelative() const {
  return false;
}

std::shared_ptr<TransformOperation> TransformOperation::fromJSIValue(
    jsi::Runtime &rt,
    const jsi::Value &value) {
  if (!value.isObject()) {
    throw std::invalid_argument(
        "[Reanimated] TransformOperation must be an object.");
  }

  jsi::Object obj = value.asObject(rt);
  auto propertyNames = obj.getPropertyNames(rt);

  if (propertyNames.size(rt) != 1) {
    throw std::invalid_argument(
        "[Reanimated] TransformOperation must have exactly one property.");
  }

  std::string property =
      propertyNames.getValueAtIndex(rt, 0).asString(rt).utf8(rt);
  TransformOperationType operationType = getTransformOperationType(property);

  switch (operationType) {
    case TransformOperationType::Perspective:
      return std::make_shared<PerspectiveOperation>(
          obj.getProperty(rt, "perspective").asNumber());
    case TransformOperationType::Rotate:
      return std::make_shared<RotateOperation>(
          AngleValue(rt, obj.getProperty(rt, "rotate")));
    case TransformOperationType::RotateX:
      return std::make_shared<RotateXOperation>(
          AngleValue(rt, obj.getProperty(rt, "rotateX")));
    case TransformOperationType::RotateY:
      return std::make_shared<RotateYOperation>(
          AngleValue(rt, obj.getProperty(rt, "rotateY")));
    case TransformOperationType::RotateZ:
      return std::make_shared<RotateZOperation>(
          AngleValue(rt, obj.getProperty(rt, "rotateZ")));
    case TransformOperationType::Scale:
      return std::make_shared<ScaleOperation>(
          obj.getProperty(rt, "scale").asNumber());
    case TransformOperationType::ScaleX:
      return std::make_shared<ScaleXOperation>(
          obj.getProperty(rt, "scaleX").asNumber());
    case TransformOperationType::ScaleY:
      return std::make_shared<ScaleYOperation>(
          obj.getProperty(rt, "scaleY").asNumber());
    case TransformOperationType::TranslateX:
      return std::make_shared<TranslateXOperation>(
          UnitValue(rt, obj.getProperty(rt, "translateX")));
    case TransformOperationType::TranslateY:
      return std::make_shared<TranslateYOperation>(
          UnitValue(rt, obj.getProperty(rt, "translateY")));
    case TransformOperationType::SkewX:
      return std::make_shared<SkewXOperation>(
          AngleValue(rt, obj.getProperty(rt, "skewX")));
    case TransformOperationType::SkewY:
      return std::make_shared<SkewYOperation>(
          AngleValue(rt, obj.getProperty(rt, "skewY")));
    case TransformOperationType::Matrix:
      return std::make_shared<MatrixOperation>(
          TransformMatrix(rt, obj.getProperty(rt, "matrix")));
    default:
      throw std::invalid_argument(
          "[Reanimated] Unknown transform operation: " + property);
  }
}

jsi::Value TransformOperation::toJSIValue(jsi::Runtime &rt) const {
  const auto &value = valueToJSIValue(rt);
  if (value.isUndefined()) {
    return jsi::Value::undefined();
  }

  jsi::Object obj(rt);
  obj.setProperty(
      rt, jsi::String::createFromUtf8(rt, getOperationName()), value);
  return obj;
}

template <typename T>
TransformOperationBase<T>::TransformOperationBase(
    const TransformOperationType type,
    const T &value)
    : TransformOperation(type), value(value) {}

template <typename T>
bool TransformOperationBase<T>::operator==(
    const TransformOperation &other) const {
  if (type != other.type) {
    return false;
  }
  const auto &otherOperation =
      static_cast<const TransformOperationBase<T> &>(other);
  return value == otherOperation.value;
}

template <typename T>
std::string TransformOperationBase<T>::getOperationValue() const {
  std::ostringstream ss;
  ss << value;
  return ss.str();
}

template <>
std::string TransformOperationBase<
    std::variant<TransformMatrix, TransformOperations>>::getOperationValue()
    const {
  if (std::holds_alternative<TransformMatrix>(value)) {
    std::ostringstream ss;
    ss << std::get<TransformMatrix>(value);
    return ss.str();
  }

  const auto &operations = std::get<TransformOperations>(value);
  std::ostringstream ss;
  for (const auto &operation : operations) {
    ss << operation->getOperationName() << "(" << operation->getOperationValue()
       << "), ";
  }
  return ss.str();
}

/**
 * Concrete transform operations
 */

// Perspective
PerspectiveOperation::PerspectiveOperation(const double value)
    : TransformOperationBase<double>(
          TransformOperationType::Perspective,
          value) {}
jsi::Value PerspectiveOperation::valueToJSIValue(jsi::Runtime &rt) const {
  // Perspective cannot be 0, so we return undefined in this case
  return value != 0 ? jsi::Value(value) : jsi::Value::undefined();
}
TransformMatrix PerspectiveOperation::toMatrix() const {
  return TransformMatrix::Perspective(value);
}

// Rotate
RotateOperation::RotateOperation(const AngleValue &value)
    : TransformOperationBase<AngleValue>(
          TransformOperationType::Rotate,
          value) {}
RotateOperation::RotateOperation(
    const TransformOperationType type,
    const AngleValue &value)
    : TransformOperationBase<AngleValue>(type, value) {}
jsi::Value RotateOperation::valueToJSIValue(jsi::Runtime &rt) const {
  return value.toJSIValue(rt);
}
TransformMatrix RotateOperation::toMatrix() const {
  return TransformMatrix::RotateZ(value.value);
}

RotateXOperation::RotateXOperation(const AngleValue &value)
    : RotateOperation(TransformOperationType::RotateX, value) {}
TransformMatrix RotateXOperation::toMatrix() const {
  return TransformMatrix::RotateX(value.value);
}

RotateYOperation::RotateYOperation(const AngleValue &value)
    : RotateOperation(TransformOperationType::RotateY, value) {}
TransformMatrix RotateYOperation::toMatrix() const {
  return TransformMatrix::RotateY(value.value);
}

RotateZOperation::RotateZOperation(const AngleValue &value)
    : RotateOperation(TransformOperationType::RotateZ, value) {}
bool RotateZOperation::canConvertTo(const TransformOperationType type) const {
  return type == TransformOperationType::Rotate;
}
TransformOperations RotateZOperation::convertTo(
    const TransformOperationType type) const {
  assertCanConvertTo(type);
  return {std::make_shared<RotateOperation>(value)};
}
TransformMatrix RotateZOperation::toMatrix() const {
  return TransformMatrix::RotateZ(value.value);
}

// Scale
ScaleOperation::ScaleOperation(const double value)
    : TransformOperationBase<double>(TransformOperationType::Scale, value) {}
ScaleOperation::ScaleOperation(
    const TransformOperationType type,
    const double value)
    : TransformOperationBase<double>(type, value) {}
jsi::Value ScaleOperation::valueToJSIValue(jsi::Runtime &rt) const {
  return {value};
}
bool ScaleOperation::canConvertTo(const TransformOperationType type) const {
  return type == TransformOperationType::ScaleX ||
      type == TransformOperationType::ScaleY;
}
TransformOperations ScaleOperation::convertTo(
    const TransformOperationType type) const {
  assertCanConvertTo(type);

  if (type == TransformOperationType::ScaleX) {
    return {
        std::make_shared<ScaleXOperation>(value),
        std::make_shared<ScaleYOperation>(value)};
  } else {
    return {
        std::make_shared<ScaleYOperation>(value),
        std::make_shared<ScaleXOperation>(value)};
  }
}
TransformMatrix ScaleOperation::toMatrix() const {
  return TransformMatrix::Scale(value);
}

ScaleXOperation::ScaleXOperation(const double value)
    : ScaleOperation(TransformOperationType::ScaleX, value) {}
TransformMatrix ScaleXOperation::toMatrix() const {
  return TransformMatrix::ScaleX(value);
}

ScaleYOperation::ScaleYOperation(const double value)
    : ScaleOperation(TransformOperationType::ScaleY, value) {}
TransformMatrix ScaleYOperation::toMatrix() const {
  return TransformMatrix::ScaleY(value);
}

// Translate
TranslateOperation::TranslateOperation(
    const TransformOperationType type,
    const UnitValue &value)
    : TransformOperationBase<UnitValue>(type, value) {}
bool TranslateOperation::isRelative() const {
  return value.isRelative;
}
jsi::Value TranslateOperation::valueToJSIValue(jsi::Runtime &rt) const {
  return value.toJSIValue(rt);
}
TransformMatrix TranslateOperation::toMatrix() const {
  return toMatrix(value.value);
}

TranslateXOperation::TranslateXOperation(const UnitValue &value)
    : TranslateOperation(TransformOperationType::TranslateX, value) {}
TransformMatrix TranslateXOperation::toMatrix(
    const double resolvedValue) const {
  if (value.isRelative) {
    throw std::invalid_argument(
        "[Reanimated] Cannot convert relative translateX to the matrix.");
  }
  return TransformMatrix::TranslateX(resolvedValue);
}

TranslateYOperation::TranslateYOperation(const UnitValue &value)
    : TranslateOperation(TransformOperationType::TranslateY, value) {}
TransformMatrix TranslateYOperation::toMatrix(
    const double resolvedValue) const {
  if (value.isRelative) {
    throw std::invalid_argument(
        "[Reanimated] Cannot convert relative translateY to the matrix.");
  }
  return TransformMatrix::TranslateY(resolvedValue);
}

// Skew
SkewOperation::SkewOperation(
    const TransformOperationType type,
    const AngleValue &value)
    : TransformOperationBase<AngleValue>(type, value) {}
jsi::Value SkewOperation::valueToJSIValue(jsi::Runtime &rt) const {
  return value.toJSIValue(rt);
}

SkewXOperation::SkewXOperation(const AngleValue &value)
    : SkewOperation(TransformOperationType::SkewX, value) {}
TransformMatrix SkewXOperation::toMatrix() const {
  return TransformMatrix::SkewX(value.value);
}

SkewYOperation::SkewYOperation(const AngleValue &value)
    : SkewOperation(TransformOperationType::SkewY, value) {}
TransformMatrix SkewYOperation::toMatrix() const {
  return TransformMatrix::SkewY(value.value);
}

// Matrix
std::variant<TransformMatrix, TransformOperations> simplifyOperations(
    const TransformOperations &operations) {
  // Initialize the stack with the reversed list of operations
  std::vector<std::shared_ptr<TransformOperation>> operationsStack(
      operations.begin(), operations.end());
  TransformOperations reversedOperations;
  TransformMatrix simplifiedMatrix = TransformMatrix::Identity();
  bool hasSimplifications = false;

  while (!operationsStack.empty()) {
    auto operation = operationsStack.back();
    operationsStack.pop_back();

    if (operation->type == TransformOperationType::Matrix) {
      const auto matrixOperation =
          std::static_pointer_cast<MatrixOperation>(operation);
      if (std::holds_alternative<TransformOperations>(matrixOperation->value)) {
        // If the current operation is a matrix created from other operations,
        // add all of these operations to the stack
        for (auto &op : std::get<TransformOperations>(matrixOperation->value)) {
          operationsStack.push_back(op);
        }
        continue;
      }
    }

    if (!operation->isRelative()) {
      // If the operation is not relative, it can be simplified (converted to
      // the matrix and multiplied)
      const auto operationMatrix = operation->toMatrix();
      simplifiedMatrix = hasSimplifications
          ? (simplifiedMatrix * operationMatrix)
          : operationMatrix;
      hasSimplifications = true;
    } else {
      // If the current operation is relative, we need to add the current
      // simplified matrix to the list of operations before adding the relative
      // operation
      if (hasSimplifications) {
        reversedOperations.emplace_back(
            std::make_shared<MatrixOperation>(simplifiedMatrix));
        simplifiedMatrix = TransformMatrix::Identity();
        hasSimplifications = false;
      }
      reversedOperations.emplace_back(operation);
    }
  }

  if (hasSimplifications) {
    // We can return just a single matrix if there are no operations or the
    // only operation is a simplified matrix (when hasSimplifications is true)
    if (reversedOperations.size() <= 1) {
      return simplifiedMatrix;
    }
    // Otherwise, add the last simplified matrix to the list of operations
    reversedOperations.emplace_back(
        std::make_shared<MatrixOperation>(simplifiedMatrix));
  }

  // Reverse the list of operations to maintain the order
  std::reverse(reversedOperations.begin(), reversedOperations.end());
  return reversedOperations;
}

MatrixOperation::MatrixOperation(const TransformMatrix &value)
    : TransformOperationBase<
          std::variant<TransformMatrix, TransformOperations>>(
          TransformOperationType::Matrix,
          value) {}
MatrixOperation::MatrixOperation(const TransformOperations &operations)
    // Simplify operations to reduce the number of matrix multiplications during
    // matrix keyframe interpolation
    : TransformOperationBase<
          std::variant<TransformMatrix, TransformOperations>>(
          TransformOperationType::Matrix,
          simplifyOperations(operations)) {}

bool MatrixOperation::operator==(const TransformOperation &other) const {
  if (type != other.type) {
    return false;
  }

  const auto *otherOperation = dynamic_cast<const MatrixOperation *>(&other);
  if (otherOperation == nullptr) {
    return false;
  }

  const auto hasOperations = std::holds_alternative<TransformOperations>(value);
  const auto otherHasOperations =
      std::holds_alternative<TransformOperations>(otherOperation->value);

  if (hasOperations != otherHasOperations) {
    return false;
  }
  if (!hasOperations) {
    return std::get<TransformMatrix>(value) ==
        std::get<TransformMatrix>(otherOperation->value);
  }

  const auto &operations = std::get<TransformOperations>(value);
  const auto &otherOperations =
      std::get<TransformOperations>(otherOperation->value);

  if (operations.size() != otherOperations.size()) {
    return false;
  }
  for (size_t i = 0; i < operations.size(); ++i) {
    if (*operations[i] != *otherOperations[i]) {
      return false;
    }
  }
  return true;
}

jsi::Value MatrixOperation::valueToJSIValue(jsi::Runtime &rt) const {
  if (!std::holds_alternative<TransformMatrix>(value)) {
    throw std::invalid_argument(
        "[Reanimated] Cannot convert unprocessed transform operations to the JSI value.");
  }
  return std::get<TransformMatrix>(value).toJSIValue(rt);
}
TransformMatrix MatrixOperation::toMatrix() const {
  if (!std::holds_alternative<TransformMatrix>(value)) {
    throw std::invalid_argument(
        "[Reanimated] Cannot convert unprocessed transform operations to the matrix.");
  }
  return std::get<TransformMatrix>(value);
}

} // namespace reanimated

#endif // RCT_NEW_ARCH_ENABLED
