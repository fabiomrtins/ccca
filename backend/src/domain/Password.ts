export class Password {
  constructor(readonly value: string) {
    if (
      !value ||
      value.length < 8 ||
      !value.match(/[a-z]/) ||
      !value.match(/[A-Z]/) ||
      !value.match(/[0-9]/)
    ) {
      throw new Error("Invalid password");
    }
  }

  getValue() {
    return this.value;
  }
}