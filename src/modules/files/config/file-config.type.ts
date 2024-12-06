export enum FileDriver {
  LOCAL = 'local',
}

export type FileConfig = {
  driver: FileDriver;
  maxFileSize: number;
};
