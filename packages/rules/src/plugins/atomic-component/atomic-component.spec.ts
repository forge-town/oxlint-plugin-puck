import { describe } from "vitest";
import plugin from "./atomic-component";
import { runRuleTests } from "../../test-utils";

const rule = plugin.rules["atomic-component"];

describe("atomic-component", () => {
  runRuleTests("atomic-component", rule, {
    valid: [
      {
        code: `
          export type ButtonProps = { label: string };
          export function Button({ label }: ButtonProps) {
            return <button>{label}</button>;
          }
        `,
        filename: "src/components/Button.tsx",
      },
      {
        code: `
          type CardProps = { title: string };
          const Card = ({ title }: CardProps) => <div>{title}</div>;
          export { Card };
          export type { CardProps };
        `,
        filename: "src/components/Card/index.tsx",
      },
      {
        code: `
          export function Button() {
            return <button>click</button>;
          }
        `,
        filename: "src/components/Button.spec.tsx",
      },
      {
        code: "export function other() { return null; }",
        filename: "src/components/not-pascal.tsx",
      },
    ],
    invalid: [
      {
        code: `
          export type ButtonProps = { label: string };
          export function Button({ label }: ButtonProps) {
            return <button>{label}</button>;
          }
          export const helper = () => 1;
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "invalidExport" }],
      },
      {
        code: `
          export function Button() {
            return <button>click</button>;
          }
          export default Button;
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "invalidExport" }],
      },
      {
        code: `
          export type ButtonProps = { label: string };
          export function Button({ label }: ButtonProps) {
            return <button>{label}</button>;
          }
          export const Button = () => <button>x</button>;
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "multipleComponentDeclarations" }],
      },
      {
        code: `
          export type ButtonProps = { label: string };
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "missingComponentExport" }],
      },
      {
        code: `
          export type ButtonProps = { label: string };
          export function Button({ label }: ButtonProps) {
            return label;
          }
        `,
        filename: "src/components/Button.tsx",
        errors: [{ messageId: "nonJsxComponent" }],
      },
    ],
  });
});
