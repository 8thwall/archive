import type {Dialect, Options} from 'sequelize/types'

declare type ConnectionOptions = {
    connectionType: 'test' | 'test-local-pg' | 'dev' | 'production' | 'development' | 'local';
    executableName: string;
    deploymentStage: string;
};
declare type DbSecret = {
    username: string;
    password: string;
    engine: Dialect;
    host: string;
    port: number;
    dbname: string;
    dbInstanceIdentifier: string;
};
declare const sanitizeDbSecret: (dbSecret: DbSecret) => Options
declare const getSequelizeOptionsForEnv: ({
  connectionType, executableName, deploymentStage,
}: ConnectionOptions) => Options
export {getSequelizeOptionsForEnv, sanitizeDbSecret}
