/* eslint-disable @typescript-eslint/naming-convention */
import { HeaderRef } from "./header";

export type Enum = {
    name: string,
    header: HeaderRef,
    summary: string,
    variants: Variant[],
    description: string,
    os_affinity: string[]
};

type Variant = {
    name: string,
    description: string,
};