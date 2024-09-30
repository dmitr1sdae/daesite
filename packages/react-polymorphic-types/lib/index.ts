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

type PolymorphicExoticComponent<
	P = {},
	T extends React.ElementType = React.ElementType,
> = Merge<
	React.ExoticComponent<P & { [key: string]: unknown }>,
	{
		/**
		 * **NOTE**: Exotic components are not callable.
		 */
		<InstanceT extends React.ElementType = T>(
			props: PolymorphicPropsWithRef<P, InstanceT>,
		): React.ReactElement | null;
	}
>;

export type PolymorphicForwardRefExoticComponent<
	P,
	T extends React.ElementType,
> = Merge<
	React.ForwardRefExoticComponent<P & { [key: string]: unknown }>,
	PolymorphicExoticComponent<P, T>
>;

export type PolymorphicMemoExoticComponent<
	P,
	T extends React.ElementType,
> = Merge<
	React.MemoExoticComponent<React.ComponentType<any>>,
	PolymorphicExoticComponent<P, T>
>;

export type PolymorphicLazyExoticComponent<
	P,
	T extends React.ElementType,
> = Merge<
	React.LazyExoticComponent<React.ComponentType<any>>,
	PolymorphicExoticComponent<P, T>
>;
