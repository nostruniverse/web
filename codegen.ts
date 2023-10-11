import type { CodegenConfig } from '@graphql-codegen/cli';

import schema from '../backend/libs/generated/src/schema';

const config: CodegenConfig = {
  schema: [schema],
  documents: './src/**/*.gql',
  generates: {
    './src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
      config: {
        addExplicitOverride: true,
      },
    },
  },
  require: ['ts-node/register'],
};
export default config;
