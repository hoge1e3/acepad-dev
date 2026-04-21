#!run

export async function main(){
  return ;
}
import type {ExportAllDeclaration, ExportDefaultDeclaration, ExportNamedDeclaration, ImportDeclaration, Literal} from "acorn";
import * as espree from 'espree';
import { simple, SimpleVisitors } from "acorn-walk";

export function exportedIdentifiers(jssrc: string): string[] {
  const ast = espree.parse(jssrc, {
    ecmaVersion: "latest",
    sourceType: "module",
  });

  const identifiers: string[] = [];

  const visitors: SimpleVisitors<unknown> = {
    ExportNamedDeclaration(node: ExportNamedDeclaration) {
      // export { foo, bar } or export { foo as bar }
      for (const specifier of node.specifiers) {
        identifiers.push((specifier.exported as Literal).name ?? (specifier.exported as any).value);
      }
      // export const foo = ..., export function foo() {}, export class Foo {}
      if (node.declaration) {
        const decl = node.declaration;
        if (decl.type === "VariableDeclaration") {
          for (const d of decl.declarations) {
            if (d.id.type === "Identifier") identifiers.push(d.id.name);
          }
        } else if (
          decl.type === "FunctionDeclaration" ||
          decl.type === "ClassDeclaration"
        ) {
          if (decl.id) identifiers.push(decl.id.name);
        }
      }
    },

    ExportDefaultDeclaration(_node: ExportDefaultDeclaration) {
      identifiers.push("default");
    },

    ExportAllDeclaration(node: ExportAllDeclaration) {
      // export * as ns from "..."
      if (node.exported) {
        identifiers.push(
          (node.exported as Literal).name ?? (node.exported as any).value
        );
      }
    },
  };

  simple(ast, visitors);
  return identifiers;
}