import { DishStatusValues } from "@/constants/type";
import z from "zod";

export const CreateDishBody = z.object({
  name: z
    .string({ message: "Vui lòng nhập tên món" })
    .min(1, { message: "Tên món không được để trống" })
    .max(256, { message: "Tên món không vượt quá 256 ký tự" }),

  price: z.coerce
    .number({ message: "Giá phải là số hợp lệ" })
    .positive({ message: "Giá phải lớn hơn 0" }),

  description: z
    .string({ message: "Vui lòng nhập mô tả" })
    .max(10000, { message: "Mô tả không vượt quá 10000 ký tự" }),

  image: z
    .string({ message: "Vui lòng nhập URL hình ảnh" })
    .url({ message: "Hình ảnh phải là một URL hợp lệ" }),

  status: z
    .enum(DishStatusValues, { message: "Trạng thái món không hợp lệ" })
    .optional(),
});

export type CreateDishBodyType = z.TypeOf<typeof CreateDishBody>;

export const DishSchema = z.object({
  id: z.number({ message: "ID phải là số" }),
  name: z.string({ message: "Tên món không hợp lệ" }),
  price: z.coerce.number({ message: "Giá phải là số hợp lệ" }),
  description: z.string({ message: "Mô tả không hợp lệ" }),
  image: z.string({ message: "Hình ảnh không hợp lệ" }),
  status: z.enum(DishStatusValues, { message: "Trạng thái món không hợp lệ" }),
  createdAt: z.date({ message: "Ngày tạo không hợp lệ" }),
  updatedAt: z.date({ message: "Ngày cập nhật không hợp lệ" }),
});

export const DishRes = z.object({
  data: DishSchema,
  message: z.string({ message: "Thông báo không hợp lệ" }),
});
export type DishResType = z.TypeOf<typeof DishRes>;

export const DishListRes = z.object({
  data: z.array(DishSchema, { message: "Danh sách món không hợp lệ" }),
  message: z.string({ message: "Thông báo không hợp lệ" }),
});
export type DishListResType = z.TypeOf<typeof DishListRes>;

export const UpdateDishBody = CreateDishBody;
export type UpdateDishBodyType = CreateDishBodyType;

export const DishParams = z.object({
  id: z.coerce.number({ message: "ID phải là số hợp lệ" }),
});
export type DishParamsType = z.TypeOf<typeof DishParams>;
