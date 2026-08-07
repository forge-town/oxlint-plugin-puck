import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import type { OxlintRuleContext, OxlintRuleModule } from "../../types.js";

/**
 * @fileoverview Oxlint JS plugin: Enforce JSX props alphabetical sorting
 * Ported 1:1 from eslint-plugin-react/jsx-sort-props
 * @see https://github.com/jsx-eslint/eslint-plugin-react/blob/master/lib/rules/jsx-sort-props.js
 */

// --- Inlined utilities (replaces jsx-ast-utils / eslint-plugin-react util deps) ---

type JsxAttributeType = TSESTree.JSXAttribute | TSESTree.JSXSpreadAttribute;

const propName = (prop: TSESTree.JSXAttribute): string => {
  if (prop.name.type === "JSXNamespacedName") {
    return `${prop.name.namespace.name}:${prop.name.name.name}`;
  }

  return prop.name.name;
};

const getMemberName = (member: TSESTree.JSXIdentifier | TSESTree.JSXMemberExpression): string => {
  if (member.type === "JSXMemberExpression") {
    return `${getMemberName(member.object as TSESTree.JSXIdentifier | TSESTree.JSXMemberExpression)}.${member.property.name}`;
  }

  return member.name;
};

const elementType = (node: TSESTree.JSXOpeningElement): string => {
  const name = node.name;
  if (name.type === "JSXIdentifier") {
    return name.name;
  }
  if (name.type === "JSXMemberExpression") {
    return getMemberName(name);
  }
  if (name.type === "JSXNamespacedName") {
    return `${name.namespace.name}:${name.name.name}`;
  }

  return "";
};

const COMPAT_TAG_REGEX = /^[a-z]/;

const isDOMComponent = (node: TSESTree.JSXOpeningElement): boolean =>
  COMPAT_TAG_REGEX.test(elementType(node));

const isCallbackPropName = (name: string): boolean => /^on[A-Z]/.test(name);

type RuleMessageIds =
  | "noUnreservedProps"
  | "listIsEmpty"
  | "listReservedPropsFirst"
  | "listCallbacksLast"
  | "listShorthandFirst"
  | "listShorthandLast"
  | "listMultilineFirst"
  | "listMultilineLast"
  | "listSortFirstPropsFirst"
  | "sortPropsByAlpha";

type RuleOptions = {
  callbacksLast?: boolean;
  shorthandFirst?: boolean;
  shorthandLast?: boolean;
  multiline?: "ignore" | "first" | "last";
  ignoreCase?: boolean;
  noSortAlphabetically?: boolean;
  reservedFirst?: string[] | boolean;
  sortFirst?: string[];
  locale?: string;
};

type SortOptions = {
  ignoreCase: boolean;
  callbacksLast: boolean;
  shorthandFirst: boolean;
  shorthandLast: boolean;
  multiline: "ignore" | "first" | "last";
  noSortAlphabetically: boolean;
  reservedFirst: boolean;
  reservedList: string[];
  sortFirst: string[];
  locale: string;
};

const getSourceCode = (
  context: OxlintRuleContext<RuleMessageIds, [RuleOptions]>
): TSESLint.SourceCode => (context.getSourceCode ? context.getSourceCode() : context.sourceCode);

// --- Rule implementation ---

const isMultilineProp = (node: TSESTree.JSXAttribute): boolean =>
  node.loc.start.line !== node.loc.end.line;

const messages: Record<RuleMessageIds, string> = {
  noUnreservedProps:
    "A customized reserved first list must only contain a subset of React reserved props. Remove: {{unreservedWords}}",
  listIsEmpty: "A customized reserved first list must not be empty",
  listReservedPropsFirst: "Reserved props must be listed before all other props",
  listCallbacksLast: "Callbacks must be listed after all other props",
  listShorthandFirst: "Shorthand props must be listed before all other props",
  listShorthandLast: "Shorthand props must be listed after all other props",
  listMultilineFirst: "Multiline props must be listed before all other props",
  listMultilineLast: "Multiline props must be listed after all other props",
  listSortFirstPropsFirst: "Props in sortFirst must be listed before all other props",
  sortPropsByAlpha: "Props should be sorted alphabetically",
};

const RESERVED_PROPS_LIST = ["children", "dangerouslySetInnerHTML", "key", "ref"];

const isReservedPropName = (name: string, list: string[]): boolean => list.includes(name);

