import {
  createContext as createReactContext,
  useContext as useReactContext,
  ReactNode,
  useMemo,
  Context,
} from "react";

type Scope<C = any> = {[scopeName: string]: Context<C>[]} | undefined;
type ScopeHook = (scope: Scope) => {[__scopeProp: string]: Scope};
interface CreateScope {
  scopeName: string;
  (): ScopeHook;
}

const createContextScope = (
  scopeName: string,
  createContextScopeDeps: CreateScope[] = [],
) => {
  let defaultContexts: any[] = [];

  const createContext = <ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType,
  ) => {
    const BaseContext = createReactContext<ContextValueType | undefined>(
      defaultContext,
    );
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];

    const Provider = (
      props: ContextValueType & {
        scope: Scope<ContextValueType>;
        children: ReactNode;
      },
    ) => {
      const {scope, children, ...context} = props;
      const Context = scope?.[scopeName][index] || BaseContext;
      const value = useMemo(
        () => context,
        Object.values(context),
      ) as ContextValueType;
      return <Context.Provider value={value}>{children}</Context.Provider>;
    };

    const useContext = (
      consumerName: string,
      scope: Scope<ContextValueType | undefined>,
    ) => {
      const Context = scope?.[scopeName][index] || BaseContext;
      const context = useReactContext(Context);
      if (context) return context;
      if (defaultContext !== undefined) return defaultContext;
      throw new Error(
        `\`${consumerName}\` must be used within \`${rootComponentName}\``,
      );
    };

    Provider.displayName = `${rootComponentName}Provider`;
    return [Provider, useContext] as const;
  };

  const createScope: CreateScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) =>
      createReactContext(defaultContext),
    );
    return (scope: Scope) => {
      const contexts = scope?.[scopeName] || scopeContexts;
      return useMemo(
        () => ({[`__scope${scopeName}`]: {...scope, [scopeName]: contexts}}),
        [scope, contexts],
      );
    };
  };

  createScope.scopeName = scopeName;
  return [
    createContext,
    composeContextScopes(createScope, ...createContextScopeDeps),
  ] as const;
};

const composeContextScopes = (...scopes: CreateScope[]) => {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;

  const createScope: CreateScope = () => {
    const scopeHooks = scopes.map((createScope) => ({
      useScope: createScope(),
      scopeName: createScope.scopeName,
    }));

    return (overrideScopes) => {
      const nextScopes = scopeHooks.reduce(
        (nextScopes, {useScope, scopeName}) => {
          const scopeProps = useScope(overrideScopes);
          const currentScope = scopeProps[`__scope${scopeName}`];
          return {...nextScopes, ...currentScope};
        },
        {},
      );

      return useMemo(
        () => ({[`__scope${baseScope.scopeName}`]: nextScopes}),
        [nextScopes],
      );
    };
  };

  createScope.scopeName = baseScope.scopeName;
  return createScope;
};

export {createContextScope};
export type {CreateScope, Scope};
