export abstract class MockModel<T> {
    protected abstract entityStub: T;

    constructor(createEntityData: T) {
        this.constructorSpy(createEntityData);
    }

    constructorSpy(_createEntityData: T): void { }

    async findById(): Promise<T> {
        return this.entityStub;
    }

    async findOne(): Promise<T> {
        return this.entityStub;
    }

    async find(): Promise<T[]> {
        return [this.entityStub];
    }

    async create(): Promise<T> {
        return this.entityStub;
    }

    // async save(): Promise<void> { }

    async updateOne(): Promise<{ modifiedCount: number }> {
        return { modifiedCount: 1 };
    }
}