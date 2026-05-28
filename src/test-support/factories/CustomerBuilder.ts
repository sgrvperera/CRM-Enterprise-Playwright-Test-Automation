export class CustomerBuilder {
  private payload = {
    name: 'Enterprise Customer',
    email: `customer+${Date.now()}@example.com`,
    status: 'Prospect',
  };

  setName(name: string) {
    this.payload.name = name;
    return this;
  }

  setEmail(email: string) {
    this.payload.email = email;
    return this;
  }

  setStatus(status: string) {
    this.payload.status = status;
    return this;
  }

  build() {
    return { ...this.payload };
  }
}
