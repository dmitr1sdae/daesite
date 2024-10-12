"use client";

import "./Tabs.scss";

import {clamp, clsx, debounce, equivalentReducer} from "@daesite/utils";
import {CSSProperties, ReactNode, useEffect, useRef, useState} from "react";

const toKey = (index: number, prefix = "") => `${prefix}${index}`;

export interface Tab {
  title: string;
  content?: ReactNode;
}

export interface TabsProps {
  tabs?: Tab[];
  gap?: ReactNode;
  children?: Tab[];
  value: number;
  onChange: (index: number) => void;
  /**
   * Will make tabs stick to the top of the container when overflowing
   */
  stickyTabs?: boolean;
  /**
   * Tabs will take the maximum width and divide equally
   */
  fullWidth?: boolean;
  className?: string;
  containerClassName?: string;
  navContainerClassName?: string;
  contentClassName?: string;
}

const Tabs = ({
  value: unsafeValue,
  onChange,
  tabs,
  gap,
  children,
  stickyTabs = false,
  fullWidth = false,
  className,
  containerClassName,
  navContainerClassName,
  contentClassName,
}: TabsProps) => {
  const tabList = tabs || children || [];
  const value = clamp(unsafeValue, 0, tabList.length - 1);
  const content = tabList[value]?.content;
  const containerRef = useRef<HTMLUListElement>(null);
  const [selectedTabEl, setSelectedTabEl] = useState<HTMLLIElement | null>(
    null,
  );
  const [selectedTabRect, setSelectedTabRect] = useState<DOMRect | undefined>(
    undefined,
  );
  const [containerTabRect, setContainerTabRect] = useState<DOMRect | undefined>(
    undefined,
  );

  const scale = (selectedTabRect?.width || 0) / (containerTabRect?.width || 1);
  const offset = Math.abs(
    (selectedTabRect?.x || 0) - (containerTabRect?.x || 0),
  );
  const translate = `${offset}px`;

  useEffect(() => {
    const containerTabEl = containerRef.current;
    if (!containerTabEl || !selectedTabEl) {
      return;
    }
    const handleResize = () => {
      const selectedTabRect = selectedTabEl.getBoundingClientRect();
      const containerTabRect = containerTabEl.getBoundingClientRect();
      setSelectedTabRect((old) => equivalentReducer(old, selectedTabRect));
      setContainerTabRect((old) => equivalentReducer(old, containerTabRect));
    };
    const debouncedHandleResize = debounce(handleResize, 100);
    const resizeObserver = new ResizeObserver(debouncedHandleResize);
    resizeObserver.observe(containerTabEl, {box: "border-box"});
    resizeObserver.observe(selectedTabEl, {box: "border-box"});
    // Resize event listener is meant to update for if the left coordinate changes (without size changing)
    window.addEventListener("resize", debouncedHandleResize);
    handleResize();
    return () => {
      debouncedHandleResize.cancel();
      window.removeEventListener("resize", debouncedHandleResize);
      resizeObserver.disconnect();
    };
    // tabs.title.join is meant to cover if the tabs would dynamically change
  }, [
    containerRef.current,
    selectedTabEl,
    tabs?.map((tab) => tab.title).join(""),
  ]);

  if (tabs?.length === 1) {
    return content;
  }

  if (!tabs?.length) {
    return null;
  }

  const key = toKey(value, "key_");
  const label = toKey(value, "label_");

  return (
    <div className={clsx(["tabs", className])}>
      <div
        className={clsx([
          navContainerClassName,
          stickyTabs && "sticky top-0 bg-norm",
        ])}
      >
        <nav
          className={clsx([
            "tabs-container",
            "border-bottom border-weak",
            containerClassName,
          ])}
        >
          <ul
            className={clsx([
              "tabs-list unstyled flex flex-nowrap relative m-0 p-0",
              fullWidth && "tabs-list--fullWidth",
              "items-end",
            ])}
            role="tablist"
            ref={containerRef}
            style={
              {"--translate": translate, "--scale": scale} as CSSProperties
            }
          >
            {tabList.map(({title}, index) => {
              const key = toKey(index, "key_");
              const label = toKey(index, "label_");
              const selected = value === index;

              return (
                <li
                  key={key}
                  className={clsx(
                    "tabs-list-item",
                    "text-semibold hover:color-norm",
                    !selected && "color-weak",
                    selected && "color-norm",
                  )}
                  role="presentation"
                  ref={selected ? setSelectedTabEl : undefined}
                >
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      onChange(index);
                    }}
                    type="button"
                    className="tabs-list-link flex justify-center relative"
                    id={label}
                    role="tab"
                    aria-controls={key}
                    tabIndex={0}
                    aria-selected={selected}
                    data-testid={`tab-header-${title.replace(/\s+/, "-").toLowerCase()}-button`}
                  >
                    <span>{title}</span>
                  </button>
                </li>
              );
            })}
            <li className="tabs-indicator" aria-hidden />
          </ul>
        </nav>
      </div>
      {gap}
      <div
        id={key}
        className={clsx(
          "tabs-tabcontent",
          content ? "pt-4" : "",
          contentClassName,
        )}
        role="tabpanel"
        aria-labelledby={label}
      >
        {content}
      </div>
    </div>
  );
};

export {Tabs};
