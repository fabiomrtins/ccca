export class Email {
  constructor(readonly value: string) {
    if (!value || !value.match(/.+@.+\..+/)) {
      throw new Error("Invalid e-mail");
    }
  }

  getValue() {
    return this.value;
  }
} 