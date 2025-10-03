import type { ReactElement, ReactNode } from 'react';
import { Children, Fragment, isValidElement } from 'react';

interface CaseProps {
  children: ReactNode;
  value: boolean | number | string;
}

export const Case = ({ children }: CaseProps) => <>{children}</>;

export const Default = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

interface SwitchProps {
  children: ReactNode;
  value: boolean | number | string;
}

export function Switch({ children, value }: SwitchProps): null | ReactElement {
  const childArray = Children.toArray(children) as ReactElement[];

  let defaultNode: ReactNode = null;

  for (const child of childArray) {
    if (!isValidElement(child)) continue;

    const element = child as ReactElement<{
      children: ReactNode;
      value?: unknown;
    }>;

    if (element.type === Case && element.props.value === value) {
      return <Fragment>{element.props.children}</Fragment>;
    }

    if (element.type === Default) {
      defaultNode = element.props.children;
    }
  }

  return <>{defaultNode}</>;
}
