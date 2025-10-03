import type {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  Dispatch,
  FormHTMLAttributes,
  HTMLAttributes,
  ImgHTMLAttributes,
  JSX,
  SVGProps,
  SetStateAction,
} from 'react';

declare global {
  export type DispatchState<GType> = Dispatch<SetStateAction<GType>>;

  export type ReactButton = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;

  export type ReactDiv = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;

  export type ReactForm = DetailedHTMLProps<
    FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >;

  export type ReactHeader = DetailedHTMLProps<
    HTMLAttributes<HTMLElement>,
    HTMLElement
  >;

  export type ReactHtmlElement = DetailedHTMLProps<
    HTMLAttributes<HTMLElement>,
    HTMLElement
  >;

  export type ReactImage = DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >;

  export type ReactInput = JSX.IntrinsicAttributes &
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >;

  export type ReactSVG = SVGProps<SVGSVGElement>;

  export type ReactTable = DetailedHTMLProps<
    HTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  >;
}
