/* eslint-disable @typescript-eslint/naming-convention */
import { HeaderRef } from "./header";

export type Macro = {
    name: string,
    header: HeaderRef,
    summary: string,
    kind: Kind,
    description: string,
    os_affinity: string[]
};

export type Kind = ObjectKind | FunctionKind;

export type ObjectKind = {
    object: Object
};

export type FunctionKind = {
    function: Function
};

type Object = {};

type Function = {
    returns: Return,
    parameters: Parameter[],
    examples: Example[]
};

type Return = {
    type: string,
    description: string,
};

type Parameter = {
    name: string,
    description: string,
};

type Example = {
    title: string,
    code: string,
};

