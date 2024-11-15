export interface IBaseUseCase<I = void, R = void> {
    execute(
        dto: I extends void | null | undefined | never ? never : I,
    ): Promise<R>;
}
