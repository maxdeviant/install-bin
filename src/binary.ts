export interface Binary {
  name: string;
  url: string;
}

export interface CreateBinaryParams {
  name: string;
  url: string;
}

export const binary = ({ name, url }: CreateBinaryParams): Binary => {
  return { name, url };
};
