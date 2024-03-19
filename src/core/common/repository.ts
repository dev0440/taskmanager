export interface Repository<Entity> {
  save(data: any): Promise<Entity>;
  get(data: any): Promise<Entity[]>;
}
