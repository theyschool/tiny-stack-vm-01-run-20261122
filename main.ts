import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
const I = process.env.MAKEFUN_INPUT_DIR ?? "/input";
const O = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
for (const id of readdirSync(I).sort()) {
  const p = readFileSync(I + "/" + id + "/program.bin");
  const inp = readFileSync(I + "/" + id + "/input.bin");
  const n = p.length;
  const st = new Int32Array(256), cs = new Int32Array(64), mem = new Int32Array(256);
  const out = Buffer.alloc(65536);
  let sp = 0, cp = 0, pc = 0, ip = 0, ol = 0, steps = 0, code = 0;
  const U = (n: number) => { if (sp < n) throw 2; };
  const P = (v: number) => { if (sp > 255) throw 3; st[sp++] = v | 0; };
  const B = (f: (a: number, b: number) => number) => { U(2); const b = st[--sp]; st[sp - 1] = f(st[sp - 1], b) | 0; };
  const D = (f: (a: number, b: number) => number) => (a: number, b: number) => { if (!b) throw 4; return f(a, b); };
  try {
    for (;;) {
      if (steps >= 1e6) throw 10;
      if (pc < 0 || pc >= n) throw 9;
      const op = p[pc];
      const L = op === 1 ? 1 : op === 2 ? 4 : op >= 48 && op <= 51 ? 2 : 0;
      if (!(op <= 7 || op >= 16 && op <= 30 || op >= 32 && op <= 34 || op >= 48 && op <= 52 || op === 64 || op === 65 || op >= 80 && op <= 83)) throw 5;
      if (pc + 1 + L > n) throw 9;
      steps++;
      let nx = pc + 1 + L;
      switch (op) {
        case 0: throw 0;
        case 1: P((p[pc + 1] << 24) >> 24); break;
        case 2: P(p.readInt32LE(pc + 1)); break;
        case 3: U(1); sp--; break;
        case 4: U(1); P(st[sp - 1]); break;
        case 5: U(2); { const t = st[sp - 1]; st[sp - 1] = st[sp - 2]; st[sp - 2] = t; } break;
        case 6: U(2); P(st[sp - 2]); break;
        case 7: U(3); { const a = st[sp - 3]; st[sp - 3] = st[sp - 2]; st[sp - 2] = st[sp - 1]; st[sp - 1] = a; } break;
        case 16: B((a, b) => a + b); break;
        case 17: B((a, b) => a - b); break;
        case 18: B((a, b) => Math.imul(a, b)); break;
        case 19: B(D((a, b) => Math.trunc(a / b))); break;
        case 20: B(D((a, b) => a % b)); break;
        case 21: B(D((a, b) => Math.trunc((a >>> 0) / (b >>> 0)))); break;
        case 22: B(D((a, b) => (a >>> 0) % (b >>> 0))); break;
        case 23: U(1); st[sp - 1] = -st[sp - 1] | 0; break;
        case 24: B((a, b) => a & b); break;
        case 25: B((a, b) => a | b); break;
        case 26: B((a, b) => a ^ b); break;
        case 27: U(1); st[sp - 1] = ~st[sp - 1]; break;
        case 28: B((a, b) => a << b); break;
        case 29: B((a, b) => a >> b); break;
        case 30: B((a, b) => a >>> b); break;
        case 32: B((a, b) => a === b ? 1 : 0); break;
        case 33: B((a, b) => a < b ? 1 : 0); break;
        case 34: B((a, b) => (a >>> 0) < (b >>> 0) ? 1 : 0); break;
        case 48: nx += p.readInt16LE(pc + 1); break;
        case 49: U(1); if (st[--sp] === 0) nx += p.readInt16LE(pc + 1); break;
        case 50: U(1); if (st[--sp] !== 0) nx += p.readInt16LE(pc + 1); break;
        case 51: if (cp >= 64) throw 7; cs[cp++] = nx; nx = p.readUInt16LE(pc + 1); break;
        case 52: if (!cp) throw 8; nx = cs[--cp]; break;
        case 64: U(1); { const a = st[sp - 1]; if (a < 0 || a > 255) throw 6; st[sp - 1] = mem[a]; } break;
        case 65: U(2); { const a = st[sp - 1]; if (a < 0 || a > 255) throw 6; mem[a] = st[sp - 2]; sp -= 2; } break;
        case 80: U(1); { const s = "" + st[sp - 1]; if (ol + s.length > 65536) throw 11; ol += out.write(s, ol, "ascii"); sp--; } break;
        case 81: U(1); if (ol >= 65536) throw 11; out[ol++] = st[--sp] & 255; break;
        case 82: P(ip < inp.length ? inp[ip++] : -1); break;
        case 83: U(1); throw st[sp - 1] & 255;
      }
      pc = nx;
    }
  } catch (e) {
    if (typeof e !== "number") throw e;
    code = e;
  }
  mkdirSync(O + "/" + id, { recursive: true });
  writeFileSync(O + "/" + id + "/stdout.bin", out.subarray(0, ol));
  writeFileSync(O + "/" + id + "/exit.txt", code + "\n");
}
