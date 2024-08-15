import {createContext as createReactContext, ReactNode, useMemo} from "react";

const createContext = <ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType,
) => {
  const Context = createReactContext<ContextValueType | undefined>(
    defaultContext,
  );

  const Provider = (props: ContextValueType & {children: ReactNode}) => {
    const {children, ...context} = props;
    // Only re-memoize when prop values change
    const value = useMemo(
      () => context,
      Object.values(context),
    ) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  const useContext = (consumerName: string) => {
    const context = createReactContext(Context);
    if (context) return context;
    if (defaultContext !== undefined) return defaultContext;
    // if a defaultContext wasn't specified, it's a required context.
    throw new Error(
      `\`${consumerName}\` must be used within \`${rootComponentName}\``,
    );
  };

  Provider.displayName = rootComponentName + "Provider";
  return [Provider, useContext] as const;
};

export {createContext};
