import type { SandboxFramework } from "./types";

export function renderCode(framework: SandboxFramework, schemaText: string) {
  if (framework === "vue") {
    return `<script setup lang="ts">
import LowCodeRenderer from "./LowCodeRenderer.vue";
const pageSchema = ${schemaText};
</script>

<template>
  <div class="codigo-page" style="height: 100%; min-height: 100vh; position: relative;">
    <LowCodeRenderer
      v-for="component in pageSchema"
      :key="component.id"
      :component="component"
    />
  </div>
</template>
`;
  }

  return `import React, { useMemo, useEffect, useState } from "react";
import { LowCodeRenderer } from "./LowCodeRenderer";

const pageSchema = ${schemaText};

export default function Page() {
  const initialPageState = useMemo(() => {
    const nextState = {};
    const getClickActions = (node) => {
      const configuredActions = Array.isArray(node.events?.onClick)
        ? node.events.onClick
        : [];
      const props = node.props ?? {};
      const legacyActions = [];

      if (
        props.actionType === "set-state" &&
        typeof props.stateKey === "string" &&
        props.stateKey &&
        props.stateValue !== undefined
      ) {
        legacyActions.push({
          type: "setState",
          key: props.stateKey,
          value: props.stateValue,
        });
      }

      return [...configuredActions, ...legacyActions];
    };

    const visitNodes = (nodes) => {
      nodes.forEach((node) => {
        getClickActions(node).forEach((action) => {
          if (
            action.type === "setState" &&
            action.key &&
            nextState[action.key] === undefined
          ) {
            nextState[action.key] = action.value;
          }
        });

        if (node.children?.length) {
          visitNodes(node.children);
        }
      });
    };

    visitNodes(pageSchema);
    return nextState;
  }, []);
  const [pageState, setPageState] = useState(initialPageState);

  useEffect(() => {
    setPageState(initialPageState);
  }, [initialPageState]);

  return (
    <div className="codigo-page" style={{ height: '100%', minHeight: '100vh', position: 'relative' }}>
      {pageSchema.map((component) => (
        <LowCodeRenderer
          key={component.id}
          component={component}
          runtime={{
            pageState,
            onAction: (action) => {
              if (action.type === "set-state" || action.type === "setState") {
                setPageState((prev) => ({
                  ...prev,
                  [action.key]: action.value,
                }));
                return;
              }

              if (action.type === "navigate") {
                window.location.assign(action.path);
                return;
              }

              if (action.type === "openUrl") {
                window.open(
                  action.url,
                  action.target ?? "_blank",
                  "noopener,noreferrer",
                );
                return;
              }

              const targetElement = document.getElementById(action.targetId);
              targetElement?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            },
          }}
        />
      ))}
    </div>
  );
}
`;
}

export function createSandboxFiles(
  framework: SandboxFramework,
  generatedCode: string,
) {
  if (framework === "vue") {
    return {
      "/src/App.vue": generatedCode,
      "/src/LowCodeRenderer.vue": `
<script setup>
defineProps({ component: Object })
</script>
<template>
  <div :style="[component.styles, { border: '1px dashed #ccc', padding: '8px', margin: '4px', borderRadius: '4px', position: component.styles?.position || 'relative', left: component.styles?.left, top: component.styles?.top }]">
    <div style="font-size: 14px; margin-bottom: 4px; color: #10b981"><strong>{{ component.type }}</strong></div>
    <div style="font-size: 12px; color: #666; background: #f8fafc; padding: 4px; border-radius: 4px;">
      {{ JSON.stringify(component.props) }}
    </div>
  </div>
</template>
      `,
    };
  }

  return {
    "/App.js": generatedCode,
    "/LowCodeRenderer.js": `
export function LowCodeRenderer({ component }) {
  const { type, props, styles } = component;
  
  return (
    <div style={{ ...styles, border: '1px dashed #ccc', padding: '8px', margin: '4px', borderRadius: '4px', position: styles?.position || 'relative', left: styles?.left, top: styles?.top }}>
      <div style={{ fontSize: '14px', marginBottom: '4px', color: '#10b981' }}><strong>{type}</strong></div>
      <div style={{ fontSize: '12px', color: '#666', background: '#f8fafc', padding: '4px', borderRadius: '4px' }}>
        {JSON.stringify(props)}
      </div>
    </div>
  );
}
      `,
  };
}
