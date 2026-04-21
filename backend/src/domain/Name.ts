export class Name {
  constructor(readonly value: string) {
    if (!value.match(/[a-zA-Z]+ [a-zA-Z]/)) throw new Error("Invalid name");
  }

  getValue() {
    return this.value;
  }
}
