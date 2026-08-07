import { Fragment } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';

const ALLOWED_TAG_NAMES = new Set(['pre', 'code', 'span', 'div', 'br']);

export type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function toCamelCase(property: string) {
  if (property.startsWith('--')) {
    return property;
  }

  return property.replace(/-([a-z])/g, (_, letter: string) =>
    letter.toUpperCase()
  );
}

function parseStyle(style: unknown): CSSProperties | undefined {
  if (typeof style !== 'string') {
    return undefined;
  }

  return style.split(';').reduce<Record<string, string>>((styles, rule) => {
    const [property, ...valueParts] = rule.split(':');
    const value = valueParts.join(':').trim();

    if (property && value) {
      styles[toCamelCase(property.trim())] = value;
    }

    return styles;
  }, {}) as CSSProperties;
}

function normalizePropertyValue(value: unknown) {
  return Array.isArray(value) ? value.join(' ') : value;
}

/**
 * Properties come from the syntax highlighter, never from the highlighted
 * source, so they cannot carry a sink — but the invariant is enforced here
 * rather than assumed, since these keys would let a hast node opt back out of
 * React's escaping or hijack the element identity.
 */
const FORBIDDEN_PROPERTIES = new Set(['dangerouslySetInnerHTML', 'ref', 'key']);

function getReactProps(properties: Record<string, unknown> = {}) {
  return Object.entries(properties).reduce<Record<string, unknown>>(
    (props, [key, value]) => {
      if (FORBIDDEN_PROPERTIES.has(key)) {
        return props;
      }

      if (key === 'class' || key === 'className') {
        props.className = normalizePropertyValue(value);
      } else if (key === 'style') {
        props.style = parseStyle(value);
      } else if (key === 'tabindex') {
        props.tabIndex = Number(value);
      } else {
        props[key] = normalizePropertyValue(value);
      }

      return props;
    },
    {}
  );
}

function renderHastNode(node: HastNode, key: string): ReactNode {
  if (node.type === 'text') {
    return node.value ?? '';
  }

  const children = node.children?.map((child, index) =>
    renderHastNode(child, `${key}-${index}`)
  );

  if (node.type === 'root') {
    return <>{children}</>;
  }

  if (node.type === 'element' && node.tagName) {
    // A syntax highlighter only ever emits these, and React escaping does not
    // help inside a `<script>` or a `<style>` — so an unexpected tag keeps its
    // text and loses the element.
    if (!ALLOWED_TAG_NAMES.has(node.tagName)) {
      return <Fragment key={key}>{children}</Fragment>;
    }

    const Tag = node.tagName as ElementType;

    return (
      <Tag key={key} {...getReactProps(node.properties)}>
        {children}
      </Tag>
    );
  }

  return null;
}

export function renderHast(node: HastNode): ReactNode {
  return renderHastNode(node, 'root');
}
