import type { Linter, Rule } from 'eslint';

declare module 'eslint-plugin-ban' {
  const plugin: {
    configs?: Record<string, Linter.Config<Linter.RulesRecord>>;
    rules: Record<string, Rule.RuleModule>;
  };

  export = plugin;
}
