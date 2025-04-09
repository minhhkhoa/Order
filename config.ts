import { z } from "zod";

//- định nghĩa caç biến trong file .env
const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_URL: z.string(),
});

//- kieemr tra xem caç biến trong file .env co hop le khong
const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
}); //-Nếu api là một chuỗi hợp lệ, configProject.success sẽ là true và configProject.data sẽ chứa đối tượng đã được parse

if(!configProject.success){
  throw new Error('Các giá trị khai báo trong file .env không hợp lệ');
}

const envConfig = configProject.data;

export default envConfig;