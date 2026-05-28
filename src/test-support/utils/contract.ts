import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

export function validateSchema(schema: object, data: unknown) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    const message = validate.errors
      ?.map((error) => {
        const path = (error as { instancePath?: string; dataPath?: string }).instancePath ||
          (error as { instancePath?: string; dataPath?: string }).dataPath ||
          '';
        return `${path} ${error.message}`.trim();
      })
      .join('; ');
    throw new Error(`Schema validation failed: ${message}`);
  }
}
