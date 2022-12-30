/* eslint-disable @typescript-eslint/naming-convention */
import { HeaderRef } from "./header";

export type Struct = {
    name: string,
    header: HeaderRef,
    summary: string,
    fields: Field[],
    description: string,
    os_affinity: string[]
};

type Field = {
    name: string,
    type: string,
    description: string,
};