/* eslint-disable @typescript-eslint/naming-convention */
export type Header = {
    ref: string,
    name: string,
    summary: string,
    os_affinity: string[],
};

export type HeaderRef = {
    ref: string,
    name: string,
};