import { Type } from '@nestjs/common';
import { Field } from '../decorators';
import { getFieldsAndDecoratorForType } from '../schema-builder/utils/get-fields-and-decorator.util';

export function PickType<T, K extends keyof T>(
  classRef: Type<T>,
  keys: K[],
): Type<Pick<T, typeof keys[number]>> {
  const { fields, decoratorFactory } = getFieldsAndDecoratorForType(classRef);

  abstract class PickObjectType {}
  decoratorFactory({ isAbstract: true })(PickObjectType);

  fields
    .filter((item) => keys.includes(item.schemaName as K))
    .forEach((item) =>
      Field(item.typeFn, { ...item.options })(
        PickObjectType.prototype,
        item.name,
      ),
    );
  return PickObjectType as Type<Pick<T, typeof keys[number]>>;
}