import { expect, test } from "@jest/globals";
import { Document } from "../src/domain/Document";

test.each(["97456321558", "71428793860", "87748248800"])(
  "Deve testar um cpf válido %s",
  (cpf: string) => {
    expect(() => new Document(cpf)).not.toThrow();
  }
);

test.each([null, undefined, "111111111111", "1111111111", "11111111111111"])(
  "Deve testar um cpf inválido %s",
  (cpf: any) => {
    expect(() => new Document(cpf)).toThrow("Invalid document");
  }
);
