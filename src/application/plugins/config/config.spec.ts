import { faker } from '@faker-js/faker';
import schemaEnv from 'env-schema';
import { configSchema, configsPlugin } from './config';
import { AppM } from '../../common/mocks/app';

jest.mock('env-schema');

const secretM = faker.string.sample();
const envSchemaM = jest.fn().mockImplementation(() => ({ secret: secretM }));
jest.mocked(schemaEnv).mockImplementation(envSchemaM);

describe('ConfigsPlugin', () => {
  let app: AppM;

  beforeEach(async () => {
    app = AppM.build();
  });

  it('should parse configuration', async () => {
    await app.register(configsPlugin);

    expect(envSchemaM).toHaveBeenCalledTimes(1);
    expect(envSchemaM).toHaveBeenCalledWith({
      schema: configSchema,
      dotenv: true,
    });
    expect(app.getServer().config).toEqual({ secret: secretM });
  });
});
