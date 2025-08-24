"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useDishListQuery } from "@/queries/useDish";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import { useMemo, useState } from "react";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useGuestOrderMutation } from "@/queries/useGuest";
import { DishStatus } from "@/constants/type";
import { useRouter } from "next/navigation";
import Quantity from "./quantity";

export default function MenuOrder() {
  const { data } = useDishListQuery();
  const dishes = useMemo(() => data?.payload.data ?? [], [data]);
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const { mutateAsync } = useGuestOrderMutation();
  const router = useRouter();
  // React 19 hoặc Next.js 15 thì không cần dùng useMemo chỗ này
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        //- slg = 0 thi xoa di order day
        return prevOrders.filter((order) => order.dishId !== dishId);
      }

      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        //- Nếu món chưa có trong giỏ → thêm mới.
        return [...prevOrders, { dishId, quantity }];
      }

      //- Nếu món đã có → cập nhật lại quantity.
      const newOrders = [...prevOrders];

      //- Cập nhật lai quantity cho index dang chon
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };

  const handleOrder = async () => {
    try {
      await mutateAsync(orders);
      router.push(`/guest/orders`);
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };
  return (
    <>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn("flex gap-4", {
              "pointer-events-none": dish.status === DishStatus.Unavailable,
            })}
          >
            <div className="flex-shrink-0 relative">
              {dish.status === DishStatus.Unavailable && (
                <>
                  <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
                  <span className="absolute z-20 inset-0 text-white flex items-center justify-center text-sm">
                    Hết hàng
                  </span>
                </>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className="object-cover w-[80px] h-[80px] rounded-md"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold">{dish.name}</h3>
              <p className="text-xs line-clamp-2">{dish.description}</p>
              <p className="text-xs font-semibold text-yellow-400">
                {formatCurrency(dish.price)}
              </p>
            </div>
            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              <Quantity
                onChange={(value) => handleQuantityChange(dish.id, value)}
                value={
                  orders.find((order) => order.dishId === dish.id)?.quantity ??
                  0
                }
              />
            </div>
          </div>
        ))}
      <div className="sticky bottom-0">
        <Button
          className="w-full justify-between"
          onClick={handleOrder}
          disabled={orders.length === 0}
        >
          <span>Đặt hàng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </>
  );
}
