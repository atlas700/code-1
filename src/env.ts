import "server-only";

const nodeEnvironments = ["development", "production", "test"] as const;

type NodeEnvironment = (typeof nodeEnvironments)[number];

function isNodeEnvironment(value: string | undefined): value is NodeEnvironment {
  return nodeEnvironments.some((environment) => environment === value);
}

export function validateServerEnvironment(
  nodeEnvironment: string | undefined = process.env.NODE_ENV,
) {
  if (!isNodeEnvironment(nodeEnvironment)) {
    throw new Error(
      "Invalid NODE_ENV. Set it to development, production, or test before starting the application.",
    );
  }

  return { nodeEnvironment } as const;
}

export const env = validateServerEnvironment();
