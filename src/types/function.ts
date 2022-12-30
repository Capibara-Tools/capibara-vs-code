/* eslint-disable @typescript-eslint/naming-convention */
import { HeaderRef } from "./header";

export type Function = {
    name: string,
    header: HeaderRef,
    summary: string,
    returns: Return,
    parameters: Parameter[],
    description: string,
    associated: string[],
    os_affinity: string[]
};

type Return = {
    type: string,
    description: string
};

type Parameter = {
    name: string,
    type: string,
    description: string,
};

