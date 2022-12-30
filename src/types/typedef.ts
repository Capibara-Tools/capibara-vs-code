/* eslint-disable @typescript-eslint/naming-convention */
import { Enum } from "./enum";
import { HeaderRef } from "./header";
import { Struct } from "./struct";

export type Typedef = {
    name: string,
    header: HeaderRef,
    summary: string,
    type: string,
    associated_ref: RefType,
    description: string,
    os_affinity: string[]
};

export type RefType = RefTypeEnum | RefTypeStruct | RefTypeNone;

export type RefTypeEnum = {
    enum: Enum
};

export type RefTypeStruct = {
    struct: Struct
};

export type RefTypeNone = {
    none: {}
};