const getSortFirstIndex = (name: string, sortFirstList: string[], ignoreCase: boolean): number => {
  const normalizedPropName = ignoreCase ? name.toLowerCase() : name;
  for (let i = 0; i < sortFirstList.length; i++) {
    const normalizedListName = ignoreCase ? sortFirstList[i]!.toLowerCase() : sortFirstList[i];
    if (normalizedPropName === normalizedListName) {
      return i;
    }
  }

  return -1;
};

// Module-level WeakMap reset per file via Program() visitor
let attributeMap: WeakMap<TSESTree.JSXAttribute, { end: number; hasComment: boolean }> =
  new WeakMap();

const shouldSortToEnd = (node: TSESTree.JSXAttribute): boolean => {
  const attr = attributeMap.get(node);

  return !!attr && !!attr.hasComment;
};

const contextCompare = (
  a: TSESTree.JSXAttribute,
  b: TSESTree.JSXAttribute,
  options: SortOptions
): number => {
  let aProp = propName(a);
  let bProp = propName(b);

  const aSortToEnd = shouldSortToEnd(a);
  const bSortToEnd = shouldSortToEnd(b);
  if (aSortToEnd && !bSortToEnd) {
    return 1;
  }
  if (!aSortToEnd && bSortToEnd) {
    return -1;
  }

  if (options.sortFirst && options.sortFirst.length > 0) {
    const aSortFirstIndex = getSortFirstIndex(aProp, options.sortFirst, options.ignoreCase);
    const bSortFirstIndex = getSortFirstIndex(bProp, options.sortFirst, options.ignoreCase);
    if (aSortFirstIndex >= 0 && bSortFirstIndex >= 0) {
      if (aSortFirstIndex !== bSortFirstIndex) {
        return aSortFirstIndex - bSortFirstIndex;
      }

      return 0;
    }
    if (aSortFirstIndex >= 0 && bSortFirstIndex < 0) {
      return -1;
    }
    if (aSortFirstIndex < 0 && bSortFirstIndex >= 0) {
      return 1;
    }
  }

  if (options.reservedFirst) {
    const aIsReserved = isReservedPropName(aProp, options.reservedList);
    const bIsReserved = isReservedPropName(bProp, options.reservedList);
    if (aIsReserved && !bIsReserved) {
      return -1;
    }
    if (!aIsReserved && bIsReserved) {
      return 1;
    }
  }

  if (options.callbacksLast) {
    const aIsCallback = isCallbackPropName(aProp);
    const bIsCallback = isCallbackPropName(bProp);
    if (aIsCallback && !bIsCallback) {
      return 1;
    }
    if (!aIsCallback && bIsCallback) {
      return -1;
    }
  }

  if (options.shorthandFirst || options.shorthandLast) {
    const shorthandSign = options.shorthandFirst ? -1 : 1;
    if (!a.value && b.value) {
      return shorthandSign;
    }
    if (a.value && !b.value) {
      return -shorthandSign;
    }
  }

  if (options.multiline !== "ignore") {
    const multilineSign = options.multiline === "first" ? -1 : 1;
    const aIsMultiline = isMultilineProp(a);
    const bIsMultiline = isMultilineProp(b);
    if (aIsMultiline && !bIsMultiline) {
      return multilineSign;
    }
    if (!aIsMultiline && bIsMultiline) {
      return -multilineSign;
    }
  }

  if (options.noSortAlphabetically) {
    return 0;
  }

  const actualLocale = options.locale === "auto" ? undefined : options.locale;

  if (options.ignoreCase) {
    aProp = aProp.toLowerCase();
    bProp = bProp.toLowerCase();

    return aProp.localeCompare(bProp, actualLocale);
  }
  if (aProp === bProp) {
    return 0;
  }
  if (options.locale === "auto") {
    return aProp < bProp ? -1 : 1;
  }

  return aProp.localeCompare(bProp, actualLocale);
};

