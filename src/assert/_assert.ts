import { ProductionError } from "../errors/production-error";

// tslint:disable-next-line:class-name
export class _Assert
{
    public static valueIsNever = (_value: never) =>
    {
        throw ProductionError.createOne("this should not be called");
    }
}