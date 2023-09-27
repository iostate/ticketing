class CustomError<Type> {
  name: Type;
  constructor(name: Type) {
    this.name = name;
  }
}

const ce = new CustomError<number>(14);

console.log(ce);