const getGroupsOfSortableAttributes = (
  attributes: JsxAttributeType[],
  context: OxlintRuleContext<RuleMessageIds, [RuleOptions]>
): TSESTree.JSXAttribute[][] => {
  const sourceCode = getSourceCode(context);
  const sortableAttributeGroups: TSESTree.JSXAttribute[][] = [];
  let groupCount = 0;

  const addtoSortableAttributeGroups = (attribute: TSESTree.JSXAttribute): void => {
    sortableAttributeGroups[groupCount - 1]!.push(attribute);
  };

  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i]!;
    const nextAttribute = attributes[i + 1];
    const attributeline = attribute.loc.start.line;
    let comment: TSESTree.Comment[] = [];
    try {
      comment = sourceCode.getCommentsAfter(attribute);
    } catch {
      // getCommentsAfter may not be available in all environments
    }
    const lastAttr = attributes[i - 1];
    const attrIsSpread = attribute.type === "JSXSpreadAttribute";

    if (!lastAttr || (lastAttr.type === "JSXSpreadAttribute" && !attrIsSpread)) {
      groupCount += 1;
      sortableAttributeGroups[groupCount - 1] = [];
    }
    if (!attrIsSpread) {
      const jsxAttribute = attribute as TSESTree.JSXAttribute;
      if (comment.length === 0) {
        attributeMap.set(jsxAttribute, {
          end: attribute.range[1],
          hasComment: false,
        });
        addtoSortableAttributeGroups(jsxAttribute);
      } else {
        const firstComment = comment[0]!;
        const commentline = firstComment.loc.start.line;
        if (comment.length === 1) {
          if (attributeline + 1 === commentline && nextAttribute) {
            attributeMap.set(jsxAttribute, {
              end: nextAttribute.range[1],
              hasComment: true,
            });
            addtoSortableAttributeGroups(jsxAttribute);
            i += 1;
          } else if (attributeline === commentline) {
            if (firstComment.type === "Block" && nextAttribute) {
              attributeMap.set(jsxAttribute, {
                end: nextAttribute.range[1],
                hasComment: true,
              });
              i += 1;
            } else if (firstComment.type === "Block") {
              attributeMap.set(jsxAttribute, {
                end: firstComment.range[1],
                hasComment: true,
              });
            } else {
              attributeMap.set(jsxAttribute, {
                end: firstComment.range[1],
                hasComment: false,
              });
            }
            addtoSortableAttributeGroups(jsxAttribute);
          }
        } else if (
          comment.length > 1 &&
          attributeline + 1 === comment[1]!.loc.start.line &&
          nextAttribute
        ) {
          const commentNextAttribute = sourceCode.getCommentsAfter(nextAttribute);
          attributeMap.set(jsxAttribute, {
            end: nextAttribute.range[1],
            hasComment: true,
          });
          if (
            commentNextAttribute.length === 1 &&
            nextAttribute.loc.start.line === commentNextAttribute[0]!.loc.start.line
          ) {
            attributeMap.set(jsxAttribute, {
              end: commentNextAttribute[0]!.range[1],
              hasComment: true,
            });
          }
          addtoSortableAttributeGroups(jsxAttribute);
          i += 1;
        }
      }
    }
  }

  return sortableAttributeGroups;
};

const generateFixerFunction = (
  node: TSESTree.JSXOpeningElement,
  context: OxlintRuleContext<RuleMessageIds, [RuleOptions]>,
  reservedList: string[]
): TSESLint.ReportFixFunction => {
  const attributes = [...node.attributes];
  const configuration = (context.options[0] || {}) as RuleOptions;
  const ignoreCase = configuration.ignoreCase || false;
  const callbacksLast = configuration.callbacksLast || false;
  const shorthandFirst = configuration.shorthandFirst || false;
  const shorthandLast = configuration.shorthandLast || false;
  const multiline = configuration.multiline || "ignore";
  const noSortAlphabetically = configuration.noSortAlphabetically || false;
  const reservedFirst = Boolean(configuration.reservedFirst);
  const sortFirst = configuration.sortFirst || [];
  const locale = configuration.locale || "auto";

  const options: SortOptions = {
    ignoreCase,
    callbacksLast,
    shorthandFirst,
    shorthandLast,
    multiline,
    noSortAlphabetically,
    reservedFirst,
    reservedList,
    sortFirst,
    locale,
  };

  const sortableAttributeGroups = getGroupsOfSortableAttributes(attributes, context);
  const sortedAttributeGroups = [...sortableAttributeGroups].map((group) =>
    [...group].sort((a, b) => contextCompare(a, b, options))
  );

  return function fixFunction(fixer: TSESLint.RuleFixer): TSESLint.RuleFix | null {
    const fixers: Array<{ range: [number, number]; text: string }> = [];
    const sourceCode = getSourceCode(context);
    let source = sourceCode.getText();

    sortableAttributeGroups.forEach((sortableGroup, ii) => {
      sortableGroup.forEach((attr, jj) => {
        const sortedAttr = sortedAttributeGroups[ii]![jj]!;
        const sortedAttrText = source.slice(sortedAttr.range[0], attributeMap.get(sortedAttr)!.end);
        fixers.push({
          range: [attr.range[0], attributeMap.get(attr)!.end],
          text: sortedAttrText,
        });
      });
    });

    fixers.sort((a, b) => b.range[0] - a.range[0]);

    const firstFixer = fixers[0];
    const lastFixer = fixers.at(-1);
    const rangeStart = lastFixer ? lastFixer.range[0] : 0;
    const rangeEnd = firstFixer ? firstFixer.range[1] : 0;

    fixers.forEach((fix) => {
      source = `${source.slice(0, fix.range[0])}${fix.text}${source.slice(fix.range[1])}`;
    });

    return fixer.replaceTextRange([rangeStart, rangeEnd], source.slice(rangeStart, rangeEnd));
  };
};

