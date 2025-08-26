import { Role, RoleValues } from "@/constants/type";
import z from "zod";

export const AccountSchema = z.object({
  id: z.number({ message: "ID phải là số" }),
  name: z.string({ message: "Vui lòng nhập tên" }),
  email: z.string({ message: "Vui lòng nhập email" }),
  role: z.string({ message: "Vui lòng nhập vai trò" }),
  avatar: z.string({ message: "Ảnh đại diện không hợp lệ" }).nullable(),
});

export type AccountType = z.TypeOf<typeof AccountSchema>;

export const AccountListRes = z.object({
  data: z.array(AccountSchema, { message: "Danh sách tài khoản không hợp lệ" }),
  message: z.string({ message: "Thông báo không hợp lệ" }),
});

export type AccountListResType = z.TypeOf<typeof AccountListRes>;

export const AccountRes = z
  .object({
    data: AccountSchema,
    message: z.string({ message: "Thông báo không hợp lệ" }),
  })
  .strict();

export type AccountResType = z.TypeOf<typeof AccountRes>;

export const CreateEmployeeAccountBody = z
  .object({
    name: z
      .string({ message: "Vui lòng nhập tên" })
      .trim()
      .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
      .max(256, { message: "Tên không được vượt quá 256 ký tự" }),
    email: z
      .string({ message: "Vui lòng nhập email" })
      .email({ message: "Email không hợp lệ" }),
    avatar: z
      .string({ message: "Đường dẫn ảnh không hợp lệ" })
      .url({ message: "URL ảnh không hợp lệ" })
      .optional(),
    password: z
      .string({ message: "Vui lòng nhập mật khẩu" })
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự" }),
    confirmPassword: z
      .string({ message: "Vui lòng nhập lại mật khẩu" })
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự" }),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type CreateEmployeeAccountBodyType = z.TypeOf<
  typeof CreateEmployeeAccountBody
>;

export const UpdateEmployeeAccountBody = z
  .object({
    name: z
      .string({ message: "Vui lòng nhập tên" })
      .trim()
      .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
      .max(256, { message: "Tên không được vượt quá 256 ký tự" }),
    email: z
      .string({ message: "Vui lòng nhập email" })
      .email({ message: "Email không hợp lệ" }),
    avatar: z
      .string({ message: "Đường dẫn ảnh không hợp lệ" })
      .url({ message: "URL ảnh không hợp lệ" })
      .optional(),
    changePassword: z.boolean({ message: "Giá trị không hợp lệ" }).optional(),
    password: z
      .string({ message: "Vui lòng nhập mật khẩu" })
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự" })
      .optional(),
    confirmPassword: z
      .string({ message: "Vui lòng nhập lại mật khẩu" })
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(100, { message: "Mật khẩu không được vượt quá 100 ký tự" })
      .optional(),
    role: z.enum([Role.Owner, Role.Employee]).optional().default(Role.Employee),
  })
  .strict()
  .superRefine(({ confirmPassword, password, changePassword }, ctx) => {
    if (changePassword) {
      if (!password || !confirmPassword) {
        ctx.addIssue({
          code: "custom",
          message: "Hãy nhập mật khẩu mới và xác nhận mật khẩu mới",
          path: ["changePassword"],
        });
      } else if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "Mật khẩu không khớp",
          path: ["confirmPassword"],
        });
      }
    }
  });

export type UpdateEmployeeAccountBodyType = z.TypeOf<
  typeof UpdateEmployeeAccountBody
>;

export const UpdateMeBody = z
  .object({
    name: z
      .string({ message: "Vui lòng nhập tên" })
      .trim()
      .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
      .max(256, { message: "Tên không được vượt quá 256 ký tự" }),
    avatar: z
      .string({ message: "Đường dẫn ảnh không hợp lệ" })
      .url({ message: "URL ảnh không hợp lệ" })
      .optional(),
  })
  .strict();

export type UpdateMeBodyType = z.TypeOf<typeof UpdateMeBody>;

export const ChangePasswordBody = z
  .object({
    oldPassword: z
      .string({ message: "Vui lòng nhập mật khẩu cũ" })
      .min(6, { message: "Mật khẩu cũ phải có ít nhất 6 ký tự" })
      .max(100, { message: "Mật khẩu cũ không được vượt quá 100 ký tự" }),
    password: z
      .string({ message: "Vui lòng nhập mật khẩu mới" })
      .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" })
      .max(100, { message: "Mật khẩu mới không được vượt quá 100 ký tự" }),
    confirmPassword: z
      .string({ message: "Vui lòng nhập lại mật khẩu mới" })
      .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" })
      .max(100, { message: "Mật khẩu mới không được vượt quá 100 ký tự" }),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu mới không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>;

export const AccountIdParam = z.object({
  id: z.coerce.number({ message: "ID phải là số" }),
});

export type AccountIdParamType = z.TypeOf<typeof AccountIdParam>;

export const GetListGuestsRes = z.object({
  data: z.array(
    z.object({
      id: z.number({ message: "ID phải là số" }),
      name: z.string({ message: "Vui lòng nhập tên" }),
      tableNumber: z.number({ message: "Số bàn phải là số" }).nullable(),
      createdAt: z.date({ message: "Ngày tạo không hợp lệ" }),
      updatedAt: z.date({ message: "Ngày cập nhật không hợp lệ" }),
    }),
    { message: "Danh sách khách không hợp lệ" }
  ),
  message: z.string({ message: "Thông báo không hợp lệ" }),
});

export type GetListGuestsResType = z.TypeOf<typeof GetListGuestsRes>;

export const GetGuestListQueryParams = z.object({
  fromDate: z.coerce.date({ message: "Ngày bắt đầu không hợp lệ" }).optional(),
  toDate: z.coerce.date({ message: "Ngày kết thúc không hợp lệ" }).optional(),
});

export type GetGuestListQueryParamsType = z.TypeOf<
  typeof GetGuestListQueryParams
>;

export const CreateGuestBody = z
  .object({
    name: z
      .string({ message: "Vui lòng nhập tên" })
      .trim()
      .min(2, { message: "Tên phải có ít nhất 2 ký tự" })
      .max(256, { message: "Tên không được vượt quá 256 ký tự" }),
    tableNumber: z.number({ message: "Số bàn phải là số" }),
  })
  .strict();

export type CreateGuestBodyType = z.TypeOf<typeof CreateGuestBody>;

export const CreateGuestRes = z.object({
  message: z.string({ message: "Thông báo không hợp lệ" }),
  data: z.object({
    id: z.number({ message: "ID phải là số" }),
    name: z.string({ message: "Vui lòng nhập tên" }),
    role: z.enum(RoleValues, { message: "Vai trò không hợp lệ" }),
    tableNumber: z.number({ message: "Số bàn phải là số" }).nullable(),
    createdAt: z.date({ message: "Ngày tạo không hợp lệ" }),
    updatedAt: z.date({ message: "Ngày cập nhật không hợp lệ" }),
  }),
});

export type CreateGuestResType = z.TypeOf<typeof CreateGuestRes>;
