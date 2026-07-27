export default abstract class BaseRepository<
  TEntity,
  TCreateInput,
  TId = string
> {
  abstract create(data: TCreateInput): Promise<TEntity>

  abstract findByEmail(email: string): Promise<TEntity | null>
}
