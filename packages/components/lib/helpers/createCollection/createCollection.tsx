"use client";

import {
  ComponentPropsWithoutRef,
  FC,
  forwardRef,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {Slot} from "~/components/Slot";
import {createContextScope} from "~/helpers/createContextScope";
import {useComposedRefs} from "@daesite/hooks";

type SlotProps = ComponentPropsWithoutRef<typeof Slot>;
type CollectionElement = HTMLElement;
interface CollectionProps extends SlotProps {
  scope: any;
}

const createCollection = <ItemElement extends HTMLElement, ItemData = {}>(
  name: string,
) => {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope] =
    createContextScope(PROVIDER_NAME);

  type ContextValue = {
    collectionRef: RefObject<CollectionElement>;
    itemMap: Map<
      RefObject<ItemElement>,
      {ref: RefObject<ItemElement>} & ItemData
    >;
  };

  const [CollectionProviderImpl, useCollectionContext] =
    createCollectionContext<ContextValue>(PROVIDER_NAME, {
      collectionRef: {current: null},
      itemMap: new Map(),
    });

  const CollectionProvider: FC<{
    children?: ReactNode;
    scope: any;
  }> = (props) => {
    const {scope, children} = props;
    const ref = useRef<CollectionElement>(null);
    const itemMap = useRef<ContextValue["itemMap"]>(new Map()).current;

    return (
      <CollectionProviderImpl
        scope={scope}
        itemMap={itemMap}
        collectionRef={ref}
      >
        {children}
      </CollectionProviderImpl>
    );
  };

  CollectionProvider.displayName = PROVIDER_NAME;

  const COLLECTION_SLOT_NAME = name + "CollectionSlot";

  const CollectionSlot = forwardRef<CollectionElement, CollectionProps>(
    (props, forwardedRef) => {
      const {scope, children} = props;
      const context = useCollectionContext(
        COLLECTION_SLOT_NAME,
        scope,
      ) as ContextValue;
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);

      return <Slot ref={composedRefs}>{children}</Slot>;
    },
  );

  CollectionSlot.displayName = COLLECTION_SLOT_NAME;

  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";

  type CollectionItemSlotProps = ItemData & {
    children: ReactNode;
    scope: any;
  };

  const CollectionItemSlot = forwardRef<ItemElement, CollectionItemSlotProps>(
    (props, forwardedRef) => {
      const {scope, children, ...itemData} = props;
      const ref = useRef<ItemElement>(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = useCollectionContext(
        ITEM_SLOT_NAME,
        scope,
      ) as ContextValue;

      useEffect(() => {
        if (ref.current) {
          context.itemMap.set(ref, {ref, ...(itemData as unknown as ItemData)});
          return () => {
            context.itemMap.delete(ref);
          };
        }
      }, [ref, context.itemMap, itemData]);

      return (
        <Slot {...{[ITEM_DATA_ATTR]: ""}} ref={composedRefs}>
          {children}
        </Slot>
      );
    },
  );

  CollectionItemSlot.displayName = ITEM_SLOT_NAME;

  const useCollection = (scope: any) => {
    const context = useCollectionContext(
      name + "CollectionConsumer",
      scope,
    ) as ContextValue;

    const getItems = useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(
        collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`),
      );
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) =>
          orderedNodes.indexOf(a.ref.current!) -
          orderedNodes.indexOf(b.ref.current!),
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);

    return getItems;
  };

  return [
    {
      Provider: CollectionProvider,
      Slot: CollectionSlot,
      ItemSlot: CollectionItemSlot,
    },
    useCollection,
    createCollectionScope,
  ] as const;
};

export {createCollection};
export type {CollectionProps};
