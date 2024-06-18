import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  PropsWithoutRef,
  PropsWithRef,
} from "react";
import {JSX} from "react/jsx-runtime";

type Merge<T, U> = Omit<T, keyof U> & U;

type PropsWithAs<P, T extends ElementType> = P & {as?: T};

export type PolymorphicPropsWithoutRef<P, T extends ElementType> = Merge<
  T extends keyof JSX.IntrinsicElements
    ? PropsWithoutRef<JSX.IntrinsicElements[T]>
    : ComponentPropsWithoutRef<T>,
  PropsWithAs<P, T>
>;

export type PolymorphicPropsWithRef<P, T extends ElementType> = Merge<
  T extends keyof JSX.IntrinsicElements
    ? PropsWithRef<JSX.IntrinsicElements[T]>
    : ComponentPropsWithRef<T>,
  PropsWithAs<P, T>
>;
