
class StoredProcedure {
    public name: string;
    public parameters: string[];

    constructor(name: string, parameters: string[]) {
        this.name = name;
        this.parameters = parameters;
    }
}

export default StoredProcedure