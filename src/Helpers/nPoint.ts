import { ethers } from 'ethers'

export function fromExponential(x: any) {
    if (Math.abs(x) < 1.0) {
        var e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
        }
    } else {
        var e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            x += (new Array(e + 1)).join('0');
        }
    }
    return x;
}

export const to_decimals = (val: string, dec: number = 16) => Number(val).toFixed(dec);
export const from_wei = (val: string, dec: number = 18) => to_decimals(ethers.formatUnits(val, dec));
export const to_wei = (val: string, dec: number = 18) => ethers.parseUnits(to_decimals(val), dec);
export const shoten = (str: string) => str.slice(0, 3) + '...' + str.slice(-3)
export const estimate_gas = async (to: string, data: string, val: string, provider: any) => await provider.estimateGas({ to: to, data: data, value: to_wei(val) });
export function difference({ o, n }: { o: number, n: number }) {
    let OMNS = ((n * 100000) - (o * 100000));
    let OPNS = ((o * 100000));
    let DIFF = (OMNS / OPNS) * 100;
    return to_decimals(String(DIFF), 2)
}