const validateReservedFirstConfig = (
  context: OxlintRuleContext<RuleMessageIds, [RuleOptions]>,
  reservedFirst: string[] | boolean | undefined
): ((decl: TSESTree.JSXAttribute) => void) | undefined => {
  if (reservedFirst && Array.isArray(reservedFirst)) {
    const nonReservedWords = reservedFirst.filter(
      (word) => !isReservedPropName(word, RESERVED_PROPS_LIST)
    );
    if (reservedFirst.length === 0) {
      return function Report(decl: TSESTree.JSXAttribute) {
        context.report({ node: decl, messageId: "listIsEmpty" });
      };
    }
    if (nonReservedWords.length > 0) {
      return function Report(decl: TSESTree.JSXAttribute) {
        context.report({
          node: decl,
          messageId: "noUnreservedProps",
          data: { unreservedWords: nonReservedWords.toString() },
        });
      };
    }
  }

  return undefined;
};

const reportedNodeAttributes = new WeakMap<TSESTree.JSXAttribute, RuleMessageIds[]>();

const reportNodeAttribute = (
  nodeAttribute: TSESTree.JSXAttribute,
  errorType: RuleMessageIds,
  node: TSESTree.JSXOpeningElement,
  context: OxlintRuleContext<RuleMessageIds, [RuleOptions]>,
  reservedList: string[]
): void => {
  const errors = reportedNodeAttributes.get(nodeAttribute) || [];
  if (errors.includes(errorType)) {
    return;
  }
  errors.push(errorType);
  reportedNodeAttributes.set(nodeAttribute, errors);

  context.report({
    node: nodeAttribute.name,
    messageId: errorType,
    fix: generateFixerFunction(node, context, reservedList),
  });
};

