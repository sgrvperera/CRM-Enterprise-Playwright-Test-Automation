import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true, strict: false });

export function validateSchema(schema: object, data: unknown) {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    const message = validate.errors?.map((error) => `${error.instancePath} ${error.message}`).join('; ');
    throw new Error(`Schema validation failed: ${message}`);
  }
}
