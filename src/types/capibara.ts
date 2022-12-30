/* eslint-disable @typescript-eslint/naming-convention */
import { Enum } from "./enum";
import { Function } from "./function";
import { Header } from "./header";
import { Macro } from "./macro";
import { Struct } from "./struct";
import { Typedef } from "./typedef";

export type Capibara = {
    build_date: string,
    reference_url: string,
    headers: Header[],
    macros: Macro[],
    enums: Enum[],
    structs: Struct[],
    typedefs: Typedef[],
    functions: Function[]
};