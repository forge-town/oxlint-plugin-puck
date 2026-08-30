import { describe } from "vitest";
import plugin from "./jsx-sort-props";
import { runRuleTests } from "../../test-utils";

const rule = plugin.rules["jsx-sort-props"];

describe("jsx-sort-props", () => {
  runRuleTests("jsx-sort-props", rule, {
    valid: [
      {
        code: 'const el = <Button className="a" id="b" onClick={() => {}} />;',
      },
      {
        code: 'const el = <Button className="a" id="b" />;',
        options: [{ callbacksLast: true }],
      },
      {
        code: 'const el = <Button key="a" id="b" />;',
        options: [{ reservedFirst: ["key"] }],
      },
      {
        code: 'const el = <Button key="a" className="b" />;',
        options: [{ reservedFirst: ["key"] }],
      },
      {
        code: "const el = <Button a={1} b />;",
        options: [{ shorthandLast: true }],
      },
      {
        code: "const el = <Button b a={1} />;",
        options: [{ shorthandFirst: true }],
      },
      {
        code: 'const el = <Button\n  first={\n    long\n  }\n  second="2"\n/>;',
        options: [{ multiline: "first" }],
      },
      {
        code: 'const el = <Button second="2"\n  first={\n    long\n  }\n/>;',
        options: [{ multiline: "last" }],
      },
    ],
    invalid: [
      {
        code: 'const el = <Button b="1" a="2" />;',
        errors: [{ messageId: "sortPropsByAlpha" }],
        output: 'const el = <Button a="2" b="1" />;',
      },
      {
        code: 'const el = <Button onClick={() => {}} id="b" />;',
        options: [{ callbacksLast: true }],
        errors: [{ messageId: "listCallbacksLast" }],
        output: 'const el = <Button id="b" onClick={() => {}} />;',
      },
      {
        code: 'const el = <Button id="b" key="a" />;',
        options: [{ reservedFirst: ["key", "ref"] }],
        errors: [{ messageId: "listReservedPropsFirst" }],
        output: 'const el = <Button key="a" id="b" />;',
      },
      {
        code: 'const el = <Button b="1" a="2" />;',
        options: [{ ignoreCase: true }],
        errors: [{ messageId: "sortPropsByAlpha" }],
        output: 'const el = <Button a="2" b="1" />;',
      },
      {
        code: "const el = <Button onMouseDown={() => {}} onClick={() => {}} />;",
        options: [{ callbacksLast: true }],
        errors: [{ messageId: "sortPropsByAlpha" }],
        output: "const el = <Button onClick={() => {}} onMouseDown={() => {}} />;",
      },
      {
        code: "const el = <Button a b={1} />;",
        options: [{ shorthandLast: true }],
        errors: [{ messageId: "listShorthandLast" }],
        output: "const el = <Button b={1} a />;",
      },
      {
        code: "const el = <Button a={1} b />;",
        options: [{ shorthandFirst: true }],
        errors: [{ messageId: "listShorthandFirst" }],
        output: "const el = <Button b a={1} />;",
      },
      {
        code: 'const el = <Button\n  onClick={() => {}}\n  className="a"\n/>;',
        options: [{ callbacksLast: true }],
        errors: [{ messageId: "listCallbacksLast" }],
        output: 'const el = <Button\n  className="a"\n  onClick={() => {}}\n/>;',
      },
      {
        code: 'const el = <Button a="1" b="2" />;',
        options: [{ reservedFirst: [] }],
        errors: [{ messageId: "listIsEmpty" }, { messageId: "listIsEmpty" }],
        output: null,
      },
      {
        code: 'const el = <Button a="1" b="2" />;',
        options: [{ reservedFirst: ["notReserved", "key"] }],
        errors: [{ messageId: "noUnreservedProps" }, { messageId: "noUnreservedProps" }],
        output: null,
      },
    ],
  });
});
