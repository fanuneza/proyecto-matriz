"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import styles from "./ChartTabs.module.css";

type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type Props = {
  items: [TabItem, TabItem];
};

export function ChartTabs({ items }: Props) {
  const [activeId, setActiveId] = useState(items[0].id);
  const instanceId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function focusTab(index: number) {
    setActiveId(items[index].id);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      focusTab((index + direction + items.length) % items.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusTab(items.length - 1);
    }
  }

  return (
    <div className={styles.root}>
      <div
        className={styles.tabList}
        role="tablist"
        aria-label="Vista de gráfico y tabla"
      >
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          const tabId = `${instanceId}-${item.id}-tab`;
          const panelId = `${instanceId}-${item.id}-panel`;

          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              className={`${styles.tab} ${isActive ? styles.active : ""}`}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const isActive = item.id === activeId;
        const tabId = `${instanceId}-${item.id}-tab`;
        const panelId = `${instanceId}-${item.id}-panel`;

        return (
          <div
            key={item.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive}
            className={styles.panel}
          >
            {isActive ? item.content : null}
          </div>
        );
      })}
    </div>
  );
}
