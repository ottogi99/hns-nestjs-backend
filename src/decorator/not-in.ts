import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function NotIn(property: string, validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'NotIn',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],    // 이 데커레이터는 속성에 적용되도록 제약을 주었습니다.
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    console.log(args.constraints);
                    console.log(relatedPropertyName);
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    console.log(args.object);
                    console.log(relatedValue);
                    return typeof value === 'string' && typeof relatedValue === 'string' && !relatedValue.includes(value);
                }
            }
        })
    }
}