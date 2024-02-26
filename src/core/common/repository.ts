export interface Repository<Entity> {
  save(data: any): Promise<Entity>;
}