const jsxSortPropsRule: OxlintRuleModule<RuleMessageIds, [RuleOptions]> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce props alphabetical sorting",
    },
    fixable: "code",
    messages,
    schema: [
      {
        type: "object",
        properties: {
          callbacksLast: { type: "boolean" },
          shorthandFirst: { type: "boolean" },
          shorthandLast: { type: "boolean" },
          multiline: { type: "string", enum: ["ignore", "first", "last"], default: "ignore" },
          ignoreCase: { type: "boolean" },
          noSortAlphabetically: { type: "boolean" },
          reservedFirst: { type: ["array", "boolean"] },
          sortFirst: {
            type: "array",
            items: { type: "string" },
            uniqueItems: true,
          },
          locale: { type: "string", default: "auto" },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context: OxlintRuleContext<RuleMessageIds, [RuleOptions]>): TSESLint.RuleListener {
    const configuration = (context.options[0] || {}) as RuleOptions;
    const ignoreCase = configuration.ignoreCase || false;
    const callbacksLast = configuration.callbacksLast || false;
    const shorthandFirst = configuration.shorthandFirst || false;
    const shorthandLast = configuration.shorthandLast || false;
    const multiline = configuration.multiline || "ignore";
    const noSortAlphabetically = configuration.noSortAlphabetically || false;
    const reservedFirst = configuration.reservedFirst || false;
    const reservedFirstError = validateReservedFirstConfig(context, reservedFirst);
    const reservedList = Array.isArray(reservedFirst) ? reservedFirst : RESERVED_PROPS_LIST;
    const sortFirst = configuration.sortFirst || [];
    const locale = configuration.locale || "auto";

    return {
      Program(): void {
        attributeMap = new WeakMap();
      },

      JSXOpeningElement(node: TSESTree.JSXOpeningElement): void {
        // `dangerouslySetInnerHTML` is only "reserved" on DOM components
        const nodeReservedList =
          reservedFirst && !isDOMComponent(node)
            ? reservedList.filter((prop) => prop !== "dangerouslySetInnerHTML")
            : reservedList;

        node.attributes.reduce<JsxAttributeType | undefined>((memo, decl, idx, attrs) => {
          if (decl.type === "JSXSpreadAttribute") {
            return attrs[idx + 1];
          }
          // memo may be undefined (e.g. all preceding attrs were spreads)
          // or a JSXSpreadAttribute when attributes[0] is a spread
          if (!memo || memo.type === "JSXSpreadAttribute") {
            return decl;
          }

          let previousPropName = propName(memo);
          let currentPropName = propName(decl);
          const previousValue = memo.value;
          const currentValue = decl.value;
          const previousIsCallback = isCallbackPropName(previousPropName);
          const currentIsCallback = isCallbackPropName(currentPropName);

          if (sortFirst && sortFirst.length > 0) {
            const previousSortFirstIndex = getSortFirstIndex(
              previousPropName,
              sortFirst,
              ignoreCase
            );
            const currentSortFirstIndex = getSortFirstIndex(currentPropName, sortFirst, ignoreCase);

            if (previousSortFirstIndex >= 0 && currentSortFirstIndex >= 0) {
              if (previousSortFirstIndex > currentSortFirstIndex) {
                reportNodeAttribute(
                  decl,
                  "listSortFirstPropsFirst",
                  node,
                  context,
                  nodeReservedList
                );

                return memo;
              }

              return decl;
            }

            if (previousSortFirstIndex >= 0 && currentSortFirstIndex < 0) {
              return decl;
            }

            if (previousSortFirstIndex < 0 && currentSortFirstIndex >= 0) {
              reportNodeAttribute(decl, "listSortFirstPropsFirst", node, context, nodeReservedList);

              return memo;
            }
          }

          if (ignoreCase) {
            previousPropName = previousPropName.toLowerCase();
            currentPropName = currentPropName.toLowerCase();
          }

          if (reservedFirst) {
            if (reservedFirstError) {
              reservedFirstError(decl);

              return memo;
            }

            const previousIsReserved = isReservedPropName(previousPropName, nodeReservedList);
            const currentIsReserved = isReservedPropName(currentPropName, nodeReservedList);

            if (previousIsReserved && !currentIsReserved) {
              return decl;
            }
            if (!previousIsReserved && currentIsReserved) {
              reportNodeAttribute(decl, "listReservedPropsFirst", node, context, nodeReservedList);

              return memo;
            }
          }

          if (callbacksLast) {
            if (!previousIsCallback && currentIsCallback) {
              return decl;
            }
            if (previousIsCallback && !currentIsCallback) {
              reportNodeAttribute(memo, "listCallbacksLast", node, context, nodeReservedList);

              return memo;
            }
          }

          if (shorthandFirst) {
            if (currentValue && !previousValue) {
              return decl;
            }
            if (!currentValue && previousValue) {
              reportNodeAttribute(decl, "listShorthandFirst", node, context, nodeReservedList);

              return memo;
            }
          }

          if (shorthandLast) {
            if (!currentValue && previousValue) {
              return decl;
            }
            if (currentValue && !previousValue) {
              reportNodeAttribute(memo, "listShorthandLast", node, context, nodeReservedList);

              return memo;
            }
          }

          const previousIsMultiline = isMultilineProp(memo);
          const currentIsMultiline = isMultilineProp(decl);

          if (multiline === "first") {
            if (previousIsMultiline && !currentIsMultiline) {
              return decl;
            }
            if (!previousIsMultiline && currentIsMultiline) {
              reportNodeAttribute(decl, "listMultilineFirst", node, context, nodeReservedList);

              return memo;
            }
          } else if (multiline === "last") {
            if (!previousIsMultiline && currentIsMultiline) {
              return decl;
            }
            if (previousIsMultiline && !currentIsMultiline) {
              reportNodeAttribute(memo, "listMultilineLast", node, context, nodeReservedList);

              return memo;
            }
          }

          if (
            !noSortAlphabetically &&
            (ignoreCase || locale !== "auto"
              ? previousPropName.localeCompare(
                  currentPropName,
                  locale === "auto" ? undefined : locale
                ) > 0
              : previousPropName > currentPropName)
          ) {
            reportNodeAttribute(decl, "sortPropsByAlpha", node, context, nodeReservedList);

            return memo;
          }

          return decl;
        }, node.attributes[0]);
      },
    };
  },
};

const plugin = {
  meta: {
    name: "template",
  },
  rules: {
    "jsx-sort-props": jsxSortPropsRule,
  },
};

export default plugin;
