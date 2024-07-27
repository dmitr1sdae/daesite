"use client";

import {
  ComponentPropsWithoutRef,
  createContext,
  ElementRef,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {Norn} from "../Norn";
import {
  useCallbackRef,
  useComposedRefs,
  useEscapeKeydown,
} from "@daesite/hooks";
import {composeEventHandlers} from "@daesite/utils";
import {dispatchDiscreteCustomEvent} from "~/helpers";

const DISMISSABLE_LAYER_NAME = "DismissableLayer";
const CONTEXT_UPDATE = "dismissableLayer.update";
const POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
const FOCUS_OUTSIDE = "dismissableLayer.focusOutside";

let originalBodyPointerEvents: string;

const DismissableLayerContext = createContext({
  layers: new Set<DismissableLayerElement>(),
  layersWithOutsidePointerEventsDisabled: new Set<DismissableLayerElement>(),
  branches: new Set<DismissableLayerBranchElement>(),
});

type DismissableLayerElement = ElementRef<typeof Norn.div>;
type NornDivProps = ComponentPropsWithoutRef<typeof Norn.div>;
interface DismissableLayerProps extends NornDivProps {
  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside
   * the `DismissableLayer`. Users will need to click twice on outside elements to
   * interact with them: once to close the `DismissableLayer`, and again to trigger the element.
   */
  disableOutsidePointerEvents?: boolean;
  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /**
   * Event handler called when the a `pointerdown` event happens outside of the `DismissableLayer`.
   * Can be prevented.
   */
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
  /**
   * Event handler called when the focus moves outside of the `DismissableLayer`.
   * Can be prevented.
   */
  onFocusOutside?: (event: FocusOutsideEvent) => void;
  /**
   * Event handler called when an interaction happens outside the `DismissableLayer`.
   * Specifically, when a `pointerdown` event happens outside or focus moves outside of it.
   * Can be prevented.
   */
  onInteractOutside?: (
    event: PointerDownOutsideEvent | FocusOutsideEvent,
  ) => void;
  /**
   * Handler called when the `DismissableLayer` should be dismissed
   */
  onDismiss?: () => void;
}

const DismissableLayer = forwardRef<
  DismissableLayerElement,
  DismissableLayerProps
>((props, forwardedRef) => {
  const {
    disableOutsidePointerEvents = false,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    onDismiss,
    ...layerProps
  } = props;
  const context = useContext(DismissableLayerContext);
  const [node, setNode] = useState<DismissableLayerElement | null>(null);
  const ownerDocument = node?.ownerDocument ?? globalThis?.document;
  const [, force] = useState({});
  const composedRefs = useComposedRefs(forwardedRef, (node) => setNode(node));
  const layers = Array.from(context.layers);
  const [highestLayerWithOutsidePointerEventsDisabled] = [
    ...context.layersWithOutsidePointerEventsDisabled,
  ].slice(-1);
  const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(
    highestLayerWithOutsidePointerEventsDisabled,
  );
  const index = node ? layers.indexOf(node) : -1;
  const isBodyPointerEventsDisabled =
    context.layersWithOutsidePointerEventsDisabled.size > 0;
  const isPointerEventsEnabled =
    index >= highestLayerWithOutsidePointerEventsDisabledIndex;

  const pointerDownOutside = usePointerDownOutside((event) => {
    const target = event.target as HTMLElement;
    const isPointerDownOnBranch = [...context.branches].some((branch) =>
      branch.contains(target),
    );
    if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
    onPointerDownOutside?.(event);
    onInteractOutside?.(event);
    if (!event.defaultPrevented) onDismiss?.();
  }, ownerDocument);

  const focusOutside = useFocusOutside((event) => {
    const target = event.target as HTMLElement;
    const isFocusInBranch = [...context.branches].some((branch) =>
      branch.contains(target),
    );
    if (isFocusInBranch) return;
    onFocusOutside?.(event);
    onInteractOutside?.(event);
    if (!event.defaultPrevented) onDismiss?.();
  }, ownerDocument);

  useEscapeKeydown((event: KeyboardEvent) => {
    const isHighestLayer = index === context.layers.size - 1;
    if (!isHighestLayer) return;
    onEscapeKeyDown?.(event);
    if (!event.defaultPrevented && onDismiss) {
      event.preventDefault();
      onDismiss();
    }
  }, ownerDocument);

  useEffect(() => {
    if (!node) return;
    if (disableOutsidePointerEvents) {
      if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
        originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
        ownerDocument.body.style.pointerEvents = "none";
      }
      context.layersWithOutsidePointerEventsDisabled.add(node);
    }
    context.layers.add(node);
    dispatchUpdate();
    return () => {
      if (
        disableOutsidePointerEvents &&
        context.layersWithOutsidePointerEventsDisabled.size === 1
      ) {
        ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
      }
    };
  }, [node, ownerDocument, disableOutsidePointerEvents, context]);

  useEffect(() => {
    return () => {
      if (!node) return;
      context.layers.delete(node);
      context.layersWithOutsidePointerEventsDisabled.delete(node);
      dispatchUpdate();
    };
  }, [node, context]);

  useEffect(() => {
    const handleUpdate = () => force({});
    document.addEventListener(CONTEXT_UPDATE, handleUpdate);
    return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
  }, []);

  return (
    <Norn.div
      {...layerProps}
      ref={composedRefs}
      style={{
        pointerEvents: isBodyPointerEventsDisabled
          ? isPointerEventsEnabled
            ? "auto"
            : "none"
          : undefined,
        ...props.style,
      }}
      onFocusCapture={composeEventHandlers(
        props.onFocusCapture,
        focusOutside.onFocusCapture,
      )}
      onBlurCapture={composeEventHandlers(
        props.onBlurCapture,
        focusOutside.onBlurCapture,
      )}
      onPointerDownCapture={composeEventHandlers(
        props.onPointerDownCapture,
        pointerDownOutside.onPointerDownCapture,
      )}
    />
  );
});

DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;

const BRANCH_NAME = "DismissableLayerBranch";

type DismissableLayerBranchElement = ElementRef<typeof Norn.div>;
interface DismissableLayerBranchProps extends NornDivProps {}

const DismissableLayerBranch = forwardRef<
  DismissableLayerBranchElement,
  DismissableLayerBranchProps
>((props, forwardedRef) => {
  const context = useContext(DismissableLayerContext);
  const ref = useRef<DismissableLayerBranchElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      context.branches.add(node);
      return () => {
        context.branches.delete(node);
      };
    }
  }, [context.branches]);

  return <Norn.div {...props} ref={composedRefs} />;
});

DismissableLayerBranch.displayName = BRANCH_NAME;

type PointerDownOutsideEvent = CustomEvent<{originalEvent: PointerEvent}>;
type FocusOutsideEvent = CustomEvent<{originalEvent: FocusEvent}>;

const usePointerDownOutside = (
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void,
  ownerDocument: Document = globalThis?.document,
) => {
  const handlePointerDownOutside = useCallbackRef(
    onPointerDownOutside,
  ) as EventListener;
  const isPointerInsideReactTreeRef = useRef(false);
  const handleClickRef = useRef(() => {});

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        const eventDetail = {originalEvent: event};

        const handleAndDispatchPointerDownOutsideEvent = () => {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            handlePointerDownOutside,
            eventDetail,
            {discrete: true},
          );
        };

        if (event.pointerType === "touch") {
          ownerDocument.removeEventListener("click", handleClickRef.current);
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent;
          ownerDocument.addEventListener("click", handleClickRef.current, {
            once: true,
          });
        } else {
          handleAndDispatchPointerDownOutsideEvent();
        }
      } else {
        ownerDocument.removeEventListener("click", handleClickRef.current);
      }
      isPointerInsideReactTreeRef.current = false;
    };
    const timerId = window.setTimeout(() => {
      ownerDocument.addEventListener("pointerdown", handlePointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timerId);
      ownerDocument.removeEventListener("pointerdown", handlePointerDown);
      ownerDocument.removeEventListener("click", handleClickRef.current);
    };
  }, [ownerDocument, handlePointerDownOutside]);

  return {
    onPointerDownCapture: () => (isPointerInsideReactTreeRef.current = true),
  };
};

const useFocusOutside = (
  onFocusOutside?: (event: FocusOutsideEvent) => void,
  ownerDocument: Document = globalThis?.document,
) => {
  const handleFocusOutside = useCallbackRef(onFocusOutside) as EventListener;
  const isFocusInsideReactTreeRef = useRef(false);

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = {originalEvent: event};
        handleAndDispatchCustomEvent(
          FOCUS_OUTSIDE,
          handleFocusOutside,
          eventDetail,
          {
            discrete: false,
          },
        );
      }
    };
    ownerDocument.addEventListener("focusin", handleFocus);
    return () => ownerDocument.removeEventListener("focusin", handleFocus);
  }, [ownerDocument, handleFocusOutside]);

  return {
    onFocusCapture: () => (isFocusInsideReactTreeRef.current = true),
    onBlurCapture: () => (isFocusInsideReactTreeRef.current = false),
  };
};

const dispatchUpdate = () => {
  const event = new CustomEvent(CONTEXT_UPDATE);
  document.dispatchEvent(event);
};

const handleAndDispatchCustomEvent = <
  E extends CustomEvent,
  OriginalEvent extends Event,
>(
  name: string,
  handler: ((event: E) => void) | undefined,
  detail: {originalEvent: OriginalEvent} & (E extends CustomEvent<infer D>
    ? D
    : never),
  {discrete}: {discrete: boolean},
) => {
  const target = detail.originalEvent.target;
  const event = new CustomEvent(name, {
    bubbles: false,
    cancelable: true,
    detail,
  });
  if (handler)
    target.addEventListener(name, handler as EventListener, {once: true});

  if (discrete) {
    dispatchDiscreteCustomEvent(target, event);
  } else {
    target.dispatchEvent(event);
  }
};

export {DismissableLayer, DismissableLayerBranch};
export type {DismissableLayerProps};
