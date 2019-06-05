import { isValidElementType } from 'react-is';

const elementTypePropTypeChecker = (props, propName, componentName, isRequired = false) => {
  if (!props[propName] && isRequired) {
    return new Error(`Prop '${propName}' is required in '${componentName}' but was not provided`);
  }
  if (props[propName] && !isValidElementType(props[propName])) {
    return new Error(`Invalid prop '${propName}' supplied to '${componentName}': the prop is not a valid React component`);
  }
  return null;
};

elementTypePropTypeChecker.isRequired = (props, propName, componentName) =>
  elementTypePropTypeChecker(props, propName, componentName, true);

export default elementTypePropTypeChecker;
